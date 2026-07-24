# Project Milestones: NexaMeet (Electron + Express + MongoDB + AI)

Each milestone below is **independently buildable and testable**.

---

## Milestone 1: Monorepo Setup & Electron + Express Boilerplate
- **Goal**: Scaffold the 6-folder repository (`desktop/`, `server/`, `shared/`, `docs/`, `scripts/`, `assets/`) with basic Electron main process and Express API server health route.
- **Verification Plan**:
  - *Server Test*: `cd server && npm run dev` -> `GET http://localhost:5000/api/v1/health` returns `{ status: "ok" }`.
  - *Desktop Test*: `cd desktop && npm run dev` -> Electron window launches displaying backend health status.

---

## Milestone 2: MongoDB Mongoose Data Layer & Shared DTOs
- **Goal**: Implement MongoDB database connection, Mongoose models (`Meeting`, `Recording`, `Transcript`, `Summary`, `ActionItem`), and shared TypeScript DTO interfaces in `shared/types`.
- **Verification Plan**:
  - *Automated Test*: `cd server && npm run test:db` -> Connects to local MongoDB, runs CRUD tests against Mongoose models.

---

## Milestone 3: Audio Upload & System Recording Pipeline
- **Goal**: Build native audio capture interface in `desktop/` and `/api/v1/recordings/upload` multipart stream handler in `server/`.
- **Verification Plan**:
  - *Manual Test*: Record audio in desktop client, trigger upload IPC, verify audio `.wav` file saved in server storage and registered in MongoDB `recordings`.

---

## Milestone 4: Whisper Speech-to-Text (STT) Integration
- **Goal**: Integrate Whisper STT service in `server/services/WhisperService.ts` to parse audio files into timestamped transcript segments.
- **Verification Plan**:
  - *Automated Test*: Feed benchmark 15-second `.wav` into `WhisperService`, assert returned transcript array contains non-empty text segments.

---

## Milestone 5: Gemini / OpenAI LLM Summarization Service
- **Goal**: Implement `SummaryService.ts` utilizing Gemini 1.5 / OpenAI APIs to generate structured summaries and action items from transcripts.
- **Verification Plan**:
  - *Automated Test*: `npm run test:summary` -> Passes transcript fixture to `SummaryService`, validates returned JSON contains executive summary and action items array.

---

## Milestone 6: Vector DB Semantic Search Engine
- **Goal**: Set up Vector DB (ChromaDB / Qdrant) collection index and `/api/v1/search` endpoint for semantic vector search queries.
- **Verification Plan**:
  - *Automated Test*: Index sample meeting summaries, run semantic query *"database architecture"*, verify relevant meeting ID returned with high similarity score (>0.80).

---

## Milestone 7: Express REST API Controllers & Endpoints
- **Goal**: Complete full RESTful API route coverage: `/api/v1/meetings`, `/api/v1/recordings`, `/api/v1/summaries`, `/api/v1/search`.
- **Verification Plan**:
  - *Automated Test*: Run API integration tests (`supertest`) testing all CRUD endpoints and error responses.

---

## Milestone 8: Desktop UI Component System & Dashboard View
- **Goal**: Build React component layout matching design system (`Obsidian Glass & Kinetic Cyan`) with sidebar, category filters, meeting cards, and search bar.
- **Verification Plan**:
  - *Manual Test*: Verify dashboard filtering (`Work`, `Personal`, `★ Important`) and visual theme rendering in Electron renderer.

---

## Milestone 9: Live Recording Modal & Equalizer Spectrum
- **Goal**: Implement live recording modal with animated audio visualizer spectrum and real-time timer in React UI.
- **Verification Plan**:
  - *Manual Test*: Open recording modal, speak into microphone, verify spectrum bars react to voice audio levels in real time.

---

## Milestone 10: Desktop Packaging & Security Keyring Integration
- **Goal**: Package Electron desktop app using Electron Builder, secure API keys with system Credential Vault, and verify production build.
- **Verification Plan**:
  - *Build Command*: `cd desktop && npm run build` -> Generates installer package (NSIS `.exe` or DMG `.dmg`).
