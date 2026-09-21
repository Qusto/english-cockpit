// Минимальный клиент AnkiConnect (POST JSON {action, version, params}).
// Документация действий: https://foosoft.net/projects/anki-connect

import {
  ANKI_CONNECT_VERSION,
  VOCAB_FIELDS,
  VOCAB_CARD_FRONT,
  VOCAB_CARD_BACK,
  VOCAB_CARD_CSS,
} from "./model.js";

export async function ankiInvoke(ankiUrl, action, params = {}) {
  const res = await fetch(ankiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, version: ANKI_CONNECT_VERSION, params }),
  });
  if (!res.ok) {
    throw new Error(
      `AnkiConnect ответил ${res.status}. Убедись, что Anki запущен, AnkiConnect установлен ` +
      `и origin разрешён в webCorsOriginList.`
    );
  }
  const data = await res.json();
  if (data.error) throw new Error(`AnkiConnect: ${data.error}`);
  return data.result;
}

export async function ankiPing(ankiUrl) {
  return ankiInvoke(ankiUrl, "version");
}

// Создаёт колоду и note type «Cockpit Vocabulary», если их ещё нет.
export async function ensureCockpitModel(ankiUrl, deck) {
  const decks = await ankiInvoke(ankiUrl, "deckNames");
  if (!decks.includes(deck)) await ankiInvoke(ankiUrl, "createDeck", { deck });

  const models = await ankiInvoke(ankiUrl, "modelNames");
  if (!models.includes("Cockpit Vocabulary")) {
    await ankiInvoke(ankiUrl, "createModel", {
      modelName: "Cockpit Vocabulary",
      inOrderFields: VOCAB_FIELDS,
      css: VOCAB_CARD_CSS,
      cardTemplates: [{ Name: "Card 1", Front: VOCAB_CARD_FRONT, Back: VOCAB_CARD_BACK }],
    });
  }
}

// Дедупликация: ищем заметку с тем же lemma в нашей колоде.
export async function findExistingNote(ankiUrl, deck, lemma) {
  const ids = await ankiInvoke(ankiUrl, "findNotes", {
    query: `deck:${deck} "note:Cockpit Vocabulary" Lemma:${lemma}`,
  });
  return ids && ids.length ? ids[0] : null;
}

export async function addVocabNote(ankiUrl, deck, fields) {
  await ensureCockpitModel(ankiUrl, deck);
  const existing = await findExistingNote(ankiUrl, deck, fields.Lemma);
  if (existing) return { noteId: existing, duplicate: true };
  const noteId = await ankiInvoke(ankiUrl, "addNote", {
    note: {
      deckName: deck,
      modelName: "Cockpit Vocabulary",
      fields,
      options: { allowDuplicate: false },
      tags: ["cockpit"],
    },
  });
  return { noteId, duplicate: false };
}

// Сколько карт ждёт повторения (для статуса/Flight Plan).
export async function dueCardCount(ankiUrl, deck) {
  const ids = await ankiInvoke(ankiUrl, "findCards", { query: `deck:${deck} is:due` });
  return ids.length;
}
