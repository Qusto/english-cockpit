// English Cockpit 2.0 — content script.
// Option(Alt) + hover на слове → popup с переводом; клавиши A/E/P над открытым popup.
// Popup «приколочен» пока не закрыт Esc / кликом мимо / новым hover.

(() => {
  "use strict";

  const WORD_RE = /[A-Za-z'’\-]/;
  const MIN_WORD = 2;

  let popup = null;          // {root, el, shadow}
  let current = null;        // {word, sentence, context, rect, data?, explaining}
  let hoverTimer = null;
  let lastKey = "";
  let altDown = false;

  /* ---------------- извлечение слова/контекста ---------------- */

  function wordAtPoint(x, y) {
    const range = document.caretRangeFromPoint && document.caretRangeFromPoint(x, y);
    if (!range) return null;
    const node = range.startContainer;
    if (!node || node.nodeType !== Node.TEXT_NODE) return null;
    const text = node.data;
    let i = range.startOffset;
    if (i >= text.length) i = text.length - 1;
    if (i < 0 || !WORD_RE.test(text[i])) return null;
    let s = i, e = i;
    while (s > 0 && WORD_RE.test(text[s - 1])) s--;
    while (e < text.length - 1 && WORD_RE.test(text[e + 1])) e++;
    const word = text.slice(s, e + 1).replace(/^[-'’]+|[-'’]+$/g, "");
    if (word.length < MIN_WORD || /^\d/.test(word)) return null;
    return { word, node, s, e };
  }

  function sentenceAround(node, s, e) {
    const text = node.data;
    // границы предложения внутри текстового узла
    let a = s, b = e;
    while (a > 0 && !/[.!?…\n]/.test(text[a - 1])) a--;
    while (b < text.length - 1 && !/[.!?…\n]/.test(text[b + 1])) b++;
    let sentence = text.slice(a, b + 1).trim();
    // если узел — огрызок (стримы, разметка), берём родителя
    if (sentence.length < 40 && node.parentElement) {
      const whole = node.parentElement.innerText || "";
      const pos = whole.indexOf(sentence);
      if (pos >= 0) {
        let pa = pos, pb = pos + sentence.length - 1;
        while (pa > 0 && !/[.!?…\n]/.test(whole[pa - 1])) pa--;
        while (pb < whole.length - 1 && !/[.!?…\n]/.test(whole[pb + 1])) pb++;
        sentence = whole.slice(pa, pb + 1).trim();
      }
    }
    const whole = (node.parentElement && node.parentElement.innerText) || text;
    const idx = whole.indexOf(sentence);
    const ctx = idx >= 0
      ? whole.slice(Math.max(0, idx - 160), idx + sentence.length + 160).trim()
      : sentence;
    return { sentence: sentence.slice(0, 500), context: ctx.slice(0, 600) };
  }

  /* ---------------- popup (shadow DOM) ---------------- */

  const CSS = `
    :host { all: initial; }
    .pop { position: fixed; z-index: 2147483647; width: 320px; max-width: 90vw;
      font: 14px/1.45 -apple-system, "Segoe UI", Roboto, sans-serif;
      background: #1f1d1a; color: #f2ede4; border-radius: 10px;
      box-shadow: 0 8px 30px rgba(0,0,0,.35); padding: 14px 14px 10px; }
    .w { font-size: 19px; font-weight: 700; }
    .lemma { color: #b7ad9c; font-size: 12px; margin-left: 6px; }
    .ipa { color: #8f8678; font-family: monospace; font-size: 12px; }
    .tr { margin-top: 6px; font-size: 15px; }
    .def, .ctxm { margin-top: 4px; color: #cfc7b8; font-size: 13px; }
    .ctxm { font-style: italic; }
    .coll { margin-top: 6px; color: #d8b96a; font-size: 13px; white-space: pre-line; }
    .badge { display: inline-block; font-size: 11px; border: 1px solid #6a6154;
      border-radius: 4px; padding: 0 5px; margin-left: 6px; color: #b7ad9c; }
    .row { margin-top: 10px; display: flex; gap: 6px; }
    button { flex: 1; font: 12px/1 -apple-system, sans-serif; padding: 7px 0;
      border-radius: 6px; border: 1px solid #6a6154; background: #2b2823;
      color: #f2ede4; cursor: pointer; }
    button:hover { background: #3a352e; }
    .hint { margin-top: 8px; font-size: 11px; color: #8f8678; }
    .status { margin-top: 6px; font-size: 12px; min-height: 14px; }
    .status.ok { color: #7fc98f; } .status.err { color: #e08c7d; }
    .explain { margin-top: 8px; font-size: 13px; color: #e6ddcb;
      border-top: 1px solid #3a352e; padding-top: 8px; white-space: pre-wrap; }
    .loading { color: #8f8678; }
  `;

  function ensurePopup() {
    if (popup) return popup;
    const host = document.createElement("div");
    host.id = "ec-popup-host";
    const shadow = host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = CSS;
    const el = document.createElement("div");
    el.className = "pop";
    el.innerHTML = `
      <div class="top"></div>
      <div class="body loading">…</div>
      <div class="status"></div>
      <div class="explain" style="display:none"></div>
      <div class="row">
        <button data-k="a" title="добавить карточку в Anki">A · в Anki</button>
        <button data-k="e" title="объяснить в контексте">E · объяснить</button>
        <button data-k="p" title="произнести">P · звук</button>
      </div>
      <div class="hint">A — добавить · E — объяснить · P — произнести · Esc — закрыть</div>`;
    shadow.appendChild(style);
    shadow.appendChild(el);
    document.documentElement.appendChild(host);
    el.querySelectorAll("button").forEach(b =>
      b.addEventListener("mousedown", ev => { ev.preventDefault(); act(b.dataset.k); }));
    popup = { host, el, shadow };
    return popup;
  }

  function placePopup(rect) {
    const { el } = ensurePopup();
    const w = 320, h = el.offsetHeight || 220;
    let x = Math.min(Math.max(8, rect.left), window.innerWidth - w - 8);
    let y = rect.bottom + 8;
    if (y + h > window.innerHeight - 8) y = rect.top - h - 8;
    el.style.left = x + "px";
    el.style.top = Math.max(8, y) + "px";
  }

  function renderLookup(data) {
    const { el } = ensurePopup();
    el.querySelector(".top").innerHTML =
      `<span class="w"></span><span class="lemma"></span><span class="ipa"></span>` +
      (data.cefr ? `<span class="badge">${data.cefr}</span>` : "") +
      (data.priority === "high" ? `<span class="badge">★ ценное</span>` : "");
    el.querySelector(".w").textContent = current.word;
    el.querySelector(".lemma").textContent =
      data.lemma && data.lemma !== current.word ? `→ ${data.lemma}` : "";
    el.querySelector(".ipa").textContent = data.ipa || "";
    let html = `<div class="tr"></div><div class="def"></div><div class="ctxm"></div>`;
    if (data.collocations && data.collocations.length)
      html += `<div class="coll"></div>`;
    el.querySelector(".body").classList.remove("loading");
    el.querySelector(".body").innerHTML = html;
    el.querySelector(".tr").textContent = data.translation || "";
    el.querySelector(".def").textContent = data.definition || "";
    el.querySelector(".ctxm").textContent = data.contextMeaning || "";
    const c = el.querySelector(".coll");
    if (c) c.textContent = data.collocations.join("\n");
  }

  function setStatus(text, cls = "") {
    if (!popup) return;
    const s = popup.el.querySelector(".status");
    s.textContent = text;
    s.className = "status " + cls;
  }

  function closePopup() {
    if (popup) { popup.host.remove(); popup = null; }
    current = null; lastKey = "";
  }

  /* ---------------- действия ---------------- */

  async function send(msg) {
    try { return await chrome.runtime.sendMessage(msg); }
    catch (e) { return { ok: false, error: "расширение перезагружено — обнови страницу" }; }
  }

  async function act(k) {
    if (!current) return;
    if (k === "p") {
      const u = new SpeechSynthesisUtterance(current.word);
      u.lang = "en-US"; speechSynthesis.speak(u);
      return;
    }
    if (k === "e") {
      const ex = popup.el.querySelector(".explain");
      ex.style.display = "block"; ex.textContent = "…";
      const r = await send({ type: "explain",
        payload: { word: current.word, sentence: current.sentence } });
      ex.textContent = r.ok ? r.data : ("Ошибка: " + r.error);
      return;
    }
    if (k === "a") {
      setStatus("сохраняю в Anki…");
      const payload = {
        word: current.word, sentence: current.sentence,
        sourceTitle: document.title, sourceUrl: location.href,
        ...(current.data || {}),
      };
      const r = await send({ type: "addCard", payload });
      if (!r.ok) { setStatus(r.error, "err"); return; }
      if (r.data.duplicate) setStatus(`уже в Anki · сегодня +${r.data.today}`, "ok");
      else if (r.data.today > r.data.limit)
        setStatus(`✓ в Anki · сегодня +${r.data.today} — больше лимита ${r.data.limit}, хватит на сегодня`, "err");
      else setStatus(`✓ в Anki · сегодня +${r.data.today}`, "ok");
    }
  }

  /* ---------------- события ---------------- */

  async function lookupAt(x, y) {
    const hit = wordAtPoint(x, y);
    if (!hit) return;
    const { sentence, context } = sentenceAround(hit.node, hit.s, hit.e);
    const key = hit.word + "|" + sentence;
    if (key === lastKey && popup) return;
    lastKey = key;
    const range = document.createRange();
    range.setStart(hit.node, hit.s); range.setEnd(hit.node, hit.e + 1);
    current = { word: hit.word, sentence, context,
      rect: range.getBoundingClientRect(), data: null };
    placePopup(current.rect);
    popup.el.querySelector(".body").className = "body loading";
    popup.el.querySelector(".body").textContent = "…";
    popup.el.querySelector(".top").innerHTML = `<span class="w"></span>`;
    popup.el.querySelector(".top .w").textContent = hit.word;
    popup.el.querySelector(".explain").style.display = "none";
    setStatus("");
    const r = await send({ type: "lookup",
      payload: { word: hit.word, sentence, context } });
    if (!popup || !current || lastKey !== key) return; // уже другой попап
    if (r.ok) { current.data = r.data; renderLookup(r.data); }
    else {
      popup.el.querySelector(".body").classList.remove("loading");
      popup.el.querySelector(".body").textContent = "Ошибка: " + r.error;
      if (/API-ключ/i.test(r.error)) setStatus("открой настройки расширения", "err");
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Alt") { altDown = true; return; }
    if (e.key === "Escape") { closePopup(); return; }
    if (!popup) return;
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    const k = e.key.toLowerCase();
    if (k === "a" || k === "ф") { e.preventDefault(); act("a"); }
    else if (k === "e" || k === "у") { e.preventDefault(); act("e"); }
    else if (k === "p" || k === "з") { e.preventDefault(); act("p"); }
  }, true);

  document.addEventListener("keyup", (e) => {
    if (e.key === "Alt") altDown = false;
  }, true);

  document.addEventListener("mousemove", (e) => {
    if (!altDown && !e.altKey) return;
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    if (popup && popup.host.contains(e.target)) return;
    clearTimeout(hoverTimer);
    const x = e.clientX, y = e.clientY;
    hoverTimer = setTimeout(() => lookupAt(x, y), 280);
  }, { passive: true });

  document.addEventListener("mousedown", (e) => {
    if (popup && !popup.host.contains(e.target)) closePopup();
  }, true);

  window.addEventListener("scroll", closePopup, { passive: true, capture: true });
})();
