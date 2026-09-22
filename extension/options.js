// Страница настроек расширения: поля ↔ chrome.storage.local, кнопки проверки.

import { DEFAULT_SETTINGS } from "./lib/model.js";

const FIELDS = ["apiKey", "baseUrl", "model", "ankiUrl", "deck"];
const statusEl = document.getElementById("status");

function setStatus(text, ok) {
  statusEl.textContent = text;
  statusEl.className = "status " + (ok === true ? "ok" : ok === false ? "err" : "");
}

async function load() {
  const s = await chrome.storage.local.get(FIELDS);
  FIELDS.forEach(f => { document.getElementById(f).value = s[f] ?? DEFAULT_SETTINGS[f]; });
}

async function save() {
  const s = {};
  FIELDS.forEach(f => { s[f] = document.getElementById(f).value.trim(); });
  await chrome.storage.local.set(s);
  setStatus("Сохранено", true);
}

async function send(msg) {
  try { return await chrome.runtime.sendMessage(msg); }
  catch (e) { return { ok: false, error: String(e.message || e) }; }
}

document.getElementById("save").addEventListener("click", save);

document.getElementById("testLlm").addEventListener("click", async () => {
  await save();
  setStatus("Проверяю LLM…");
  const r = await send({ type: "llmPing" });
  setStatus(r.ok ? `LLM отвечает: «${String(r.data).trim()}»` : "LLM: " + r.error, r.ok);
});

document.getElementById("testAnki").addEventListener("click", async () => {
  await save();
  setStatus("Проверяю AnkiConnect…");
  const r = await send({ type: "ankiPing" });
  if (!r.ok) { setStatus("Anki: " + r.error, false); return; }
  const m = await send({ type: "ensureModel" });
  const due = r.data.due == null ? "" : ` · к повтору: ${r.data.due}`;
  setStatus(m.ok
    ? `AnkiConnect v${r.data.version} · колода и note type готовы${due}`
    : "Anki: " + m.error, m.ok);
});

load();
