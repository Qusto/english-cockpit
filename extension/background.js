// English Cockpit 2.0 — service worker расширения.
// Принимает сообщения от content script'а и options-страницы:
// lookup/explain → LLM, addCard/ping → AnkiConnect. Всё сетевое живёт здесь,
// чтобы content script не зависел от CORS страницы.

import {
  DEFAULT_SETTINGS, DAILY_NEW_LIMIT,
} from "./lib/model.js";
import {
  ankiPing, ensureCockpitModel, addVocabNote, dueCardCount,
} from "./lib/anki.js";
import {
  callLLM, extractJSON, LOOKUP_SYSTEM, buildLookupUserMsg,
  EXPLAIN_SYSTEM, buildExplainUserMsg,
} from "./lib/llm.js";

async function getSettings() {
  const s = await chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS));
  return { ...DEFAULT_SETTINGS, ...s };
}

// --- Дневной счётчик новых слов (лимит PRD: 5–8) ---
async function getTodayCount() {
  const today = new Date().toISOString().slice(0, 10);
  const { daily } = await chrome.storage.local.get("daily");
  return daily && daily.date === today ? daily.count : 0;
}
async function bumpTodayCount() {
  const today = new Date().toISOString().slice(0, 10);
  const { daily } = await chrome.storage.local.get("daily");
  const count = daily && daily.date === today ? daily.count + 1 : 1;
  await chrome.storage.local.set({ daily: { date: today, count } });
  return count;
}

// --- Кэш лукапов, чтобы hover по тому же слову не дёргал LLM ---
const lookupCache = new Map(); // key → promise/result; Map не переживает рестарт воркера — это ок

async function doLookup(payload) {
  const settings = await getSettings();
  const raw = await callLLM(
    settings, LOOKUP_SYSTEM,
    buildLookupUserMsg(payload.word, payload.sentence, payload.context)
  );
  const obj = extractJSON(raw);
  return {
    lemma: String(obj.lemma || payload.word),
    translation: String(obj.translation || ""),
    definition: String(obj.definition || ""),
    contextMeaning: String(obj.contextMeaning || ""),
    ipa: String(obj.ipa || ""),
    collocations: Array.isArray(obj.collocations) ? obj.collocations.map(String).slice(0, 3) : [],
    cefr: String(obj.cefr || ""),
    priority: String(obj.priority || ""),
  };
}

async function doExplain(payload) {
  const settings = await getSettings();
  return callLLM(settings, EXPLAIN_SYSTEM, buildExplainUserMsg(payload.word, payload.sentence));
}

function clozeContext(sentence, word) {
  // Маскируем первое вхождение слова в предложении (регистронезависимо)
  const re = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  return sentence.replace(re, "___");
}

async function doAddCard(payload) {
  const settings = await getSettings();
  const fields = {
    Word: payload.word,
    Lemma: payload.lemma || payload.word,
    TranslationRU: payload.translation || "",
    DefinitionEN: payload.definition || "",
    Context: payload.sentence || "",
    ContextCloze: clozeContext(payload.sentence || "", payload.word),
    Collocations: (payload.collocations || []).join("\n"),
    IPA: payload.ipa || "",
    Audio: "",
    Source: payload.sourceTitle || "",
    SourceURL: payload.sourceUrl || "",
    CreatedAt: new Date().toISOString(),
    ActivationCount: "0",
    Status: "saved",
    UsageDates: "",
    LastUsedAt: "",
  };
  const result = await addVocabNote(settings.ankiUrl, settings.deck, fields);
  let today = await getTodayCount();
  if (!result.duplicate) today = await bumpTodayCount();
  return { ...result, today, limit: DAILY_NEW_LIMIT };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const handle = async () => {
    try {
      switch (msg.type) {
        case "lookup": {
          const key = `${msg.payload.word}|${msg.payload.sentence}`;
          if (!lookupCache.has(key)) lookupCache.set(key, doLookup(msg.payload));
          return { ok: true, data: await lookupCache.get(key) };
        }
        case "explain":
          return { ok: true, data: await doExplain(msg.payload) };
        case "addCard":
          return { ok: true, data: await doAddCard(msg.payload) };
        case "ankiPing": {
          const s = await getSettings();
          const version = await ankiPing(s.ankiUrl);
          const due = await dueCardCount(s.ankiUrl, s.deck).catch(() => null);
          return { ok: true, data: { version, due } };
        }
        case "ensureModel": {
          const s = await getSettings();
          await ensureCockpitModel(s.ankiUrl, s.deck);
          return { ok: true, data: "Note type и колода готовы" };
        }
        case "llmPing": {
          const s = await getSettings();
          const r = await callLLM(s, "Reply with the single word: ok", "ping");
          return { ok: true, data: r.slice(0, 50) };
        }
        case "openOptions":
          await chrome.runtime.openOptionsPage();
          return { ok: true, data: null };
        case "todayCount":
          return { ok: true, data: { today: await getTodayCount(), limit: DAILY_NEW_LIMIT } };
        default:
          return { ok: false, error: `unknown message ${msg.type}` };
      }
    } catch (e) {
      return { ok: false, error: String(e && e.message || e) };
    }
  };
  handle().then(sendResponse);
  return true; // async sendResponse
});
