# Product & Engineering Roadmap: NexaMeet

## Timeline & Phases

- **Phase 1: Foundation & Monorepo Setup (v0.1 - v0.5)**:
  - 6-folder structure (`desktop/`, `server/`, `shared/`, `docs/`, `scripts/`, `assets/`).
  - Electron main process + Express REST API + MongoDB connection.
  - Native dual audio capture (microphone + system output loopback).

- **Phase 2: Core AI Services Integration (v1.0)**:
  - Whisper STT pipeline for audio-to-text transcription.
  - Gemini & OpenAI summarization engine with dynamic templates.
  - Vector DB (ChromaDB / Qdrant) semantic search integration.

- **Phase 3: Desktop UI & Productivity (v1.5)**:
  - React desktop client matching "Obsidian Glass & Kinetic Cyan" design system.
  - Split-view meeting detail screen & live recording modal.
  - Google Calendar & Outlook OAuth calendar sync.

- **Phase 4: Ecosystem & Enterprise Hardening (v2.0)**:
  - Notion, Slack & Jira auto-export.
  - End-to-end encrypted storage & OS key vault integration.
