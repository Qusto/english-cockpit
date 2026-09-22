# English Cockpit 2.0
## Spoken English Accelerator

**Статус:** Draft PRD  
**Горизонт программы:** 8 недель  
**Основная цель:** разговорный английский  
**Стартовый уровень пользователя:** плавающий A2–B1  
**Целевой уровень:** стабильный B1/B1+ с выходом отдельных навыков и рабочих сценариев на B2

---

# 1. Vision

English Cockpit должен превратиться из тренажёра отдельных разговорных сессий в **персональную систему ускоренного развития разговорного английского**.

Основная идея:

> Всё английское, с которым пользователь сталкивается в течение дня — статьи, видео, рабочие материалы, собственные ошибки, разговоры — должно превращаться в материал для активной речи.

Цикл продукта:

**Consume → Capture → Understand → Remember → Speak → Get corrected → Reuse**

или:

**увидел → понял → сохранил → повторил → использовал в речи → получил feedback → начал использовать автоматически.**

---

# 2. Исходное состояние

Текущий English Cockpit уже реализует сильную часть conversational loop:

- ежедневные профессиональные roleplay-сценарии;
- голосовую практику через ChatGPT;
- учёт speaking time;
- разбор транскрипта;
- выделение ошибок, vocabulary gaps, connectors и idioms;
- превращение результатов разговора в карточки;
- собственный SRS;
- CEFR/SGR-оценку по шести критериям;
- writing coach;
- streak, XP и dashboard прогресса.

Текущая методика проекта уже делает правильный акцент: взрослому пользователю недостаточно знать правила и слова — необходимо процедурно автоматизировать речь через регулярное производство языка.

Главный текущий разрыв:

**Cockpit хорошо работает после разговора, но почти не управляет тем, какой язык пользователь приобретает до разговора.**

---

# 3. Product problem

Пользователь:

- понимает значительно больше английского, чем способен быстро произнести;
- знает слово при чтении, но не вспоминает его в разговоре;
- использует простые конструкции вместо известных более точных;
- долго формулирует предложения;
- избегает сложных времён и subordinate clauses;
- переводит мысль с русского вместо формирования её непосредственно на английском;
- повторяет один и тот же ограниченный vocabulary;
- после изучения новых слов редко использует их в реальной речи.

Таким образом bottleneck находится не только в knowledge, а в:

**retrieval speed + automaticity + active vocabulary + discourse fluency.**

---

# 4. Product objective

За 8 недель создать ежедневный learning loop, который максимально быстро переводит пассивный английский в активный.

## Primary target

К окончанию программы пользователь должен:

- стабильно вести разговор 15–20 минут без перехода на русский;
- объяснять позицию, аргументировать и отвечать на уточняющие вопросы;
- поддерживать профессиональный разговор без постоянного поиска базовых слов;
- связывать предложения в связный discourse;
- активно пользоваться устойчивыми chunks и collocations;
- уверенно использовать vocabulary уровня B1 и часть B2 vocabulary;
- значительно уменьшить количество длинных пауз;
- перестать регулярно повторять основные грамматические ошибки.

**Реалистичная целевая траектория за 8 недель:**

`A2/B1 unstable → solid B1 → B1+ / approaching B2`

Для знакомых рабочих тем пользователь может демонстрировать B2 раньше, чем в general English.

---

# 5. North Star Metric

Главная метрика продукта:

## Active Speaking Minutes

Количество минут, в течение которых пользователь **сам производит английскую речь**.

Цель программы:

**300–360 минут активной речи в неделю.**

Не время разговора с AI, а приблизительное время речи пользователя.

Дополнительная North Star:

## Activated Vocabulary

Количество новых words/chunks, которые пользователь:

1. встретил;
2. сохранил;
3. повторил;
4. успешно использовал минимум в 3 разных разговорных контекстах.

Именно это считается **активированным vocabulary**.

---

# 6. Core Learning Loop

Каждый день Cockpit формирует пользователю Daily Mission.

### 1. REVIEW — 10 минут

Повторить due cards в Anki.

Основные типы:

- vocabulary;
- collocations;
- sentence patterns;
- собственные ошибки;
- connectors.

---

### 2. INPUT — 10–15 минут

