🇬🇧 English · [🇷🇺 Русский](README.md)

# 🎧 English Cockpit

**A personal spoken-English trainer for adults — one HTML file, your own API key, your data stays local.**

> For people who already studied the language (school/university/work) but "understand it, yet can't speak with flow." The tool doesn't build knowledge — it builds automaticity of speech: you talk → your errors get analyzed → flashcards with spaced repetition → say the fixes out loud.

The whole app is a single self-contained `cockpit.html` (all CSS/JS inlined, no external dependencies). The LLM connects via your own API key (OpenRouter or any OpenAI-compatible endpoint). Data is stored only in your browser — nothing goes to third-party servers except the requests to the model you choose. The interface is in Russian.

---

## 📸 Screenshots

Home screen — daily roleplay, voice-chat prompt, streak, rank and XP:

![English Cockpit — home screen](assets/hero.png)

Spaced-repetition review of your cards (errors, idioms, connectors, gap-vocab):

![Card review](assets/review.png)

Dashboard: speaking time, activity, SGR score trend and 6-criteria breakdown:

![Progress dashboard](assets/dashboard.png)

Dark theme is available too:

![Dark theme](assets/hero-dark.png)

## Features

- **Daily roleplay** — 40 professional scenarios + a ready-made "strict interlocutor" prompt for voice chat (ChatGPT Advanced Voice).
- **Speech timer** — built into the button: one click opens the chat and starts timing your speaking.
- **Transcript debrief** — the LLM turns your dialogue into flashcards: errors, situation-appropriate idioms, connectors for smoother transitions, and missing vocabulary. Browsed as a card deck.
- **Spaced-repetition bank (SRS)** — SM-2-lite + automatic "leech" suspension of cards you keep failing.
- **SGR conversation scoring** — using Schema-Guided Reasoning, the model produces a composite 0–100 and a CEFR level across 6 criteria. Progress as a number, comparable over time.
- **Writing coach** — polishes your text to executive level and explains why.
- **Gamification** — XP for real effort (not for gaming the system), levels, ranks, badges.
- **Dashboard** — streak, speaking time, score trend.
- **Warm theme** with a dark-mode toggle.
- **Auto-save and backups** to a folder you pick (File System Access API), with rotating snapshots.

## Quick start

1. Download `cockpit.html`.
2. Open it by double-clicking **or** (recommended, for folder auto-save) run a local server:
   ```bash
   python3 -m http.server 8787
   # then open http://localhost:8787/cockpit.html
   ```
   > The File System Access API (folder auto-save) works only over `http(s)`/`localhost`, not `file://`. When opened as a file, data lives in localStorage + manual JSON export/import.
   > Port **8787** (not 8765): 8765 is reserved for AnkiConnect in Cockpit 2.0.
3. Open **Settings** → paste your **API key** (e.g. [OpenRouter](https://openrouter.ai)) and pick a model.
4. Train: roleplay → speak out loud → paste the transcript → debrief → review cards.

A Chromium-based browser (Chrome, Edge, Yandex) is recommended — that's where the File System Access API works.

## Privacy & security

- **The key is stored only in your browser's localStorage** and is never written to any saved/exported file.
- Practice data is stored locally (localStorage + an optional `data/state.json` in your chosen folder).
- The only outbound requests go to the LLM endpoint you choose. No analytics, trackers, or telemetry.
- Only ever paste your own key. Keep data files (`data/`, backups) out of public repositories.

## Cockpit 2.0 (in development)

- `extension/` — Chrome extension: `Option + hover` over a word → translation/context, press `A` → card into Anki via AnkiConnect (`localhost:8765`). Install: `chrome://extensions` → Developer mode → Load unpacked → the `extension/` folder.
- `docs/` — the 2.0 PRD and implementation plan.
- Cockpit Settings has a "Check AnkiConnect" button.

## Models

Default is `google/gemini-2.5-flash` via OpenRouter (cheap: a fraction of a cent per session). In Settings you can pick another model or set a custom **Base URL** for any OpenAI-compatible provider.

## Methodology (in brief)

An adult brain is strong in declarative memory (rules, words) but weak in procedural memory (automatic speech). Fluency is built by **producing speech** under light pressure, not by consuming it. The core loop: you speak → we catch errors and useful chunks (idioms, connectors) → spaced repetition → say the fixes out loud. Principles: consistency beats intensity; output beats input; reward effort, not gaming.

## Limitations

- The voice conversation happens in an external service (ChatGPT); the app works with the text transcript.
- Speaking minutes and monthly metrics are entered manually (timer + fields); there's no automatic pronunciation scoring.
- You need your own API key and a small amount of model spend.

## License

MIT — see [LICENSE](LICENSE).
