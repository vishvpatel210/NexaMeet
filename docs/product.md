# Product Specification: NexaMeet AI Desktop Notepad

## 1. Executive Summary & Vision
NexaMeet is an enterprise-grade AI-powered desktop meeting notepad inspired by Granola. Built on a local-first Electron desktop application architecture, NexaMeet communicates with a modular Express backend API connected to MongoDB, Whisper Speech-to-Text, Gemini / OpenAI models, and Vector DB retrieval.

NexaMeet captures microphone and system audio without requiring visible video call bots, converting discussions into structured executive summaries, action items, and searchable semantic knowledge.

---

## 2. Architecture & Tech Stack Target

```
[ Electron Desktop App ]  -->  [ React UI ]  -->  [ Express REST API ]
                                                          │
                                         ┌────────────────┴────────────────┐
                                         ▼                                 ▼
                                 [ MongoDB Database ]             [ AI Services ]
                                                                           │
                                                  ┌────────────────────────┼────────────────────────┐
                                                  ▼                        ▼                        ▼
                                           [ Whisper STT ]         [ Gemini / OpenAI ]        [ Vector DB ]
```

---

## 3. Directory Layout Standard

- `desktop/`: Electron main process, window management, audio loopback capture modules, IPC bridge.
- `server/`: Express REST API server, controllers, AI pipelines, database connections, and services.
- `shared/`: Shared TypeScript data transfer objects (DTOs), API contracts, and schema definitions.
- `docs/`: Comprehensive architecture specifications, design systems, database schemas, roadmaps, and milestones.
- `scripts/`: Dev environment tooling, database seeders, build scripts, and test runners.
- `assets/`: App icons, graphical branding, visual templates, and assets.

---

## 4. Key Functional Modules
- **Dual-Channel Audio Capture**: Microphone + System Audio output recording via native Node.js / C++ loopback hooks.
- **Audio Processing & Whisper STT**: Automated audio chunking, noise reduction, and Whisper transcription engine.
- **Gemini / OpenAI Summarization**: Dynamic template hydration (`Executive Brief`, `1-on-1`, `Podcast Prep`, `Architecture Review`) generating structured summaries and action items.
- **Vector DB Semantic Search**: Embedding generation for transcript and summary chunks stored in Vector DB (ChromaDB / Qdrant) for instant semantic similarity search.
- **MongoDB Persistence**: Local/Cloud MongoDB database for robust document metadata storage.