Пользователь читает статью / документ / transcript либо смотрит видео.

Browser Extension позволяет:

`Option + hover`

показать:

**leverage**  
использовать / задействовать с выгодой

Контекст:

> We can leverage our existing customer data.

Hotkeys:

`A` — Add to Anki  
`E` — Explain in context  
`P` — Pronounce

---

### 3. ACTIVATE — 5 минут

Cockpit выбирает:

- 3 новых vocabulary items;
- 1 connector;
- 1 grammar/sentence pattern.

Например:

**Today's targets**

- trade-off
- roll out
- mitigate
- That said, ...
- If we were to ..., we would ...

Перед разговором пользователь должен несколько раз произнести их вслух.

---

### 4. SPEAK — 20–30 минут

AI roleplay строится таким образом, чтобы пользователь **был вынужден использовать target language**.

Например:

> Today's mission:
>
> Convince the CFO not to reduce your AI budget.
>
> Try naturally to use:
> - mitigate
> - trade-off
> - roll out
> - That said...

AI не должен сразу исправлять каждую мелкую ошибку и разрушать flow.

Два режима:

### Fluency mode

AI почти не перебивает.

Ошибки анализируются после разговора.

### Accuracy mode

AI останавливает пользователя на критичных ошибках и просит повторить исправленную конструкцию.

По умолчанию:

**80% Fluency / 20% Accuracy.**

---

### 5. DEBRIEF — 5–10 минут

После разговора Cockpit автоматически выделяет:

- recurring errors;
- missing vocabulary;
- unnatural phrases;
- слишком простые формулировки;
- удачные конструкции;
- target vocabulary, который удалось использовать.

Главный вопрос:

**Какие 1–3 вещи дадут максимальное улучшение следующей сессии?**

Не перегружать пользователя 20 ошибками.

---

# 7. Epic 1 — Vocabulary Capture Extension

Создать Chrome/Chromium Extension.

## User story

Как пользователь, читающий английскую статью, я хочу мгновенно понять незнакомое слово и сохранить его, не прерывая чтение.

## Interaction

`Option + Hover`

→ popup.

Popup содержит:

**word / lemma**

**короткий перевод**

**simple English definition**

**meaning in this context**

**IPA + pronunciation**

**1 useful collocation**

Кнопки:

`A Add`  
`E Explain`  
`P Audio`

---

## Context capture

Extension автоматически сохраняет:

- selected word;
- lemma;
- предложение;
- предыдущую/следующую фразу при необходимости;
- URL;
- title;
- дата;
- source type.

Пример:

```json
{
  "word": "mitigating",
  "lemma": "mitigate",
  "translation": "снижать / смягчать",
  "definition": "to make something harmful less severe",
  "sentence": "This approach helps mitigate operational risks.",
  "collocations": [
    "mitigate risk",
    "mitigate impact"
  ],
  "sourceTitle": "...",
  "sourceUrl": "..."
}
```

---

# 8. Epic 2 — Anki becomes canonical SRS

Собственный SRS Cockpit больше не должен конкурировать с Anki.

## Решение

**Anki = основной engine интервального повторения.**

Cockpit отвечает за:

- обнаружение материала;
- создание хороших карточек;
- conversational activation;
- аналитику использования.

## Integration

Через AnkiConnect.

Важно:

AnkiConnect обычно работает на:

`localhost:8765`

Поэтому локальный Cockpit больше не должен подниматься на 8765.

Рекомендуемый Cockpit port:

`8787`

---

# 9. Anki Note Types

## Cockpit Vocabulary

Поля:

```text
Word
Lemma
TranslationRU
DefinitionEN
Context
Collocations
IPA
Audio
Source
SourceURL
CreatedAt
ActivationCount
```

Front:

> mitigate
>
> We need to ___ the operational risk.

Back:

> **mitigate**
>
> снижать / смягчать
>
> to make something harmful less severe
>
> mitigate risk  
> mitigate impact
>
> 🔊 pronunciation

---

## Cockpit Error

Front:

> My team **have finished** the migration.

Question:

> Correct the sentence.

Back:

> My team **has finished** the migration.

+ короткое объяснение.

---

## Cockpit Chunk

