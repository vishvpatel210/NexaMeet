# Product & Engineering Roadmap: NexaMeet

## 1. High-Level Release Timeline

```
+-----------------------------------------------------------------------------------+
| PHASE 1: MVP Foundation & Audio Engine (v0.1 - v0.5)                               |
| Focus: Desktop Shell, Native Dual-Channel Audio Capture, SQLite Schema, UI Deck   |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| PHASE 2: Core STT & AI Summarization Engine (v1.0 Launch)                        |
| Focus: Whisper Integration, Prompt Templates, Live Note-taking, Export Engine     |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| PHASE 3: Knowledge Base, Hybrid Search & Calendar Sync (v1.5)                      |
| Focus: FTS5 + sqlite-vec RAG, Google/Outlook Calendar, Global Shortcuts           |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| PHASE 4: Enterprise Sync & Team Ecosystem (v2.0)                                  |
| Focus: Cloud E2EE Sync, Notion/Jira Integrations, Offline Security Hardening       |
+-----------------------------------------------------------------------------------+
```

---

## 2. Detailed Phase Breakdown

### 2.1 Phase 1: MVP Desktop Foundation & Audio Engine (v0.1 - v0.5)
**Goal**: Build a rock-solid desktop application frame capable of recording system audio and microphone inputs with zero audio drift or distortion.

- **Key Capabilities**:
  - Tauri 2.0 Rust desktop shell setup with React 18 frontend framework.
  - Native dual-channel audio capture (Microphone + System Audio loopback via `cpal` / `wasapi` / `coreaudio`).
  - Real-time audio signal energy computation & Tauri IPC telemetry for UI equalizer display.
  - Local SQLite storage initialization with automatic schema migrations.
  - Basic Meetings Dashboard UI (List, Date Filters, Categories).

---

### 2.2 Phase 2: Core STT & AI Summarization (v1.0 Public Launch)
**Goal**: Complete end-to-end flow from audio recording to transcription, note-taking, and AI structured summary generation.

- **Key Capabilities**:
  - Embedded local STT (`whisper-rs` with Whisper.cpp execution engine).
  - Cloud STT fallback (Deepgram Nova-2 / OpenAI Whisper API).
  - Split-view meeting detail screen with live note-taking and structured summary views.
  - Dynamic AI Template engine (Executive Brief, 1-on-1, Podcast Prep, Standup).
  - One-click export to Markdown, Clipboard, and JSON.

---

### 2.3 Phase 3: Hybrid Search, RAG & Calendar Sync (v1.5)
**Goal**: Transform recorded meetings into a searchable personal knowledge base with automated calendar context.

- **Key Capabilities**:
  - SQLite FTS5 full-text search across transcripts, titles, and summaries.
  - `sqlite-vec` vector embeddings generator for semantic RAG search (*"Find all discussions about API design"*).
  - Google Calendar & Outlook OAuth2 integration for automatic meeting metadata matching.
  - Global desktop floating widget tray for instant 1-click quick capture (`Cmd/Ctrl + Shift + R`).

---

### 2.4 Phase 4: Enterprise Sync & Team Ecosystem (v2.0)
**Goal**: Enable secure cross-device sync and direct workflow integrations for team productivity.

- **Key Capabilities**:
  - Optional End-to-End Encrypted (E2EE) cloud database sync.
  - Direct 2-way sync with Notion databases, Jira issue creation from Action Items, and Slack bot shares.
  - SQLCipher database encryption at rest using OS Keyring keys.
  - Multi-speaker speaker diarization and voice profile registration.

---

## 3. Technical & Execution Risk Matrix

| Risk Factor | Severity | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **System Audio Capture Permissions** | High | macOS/Windows permissions block loopback audio capture. | Implement clear onboarding permission wizard with direct deep-links to OS Privacy settings. |
| **High CPU/RAM during Local STT** | Medium | Local Whisper execution causes fan noise or battery drain on laptops. | Default to Quantized models (`q5_0` or `q8_0`) and offer immediate Cloud STT API toggle. |
| **Audio Drift / Desync** | High | Mic and System loopback audio desync over long (>1 hr) meetings. | Resample both audio streams to standard 16kHz mono clock using `rubato` buffer sync. |
| **LLM Output Hallucination** | Medium | AI invents non-existent meeting decisions. | Ground prompts strictly with verbatim transcripts & apply strict JSON schema validation. |
