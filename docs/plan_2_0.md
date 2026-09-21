# English Cockpit 2.0 — план доработок

Статус: согласовано ✅ (решения: Anki = единый стор; постепенный рефактор без бандлера; Whisper API для shadowing)
Источник: prd_anki.md + текущий код (`cockpit.html`, ~2500 строк, single-file, localStorage + File System Access backup)

---

## 1. Гэп-анализ: что есть vs что требует PRD

| Зона | Есть в v1 | Требует PRD 2.0 | Гэп |
|---|---|---|---|
| Roleplay | 40 хардкод-сценариев, ротация по дню, статичный промпт «строгого собеседника» | Динамическая генерация от профиля/ошибок/лексики; режимы Fluency/Accuracy; 60/40 professional/general | Средний — генерация и режимы новые |
| Разбор транскрипта | LLM-аудит → карточки (errors, vocab, idioms, connectors, say_aloud, pattern_focus) | То же + фокус на 1–3 вещи, детекция использованных target words | Малый — доработка промпта |
| SRS | Свой SM-2-lite в localStorage | Anki = канонический SRS через AnkiConnect | **Большой** — замена движка + миграция |
| Vocabulary capture | Нет | Chrome Extension, Option+hover, Add to Anki, контекст | **Новый продукт** |
| Active Vocabulary Engine | Нет | Пайплайн Seen→Saved→Learning→Recalled→Used→Activated | **Новое ядро** |
| Personal Language Model | Частично (pattern_focus — одна строка) | Профиль по lexis/grammar/discourse, влияет на задания | Средний |
| Daily Mission | «Ролёвка дня» только | Today's Flight Plan: speaking goal, vocab targets, chunk, grammar focus, Anki due | Средний — расширение экрана |
| Pronunciation/Shadowing | Нет (минуты вручную по таймеру) | Запись, транскрипция, сравнение фразы | **Новый блок** |
| Reading Mode | Нет | Comprehension estimate страницы, лимит 5–8 items/день | Новый, внутри extension |
| Telemetry | Heatmap, speaking minutes, manual artic/MLT, composite | Weekly metrics: pause rate, WPM, connector diversity, activation rate, Anki retention/leeches | Средний |
| Weekly Benchmark | Нет | 3 фиксированные задачи × раз в неделю, тренд | Новый |
| 8-недельная программа | Нет | Week 1–8 структура с фокусами и целями | Конфиг + логика |
| Порт | README: `http.server 8765` | Конфликт с AnkiConnect → перейти на 8787 | Тривиально |

---

## 2. Архитектурные решения (согласованы)

### 2.1 Anki как единое хранилище lexical items — ✅ принято
PRD предлагает сущность `LexicalItem` + Anki через AnkiConnect. Предлагаю **не дублировать стор**:
- `LexicalItem` живёт **в полях Anki-ноты** (note type `Cockpit Vocabulary` уже содержит `ActivationCount`, `Source`, `SourceURL`; добавим `Status`, `UsageDates`).
- И extension, и cockpit читают/пишут в AnkiConnect (`localhost:8765`) напрямую из браузера.
- Тогда Anki — single source of truth: карточки, SRS, и vocabulary pipeline в одном месте. Cockpit state.json хранит только сессии, метрики, профиль, геймификацию.
- Требование: у пользователя установлены Anki + AnkiConnect; в конфиге AnkiConnect `webCorsOriginList` включает `http://localhost:8787` (инструкция в онбординге).

Альтернатива (отклонена): свой стор в state.json + синк в Anki.

### 2.2 Порт и режим запуска
- Локальный сервер cockpit переезжает на `8787` (README, подсказки, онбординг).
- CORS-настройка AnkiConnect — шаг онбординга с кнопкой «Проверить соединение».

### 2.3 Структура репозитория — постепенно, без бандлера — ✅ принято
PRD предлагает monorepo `apps/ + packages/`. Полный переезд с бандлером — большой рискованный рефактор 2500-строчного файла без немедленной пользы. Предлагаю:

```
english-cockpit/
  cockpit.html          # работающий legacy v1 — не трогаем первые релизы
  app/                  # новый cockpit 2.0 — ES-модули без сборки
    index.html
    js/ (llm.js, anki.js, lexicon.js, mission.js, ...)
    css/
  extension/            # Chrome MV3, plain JS (content script, background, options)
    lib/                # общие ES-модули (model.js, anki.js, llm.js) — MV3 видит только файлы
                        # внутри каталога расширения; app/ импортирует их по HTTP из того же пути
  docs/
    prd_anki.md, план, решения
```