Не отдельное слово:

> The way I see it, ...

> That said, ...

> What concerns me most is ...

> I'm not convinced that ...

Chunks должны быть приоритетнее редких отдельных слов.

---

# 10. Epic 3 — Active Vocabulary Engine

Это ключевая новая функция Cockpit.

Продукт должен различать:

```text
Seen
↓
Saved
↓
Learning
↓
Recalled
↓
Used
↓
Activated
```

## Activated

Word/chunk считается активированным, если пользователь:

- использовал его самостоятельно;
- минимум 3 раза;
- минимум в 2 разные даты;
- минимум в 2 разных контекстах.

LLM определяет semantic match, поэтому необязательно использовать точную форму.

Например:

`mitigate / mitigated / mitigating`

считаются одним lexical item.

---

# 11. Epic 4 — Personal Language Model

Cockpit постепенно строит модель английского пользователя.

Для каждого lexical item:

```text
unknown
recognized
learning
active
mastered
```

Для grammar:

```text
articles
prepositions
conditionals
past tenses
present perfect
word order
relative clauses
modals
```

Для discourse:

```text
opening an argument
disagreeing
clarifying
contrasting
giving examples
summarizing
buying thinking time
```

Cockpit должен понимать:

> Сергей хорошо умеет объяснять позицию, но почти не использует contrast connectors и условные предложения.

И строить следующие задания исходя из этого.

---

# 12. Epic 5 — Adaptive Daily Mission

Вместо случайной roleplay дня появляется:

# Today's Flight Plan

Пример:

**Speaking goal**

20 min

**Vocabulary to activate**

- mitigate
- trade-off
- feasible

**Chunk**

> That said, ...

**Grammar focus**

Second Conditional

**Scenario**

> Convince your CEO to postpone a risky launch.

**Review**

12 Anki cards due

После выполнения:

> Mission complete — 24 min spoken / 3 of 3 vocabulary activated / conditional used 4 times.

---

# 13. Epic 6 — Conversation Coach 2.0

Нынешние professional scenarios сохранить.

Но сценарии должны генерироваться динамически на основе:

1. профессии пользователя;
2. последних ошибок;
3. изучаемого vocabulary;
4. предыдущих разговоров.

Типы conversations:

### Professional

- strategy;
- architecture;
- AI;
- budget;
- hiring;
- disagreement;
- board presentation;
- project delay;
- negotiation.

### General English

Чтобы не возникал перекос только в executive vocabulary:

- restaurant;
- travel;
- family;
- doctor;
- meeting new people;
- hobbies;
- describing experiences;
- explaining opinions;
- storytelling.

Рекомендуемая пропорция:

**60% professional / 40% general.**

---

# 14. Epic 7 — Pronunciation & Shadowing

В текущей версии практически отсутствует pronunciation feedback.

Для уровня B1–B2 это необходимо.

Добавить режим:

# Shadowing

Cockpit даёт короткий natural phrase.

Например:

> What concerns me most is the timeline.

Пользователь:

1. слушает;
2. повторяет;
3. записывает себя.

Система сравнивает:

- missing words;
- obvious pronunciation issues;
- rhythm;
- hesitation;
- stress approximation.

Не пытаться строить «идеальный accent score».

Главная задача:

**intelligibility + rhythm + automatic production.**

---

# 15. Epic 8 — Reading Mode

Browser Extension должен не только переводить слова.

После анализа страницы Cockpit показывает:

```text
Estimated comprehension: 91%

Known: 1,423 words
Learning: 31
Potentially useful: 8
Likely unknown: 17
```

Но автоматически сохранять все unknown words запрещено.

Пользователь сам выбирает материал.

## Daily acquisition limit

Максимум:

**5–8 новых lexical items в день.**

Дополнительно:

**2–3 chunks / collocations.**

Цель — не максимальный vocabulary acquisition, а максимальная вероятность его использования.

---

# 16. Vocabulary Prioritization

LLM присваивает каждому кандидату:

```text
frequency
usefulness
CEFR
professional relevance
personal relevance
```

И может показать:

> B2 · High value · Recommended

или:

> C2 · Rare · Skip

Приоритет:

