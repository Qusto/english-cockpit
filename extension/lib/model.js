// Общие константы English Cockpit 2.0 — используются и расширением, и app/.
// Держать синхронно с docs/prd_anki.md (раздел «Anki Note Types»).

export const ANKI_CONNECT_URL = "http://localhost:8765";
export const ANKI_CONNECT_VERSION = 6;

export const DECK_NAME = "Cockpit";

export const NOTE_TYPE_VOCAB = "Cockpit Vocabulary";
export const NOTE_TYPE_ERROR = "Cockpit Error";
export const NOTE_TYPE_CHUNK = "Cockpit Chunk";

// Поля note type «Cockpit Vocabulary» = LexicalItem из PRD.
// ContextCloze — предложение с замаскированным словом (лицевая сторона карточки).
export const VOCAB_FIELDS = [
  "Word",           // surface form, как в тексте (mitigating)
  "Lemma",          // mitigate
  "TranslationRU",
  "DefinitionEN",
  "Context",        // предложение-источник
  "ContextCloze",   // то же предложение, слово замаскировано ___
  "Collocations",   // по одной на строку
  "IPA",
  "Audio",
  "Source",         // заголовок страницы
  "SourceURL",
  "CreatedAt",
  "ActivationCount",
  "Status",         // seen | saved | learning | recalled | used | activated
  "UsageDates",     // ISO-даты через запятую
  "LastUsedAt",
];

export const VOCAB_CARD_FRONT = `
<div class="ck-word">{{Lemma}}</div>
<div class="ck-ctx">{{ContextCloze}}</div>
`;

export const VOCAB_CARD_BACK = `
{{FrontSide}}
<hr>
<div class="ck-answer">
  <div class="ck-word">{{Lemma}}</div>
  <div class="ck-tr">{{TranslationRU}}</div>
  <div class="ck-def">{{DefinitionEN}}</div>
  <div class="ck-coll">{{Collocations}}</div>
  <div class="ck-ipa">{{IPA}}</div>
  <div class="ck-src"><a href="{{SourceURL}}">{{Source}}</a></div>
</div>
`;

export const VOCAB_CARD_CSS = `
.card { font-family: -apple-system, "Segoe UI", sans-serif; font-size: 18px; line-height: 1.5; color: #1c1a17; background: #faf8f4; padding: 24px; }
.ck-word { font-size: 26px; font-weight: 700; margin-bottom: 10px; }
.ck-ctx { color: #555; font-style: italic; }
.ck-tr { font-size: 20px; margin: 8px 0; }
.ck-def { color: #555; margin: 6px 0; }
.ck-coll { color: #7a5c2e; white-space: pre-line; margin: 8px 0; }
.ck-ipa { color: #888; font-family: monospace; }
.ck-src { margin-top: 12px; font-size: 13px; color: #999; }
.ck-src a { color: #999; }
`;

// Лимит новых lexical items в день (PRD §15)
export const DAILY_NEW_LIMIT = 8;

export const DEFAULT_SETTINGS = {
  apiKey: "",
  baseUrl: "https://openrouter.ai/api/v1/chat/completions",
  model: "google/gemini-2.5-flash",
  ankiUrl: ANKI_CONNECT_URL,
  deck: DECK_NAME,
};