- Без webpack/vite: нативные ES-модули работают и на `localhost:8787`, и в extension. Ноль билд-инфраструктуры. Нюанс MV3: сервис-воркер импортирует модули только внутри каталога расширения → общий код лежит в `extension/lib/`, app/ подтягивает его по HTTP (`../extension/lib/…`).
- v1 (`cockpit.html`) остаётся рабочим параллельно; миграция состояния v1 → v2 через экспорт JSON + импорт в Anki.

Альтернатива (отклонена): сразу monorepo `apps/ + packages/` + бандлер — замедлит 2.1 без выигрыша для solo local-first продукта. К финальной структуре можно вернуться позже.

### 2.4 Речь: разговор и shadowing — ✅ принято Whisper
- Разговор остаётся во внешнем ChatGPT Voice (как сейчас) — транскрипт вставляется вручную.
- Shadowing/запись: `MediaRecorder` для записи + **Whisper API** для транскрипции (точнее на акценте). Аудио уходит в выбранный пользователем API — явное предупреждение в настройках/онбординге.
- Whisper-эндпоинт делаем конфигурируемым (OpenAI `audio/transcriptions` или совместимый через тот же провайдер-ключ); Web Speech API остаётся запасным бесплатным фоллбэком в настройках.

### 2.5 Детекция активации слов
Гибрид вместо «всё через LLM»:
1. Быстрый локальный матчинг: lemma + surfaceForms из Anki-полей против транскрипта (стемминг/простая лемматизация en).
2. LLM-валидация только для найденных/сомнительных совпадений и semantic match («mitigate» засчитан по смыслу).
Это быстрее, дешевле и воспроизводимее; LLM не теряется — она судит спорные случаи.

### 2.6 Миграция v1
- Существующие карточки v1 (error/vocab/idiom/connector) → экспорт в Anki: `vocab`/часть `idiom`/`connector` → note type `Cockpit Vocabulary`/`Cockpit Chunk`, `error` → `Cockpit Error`.
- Одноразовый мастер миграции с дедупликацией по lemma+cloze.
- Старый SRS-стейт (ease/interval/due) **не переносим** — Anki ведёт свою очередь; факт «карточка существовала» сохраняем через `Status=learning`.

---

## 3. План по релизам

### Release 2.1 — Vocabulary Pipeline (Extension → Anki)
Цель: `Article → Anki`.

1. `extension/` — Chrome MV3: manifest, content script (Option+hover → popup слова), background service worker.
2. Popup: lemma, краткий перевод RU, EN-определение, meaning-in-context, IPA, 1–2 collocations (LLM через тот же ключ — хранить в `chrome.storage`, синк с настройками cockpit вручную/экспортом).
3. Hotkeys `A`/`E`/`P` (Add / Explain / Pronounce — `speechSynthesis`).
4. Context capture: word, lemma, предложение ± сосед, URL, title, дата → `addNote` в AnkiConnect с note type `Cockpit Vocabulary`, deck `Cockpit`, тег `cockpit`.
5. Дедупликация: поиск по `note:` в Anki перед добавлением (`findNotes` по lemma).
6. Создание/проверка note type + deck при первом запуске (`createModel`/`createDeck` если отсутствуют).
7. Онбординг-страница расширения: API-ключ, URL AnkiConnect, проверка соединения.
8. В cockpit: замена порта в README на 8787 + блок «Anki status» в настройках (ping AnkiConnect, due count).

Приёмка: читаю статью → hover на незнакомое слово → вижу перевод и контекст → `A` → карточка в Anki с предложением и источником; повторное добавление не создаёт дубль.

### Release 2.2 — Activation (Article → Anki → Speech)
1. `app/` v2-каркас: новый index.html + модули (llm.js, anki.js, state.js, lexicon.js), перенос ролёвки/аудита/таймера/настроек из v1.
2. Vocabulary state-машина из Anki-полей: `seen → saved → learning → recalled → used → activated`.
3. «Today's 3 words + 1 connector + 1 pattern» — выбор из learning/recalled + high-priority saved.
4. Injection в промпт ролёвки: целевые слова + сценарий, генерируемый LLM под них.
5. Детекция использования в транскрипте (гибрид 2.5) → `spokenUsageCount`, `usageDates`, `lastUsedAt`, переход в `activated` по правилу 3× / 2 даты / 2 контекста.
6. UI: экран активации перед разговором (проговор целей вслух), бейдж «activated» после разбора.
7. Миграция v1 → Anki (мастер + дедуп).