1. high-frequency spoken vocabulary;
2. chunks;
3. collocations;
4. phrasal verbs;
5. discourse markers;
6. профессиональная лексика пользователя.

Редкие литературные слова автоматически получают низкий priority.

---

# 17. Epic 9 — Fluency telemetry

Текущий composite сохранить, но перестать делать CEFR единственной headline-метрикой.

LLM CEFR остаётся **оценочным индикатором, а не сертификацией**.

Добавить измеримые metrics.

## Weekly metrics

### Speaking

- active speaking minutes;
- average session duration;
- longest uninterrupted answer;
- words/minute;
- pause rate.

### Language

- unique active vocabulary;
- target vocabulary activation rate;
- repeated grammar errors;
- connector diversity;
- lexical diversity.

### Learning

- new Anki items;
- retention;
- mature cards;
- leeches.

---

# 18. Weekly Benchmark

Каждые 7 дней Cockpit запускает одинаковые типы benchmark tasks.

Например:

### Task A

> Describe a difficult decision you made recently.

### Task B

> Disagree with a colleague and defend your position.

### Task C

> Explain a technical concept to a non-technical person.

По 3–5 минут каждый.

Измеряем:

```text
fluency
grammar
lexis
complexity
discourse
task completion
pause rate
speaking speed
```

Так можно видеть тренд без сильного влияния сложности случайного сценария.

---

# 19. Eight-week program

## Week 1 — Baseline & Survival Fluency

Цель:

**говорить, не замолкая.**

Фокус:

- simple sentences;
- present/past/future;
- базовые connectors;
- hesitation strategies.

Target:

150–200 speaking minutes.

---

## Week 2 — Sentence Expansion

Цель:

перейти от:

> We need this. It is important.

к:

> We need this because it will reduce operational risk and give us more flexibility later.

Фокус:

- because;
- although;
- if;
- when;
- which;
- that.

---

## Week 3 — Active Vocabulary

Начинается aggressive activation loop:

**reading → Anki → conversation.**

Цель:

30–40 новых high-value items за неделю.

Но минимум 50% должны попасть в разговорную речь.

---

## Week 4 — Discourse

Фокус:

- argument structure;
- transitions;
- contrast;
- examples;
- summarizing.

Chunks:

> The way I see it...

> What matters here is...

> That said...

> There are two reasons for this...

> Let me put it another way...

---

## Week 5 — Retrieval Speed

Фокус:

снижение thinking delay.

AI начинает задавать больше:

- follow-ups;
- objections;
- unexpected questions.

Ответ необходимо начинать быстро, даже если грамматика неидеальна.

---

## Week 6 — Complexity

Добавляем:

- conditionals;
- relative clauses;
- modal nuance;
- hedging;
- speculation.

Пример перехода:

> This is bad.

→

> This could become a serious issue if we don't address it early.

---

## Week 7 — Real-life Simulation

Сценарии 20–30 минут.

AI не обучает пользователя во время разговора.

Он ведёт себя как реальный:

- colleague;
- CEO;
- customer;
- stranger;
- interviewer.

Feedback только после завершения.

---

## Week 8 — Consolidation

Минимум нового материала.

Фокус:

**master what you already know.**

Повторяются:

- recurring errors;
- high-value vocabulary;
- weak scenarios;
- weak discourse patterns.

В конце — полный benchmark Week 1 vs Week 8.

---

# 20. Recommended daily load

Оптимальный serious mode:

## 50–60 минут / день

**10 min — Anki**

**10 min — reading/listening**

**5 min — target activation**

**20–25 min — speaking**

**5–10 min — feedback/shadowing**

6 дней в неделю.

Один день — только лёгкое review / media consumption.

---

# 21. Product guardrails

Cockpit должен защищать пользователя от типичных ошибок language-learning apps.

## Не делать

### Vocabulary hoarding

1000 сохранённых слов без использования.

### Correction overload

20 ошибок после каждого разговора.

### Grammar course

Последовательное прохождение всей грамматики.

### Gamification over learning

XP не должен становиться целью.

### Translation dependency

Постепенно уменьшать русский язык в интерфейсе обучения.

---

# 22. Progressive English Mode

Week 1–2:

объяснения могут быть на русском.

Week 3–4:

