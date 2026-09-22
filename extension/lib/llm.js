// Вызов OpenAI-совместимого LLM API (OpenRouter по умолчанию) — то же, что в cockpit v1.

export async function callLLM(settings, systemMsg, userMsg, temperature = 0.3) {
  const key = (settings.apiKey || "").trim();
  if (!key) throw new Error("Не задан API-ключ. Открой настройки расширения и вставь ключ OpenRouter.");
  const res = await fetch(settings.baseUrl, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + key,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://english-cockpit.local",
      "X-Title": "English Cockpit Extension",
    },
    body: JSON.stringify({
      model: settings.model,
      temperature,
      messages: [
        { role: "system", content: systemMsg },
        { role: "user", content: userMsg },
      ],
    }),
  });
  if (!res.ok) {
    let detail = "";
    try { detail = (await res.json())?.error?.message || ""; } catch (e) { /* ignore */ }
    throw new Error(`Провайдер ответил ${res.status}. ${detail || "Проверь ключ, модель и баланс."}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Пустой ответ модели.");
  return content;
}

// Извлекает JSON из ответа: снимает ```json ограждения и обрезает прозу вокруг.
export function extractJSON(text) {
  let t = text.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();
  const firstObj = t.indexOf("{");
  if (firstObj !== -1) {
    const end = t.lastIndexOf("}");
    if (end > firstObj) t = t.slice(firstObj, end + 1);
  }
  return JSON.parse(t);
}

export const LOOKUP_SYSTEM =
`You are a concise English vocabulary assistant for a Russian-speaking learner (A2-B1, goal B1+/B2).
The user hovers over a word in a real web page. Return ONLY a single JSON object, no prose, no code fences:
{
  "lemma": "dictionary form of the hovered word",
  "translation": "краткий перевод по-русски (1-2 варианта)",
  "definition": "short simple English definition (one sentence)",
  "contextMeaning": "what it means in THIS sentence specifically, in Russian, one line",
  "ipa": "US IPA transcription",
  "collocations": ["1-2 most useful collocations for active speaking"],
  "cefr": "A2|B1|B2|C1|C2",
  "priority": "high|medium|low — usefulness for an adult professional speaking English at work"
}
Rules: translation/contextMeaning in Russian; definition in English; collocations are phrases that fit everyday professional speech (e.g. "mitigate risk"). Keep every field short.`;

export function buildLookupUserMsg(word, sentence, context) {
  return `Word: "${word}"
Sentence: "${sentence}"
Context around: "${context}"`;
}

export const EXPLAIN_SYSTEM =
`You are an English coach for a Russian speaker. Explain the highlighted word/phrase in the given context:
meaning, why this exact word fits, one nuance or typical mistake, one more natural example sentence.
Answer in Russian, max 4 short lines. Plain text, no JSON, no markdown headers.`;

export function buildExplainUserMsg(word, sentence) {
  return `Word: "${word}"\nSentence: "${sentence}"`;
}