Приёмка: сохранённые слова появляются в целях дня, использование в разговоре засчитывается, статус двигается, activated-слова перестают назойливо возвращаться.

### Release 2.3 — Daily Flight Plan + Coach 2.0
1. Экран «Today's Flight Plan»: speaking goal, vocabulary targets, chunk, grammar focus (из профиля), сценарий, Anki due count, экран «Mission complete».
2. Генерация сценариев: LLM от профиля (профессия, последние ошибки, learning-лексика, история) + пул general English; пропорция 60/40.
3. Режимы Fluency/Accuracy: два промпт-шаблона; дефолт 80/20 по неделе (логика выбора режима дня).
4. Personal Language Model v1: агрегаты по grammar-категориям ошибок, connector diversity, discourse moves → влияет на grammar focus и генерацию сценариев.
5. 8-недельная программа как конфиг: `week → focus/vocab quota/ожидания` → Flight Plan подстраивается под неделю.
6. Progressive English Mode: неделя 1–2 RU-объяснения, 3–4 смешанный, 5+ EN.

Приёмка: ежедневный экран собирает миссию из реального состояния; сценарий и фокус меняются от недели к неделе и от моих ошибок.

### Release 2.4 — Benchmark & Analytics
1. Weekly benchmark: 3 фиксированные задачи A/B/C, 3–5 мин, та же SGR-схема + метрики (pause rate, WPM из длительности и слов, connector diversity, lexical diversity).
2. Weekly metrics dashboard: speaking minutes, activation rate, repeated errors, Anki retention/mature/leeches (через AnkiConnect `getCardStats`/`cardsInfo`).
3. Тренды: benchmark-история Week 1 → Week 8, графики по критериям.
4. CEFR — второстепенный индикатор, headline = speaking minutes + activated vocabulary.

Приёмка: раз в 7 дней предлагается benchmark; по неделям виден тренд; дашборд отвечает «что улучшилось».

### Release 2.5 — Pronunciation & Shadowing
1. Режим Shadowing: фраза → послушать (TTS) → записать себя (MediaRecorder) → транскрипция (Whisper API, фоллбэк Web Speech API) → сравнение (missing words, hesitation, rhythm approximation).
2. Отчёт: intelligibility-фокус, без accent-score.
3. Интеграция: фразы берутся из chunks/say_aloud дня.

Приёмка: вечерний блок 5–10 мин — проговор целевых фраз с автопроверкой узнавания.

### Сквозные задачи
- Перевод внутреннего SRS UI на «Anki status»: due count, retention — читаем из Anki, свой SM-2 выключаем после миграции.
- Онбординг 2.0: проверка AnkiConnect, мастер миграции, лимиты дня (5–8 items).
- Документация: обновить README (порт, Anki, extension), `docs/` с PRD и решениями.

---

## 4. Риски и открытые вопросы

- **AnkiConnect обязателен.** Если у пользователя нет Anki — весь vocabulary pipeline не работает. Нужен graceful fallback: cockpit работает в «режиме без Anki» (capture копит в extension, показывает предупреждение).
- **Лемматизация в JS** — без библиотек качество ограничено; для en хватит простого набора правил + LLM-фоллбэк.
- **LLM в extension** — тот же API-ключ, что и в cockpit. Два места хранения ключа (chrome.storage + localStorage) — приемлемо, но отметить в онбординге.
- **Приватность аудио**: записи хранятся локально; при Whisper — предупреждение, что аудио уходит в API провайдера. Фоллбэк на Web Speech API в настройках.
- **Совместимость v1**: state.json v1 читается новым app, миграция карт необратима — делать копию бэкапа перед миграцией.

## 5. Предлагаемый порядок и оценка

Порядок как в PRD (2.1 → 2.5) — он правильный: каждый релиз даёт самостоятельную ценность и 2.2 — первая версия «полноценного нового продукта».

Оценка в моих сессиях (ориентир, при последовательной работе):
- 2.1 Extension — ~1 сессия
- 2.2 Activation + каркас app/ — ~1–1.5 сессии
- 2.3 Flight Plan + Coach 2.0 — ~1 сессия
- 2.4 Benchmark & Analytics — ~0.5–1 сессия
- 2.5 Shadowing — ~0.5 сессия

Итого: ~4–5 сессий последовательной работы. Можно параллелить (extension и app-каркас независимы) через child-сессии, если нужно быстрее.