интерфейс RU, teaching content преимущественно EN.

Week 5+:

conversation, explanations и definitions — преимущественно English.

Русский используется только:

- для сложного объяснения;
- перевода;
- критичной grammar clarification.

---

# 23. Proposed architecture

Текущий single-file Cockpit можно оставить рабочей legacy-версией, но 2.0 стоит постепенно разнести.

```text
english-cockpit/

apps/
  cockpit/
  browser-extension/

packages/
  core/
  prompts/
  vocabulary/
  anki/
  evaluation/

data/
  state.json
  backups/

docs/
```

## Components

### Cockpit Web

Dashboard + Daily Mission + conversations + analytics.

### Browser Extension

Vocabulary capture.

### Anki Adapter

AnkiConnect integration.

### LLM Adapter

OpenRouter / OpenAI-compatible.

### Shared Core

Common schemas и learning state.

Backend/server database на первом этапе не нужен.

Принцип:

**local-first.**

---

# 24. Data model

Главная новая сущность:

```text
LexicalItem

id
lemma
surfaceForms[]
translation
definition
ipa
audio
collocations[]
examples[]
sources[]
cefr
priority

status:
  seen
  saved
  learning
  active
  mastered

seenCount
ankiNoteId
reviewState
spokenUsageCount
spokenUsageDates[]
lastUsedAt
createdAt
```

---

# 25. MVP / Release sequence

## Release 2.1 — Vocabulary Pipeline

Сделать первым.

- Chrome Extension;
- Option + hover;
- context-aware translation;
- lemma;
- sentence capture;
- Add to Anki;
- duplicate detection;
- Cockpit Vocabulary note type.

Это создаёт:

**Article → Anki**

---

## Release 2.2 — Activation

Добавить:

- vocabulary state;
- Today's 3 words;
- injection into roleplay prompt;
- detection of spoken usage;
- ActivationCount.

Получаем:

**Article → Anki → Speech**

Это первая версия полноценного нового продукта.

---

## Release 2.3 — Daily Flight Plan

Добавить:

- adaptive daily mission;
- grammar focus;
- vocabulary focus;
- speaking goal;
- Anki due count;
- completion screen.

---

## Release 2.4 — Benchmark & Analytics

- weekly benchmark;
- speaking speed;
- pause rate;
- lexical diversity;
- activated vocabulary;
- recurring errors.

---

## Release 2.5 — Pronunciation

- recording;
- transcription;
- shadowing;
- phrase comparison;
- pronunciation feedback.

---

# 26. Success criteria after 8 weeks

Программа считается успешной, если одновременно выполняются:

### Behaviour

- ≥ 6 недель с минимум 5 speaking days;
- ≥ 2,000 минут accumulated speaking;
- ≥ 40 полноценных conversation sessions.

### Vocabulary

- 200–300 полезных lexical items/chunks пройдено;
- ≥ 100 действительно activated;
- ≥ 70% weekly target vocabulary использовано в речи.

### Fluency

- уменьшение длинных пауз;
- увеличение средней длины ответа;
- способность говорить 3–5 минут по знакомой теме без перехода на русский.

### Accuracy

- снижение recurring mistakes;
- улучшение grammar score относительно baseline.

### CEFR proxy

- стабильные benchmark-сессии уровня B1;
- отдельные профессиональные сессии соответствуют B2 anchors.

---

# 27. Product thesis

Главное отличие English Cockpit от Anki, Migaku, Duolingo и обычного AI tutor:

**Cockpit знает не только то, что пользователь учит, но и то, способен ли он использовать это в речи.**

Система должна оптимизировать не:

> сколько слов ты сохранил

и не:

> сколько карточек повторил,

а:

> **сколько полезного языка стало частью твоей реальной речи.**

Финальный loop:

```text
REAL WORLD INPUT
       ↓
Browser Extension
       ↓
Contextual Vocabulary
       ↓
      Anki
       ↓
Daily Activation Targets
       ↓
AI Conversation
       ↓
Transcript Analysis
       ↓
Usage / Errors / Missing Language
       ↓
Personal Language Model
       ↓
Tomorrow's Mission
       ↺
```

Это и должно стать центральной архитектурой English Cockpit 2.0.