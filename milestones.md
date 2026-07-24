# Project Milestones: NexaMeet

Every milestone below is designed to be **independently buildable and testable**. Completion of a milestone requires passing all specified automated tests and verification criteria.

---

## Milestone 1: Project Scaffolding & Tauri Desktop Shell
- **Goal**: Establish the core Tauri 2.0 + React + TypeScript + Tailwind CSS project scaffolding with window management and IPC communication framework.
- **Tasks**:
  1. Initialize Tauri 2.0 Rust project with React Vite TypeScript template.
  2. Configure Tailwind CSS, Lucide icons, and base color tokens matching `ui.md`.
  3. Implement basic window chrome, frameless header, and IPC ping/pong test route.
- **Verification Plan**:
  - *Build Command*: `npm run tauri build -- --debug`
  - *Automated Test*: `npm run test` (Vite unit tests for shell mounting).
  - *Manual Test*: Launch application frame, verify dark/light theme render, inspect IPC health status ping in console.

---

## Milestone 2: Native Audio Capture Engine (Mic + System Loopback)
- **Goal**: Implement low-level Rust audio capture plugin using `cpal` for simultaneous microphone input and system output audio loopback recording.
- **Tasks**:
  1. Implement Rust audio device enumeration (`list_input_devices`, `list_output_devices`).
  2. Implement dual-channel PCM mixer and 16kHz mono resampler using `rubato`.
  3. Implement WAV file writer stream flushing chunks to disk every 5 seconds.
  4. Expose Tauri IPC commands: `start_recording`, `pause_recording`, `stop_recording`.
- **Verification Plan**:
  - *Build Command*: `cargo test --manifest-path src-tauri/Cargo.toml --lib audio`
  - *Automated Test*: Unit tests verifying audio sample mixing math and 16kHz resampling accuracy.
  - *Manual Test*: Trigger 10-second test recording while playing desktop audio and speaking into mic. Verify output `.wav` file plays back mixed audio cleanly without clipping or drift.

---

## Milestone 3: Local SQLite Database Layer & Data Repositories
- **Goal**: Establish SQLite persistence layer with WAL mode, auto-migrations, and complete CRUD operations.
- **Tasks**:
  1. Integrate `rusqlite` and migration runner (`refinery` / `rusqlite_migration`).
  2. Create tables (`meetings`, `recordings`, `transcripts`, `transcript_segments`, `summaries`, `action_items`, `tags`, `templates`).
  3. Write Rust repository interfaces and Tauri IPC commands for Meeting CRUD.
- **Verification Plan**:
  - *Build Command*: `cargo test --manifest-path src-tauri/Cargo.toml --lib db`
  - *Automated Test*: Test suite executing schema migrations, inserting mock meetings/recordings, verifying foreign key cascades on deletion.
  - *Manual Test*: Perform CRUD actions via IPC test harness and inspect `.sqlite` database using SQLite browser.

---

## Milestone 4: UI Meetings Dashboard & Detail View Components
- **Goal**: Build the primary frontend screens matching the design specifications in `ui.md`.
- **Tasks**:
  1. Create `MeetingsDashboard` component with Category Pills (`All`, `Work`, `Personal`, `★ Important`) and Date Scope Tabs (`Today`, `This Week`, `This Month`).
  2. Create `MeetingDetailView` component with Recordings carousel, audio playback bar, and tab switcher (`Transcription` vs `Summary`).
  3. Connect Zustand store and TanStack Query to SQLite IPC layer.
- **Verification Plan**:
  - *Build Command*: `npm run build`
  - *Automated Test*: React Testing Library tests for category filtering, tab switching, and mock data rendering.
  - *Manual Test*: Navigate dashboard, toggle filters, select meetings, and verify state changes seamlessly.

---

## Milestone 5: Local & Cloud Speech-to-Text (STT) Engine
- **Goal**: Integrate Whisper speech-to-text pipeline to convert audio recordings into timestamped speaker segments.
- **Tasks**:
  1. Integrate `whisper-rs` (Whisper.cpp) for offline STT.
  2. Implement Cloud STT provider client (Deepgram Nova-2 / OpenAI Whisper API).
  3. Build transcript segment parser and database storage worker.
- **Verification Plan**:
  - *Build Command*: `cargo test --manifest-path src-tauri/Cargo.toml --lib stt`
  - *Automated Test*: Feed a 15-second benchmark WAV audio sample into STT runner and assert non-empty text transcription output with timestamps.
  - *Manual Test*: Record live voice note, trigger transcription, and verify text segments appear aligned with audio playback.

---

## Milestone 6: Real-time Live Recording Modal & Equalizer Spectrum UI
- **Goal**: Implement the floating live recording overlay with real-time visual equalizer bars and controls.
- **Tasks**:
  1. Build Rust audio amplitude calculator emitting live volume events (`audio-spectrum-data`).
  2. Create `NewRecordingModal` overlay with backdrop blur, timer (`00:00`), dynamic multi-bar visualizer, and control buttons (Pause, Stop & Save).
  3. Register global keyboard shortcut (`Cmd/Ctrl + Shift + R`).
- **Verification Plan**:
  - *Build Command*: `npm run build`
  - *Automated Test*: Unit tests for visualizer bar scale calculation and digital clock formatting.
  - *Manual Test*: Press shortcut key to open modal, speak into microphone, observe live green/cyan audio spectrum bars reacting in real-time, press stop to persist.

---

## Milestone 7: AI Summarization Engine & Dynamic Templates
- **Goal**: Implement LLM pipeline that transforms transcript segments and user notes into structured AI summaries.
- **Tasks**:
  1. Implement LLM API clients (Ollama local, OpenAI, Anthropic Claude).
  2. Build prompt builder with template variable hydration (`Executive Brief`, `1-on-1`, `Podcast Prep`).
  3. Implement JSON schema parser for bullet points and action items.
- **Verification Plan**:
  - *Build Command*: `cargo test --manifest-path src-tauri/Cargo.toml --lib llm`
  - *Automated Test*: Test prompt generator with sample transcript; validate returned JSON strictly matches summary schema.
  - *Manual Test*: Select a meeting, choose "Executive Brief" template, click "Generate Summary", verify Executive Summary, Key Points, and Action Items populate accurately.

---

## Milestone 8: Full-Text & Semantic Vector Search Engine
- **Goal**: Implement hybrid search combining SQLite FTS5 keyword indexing with `sqlite-vec` vector similarity search.
- **Tasks**:
  1. Set up FTS5 virtual table and synchronization triggers on meeting summaries and transcripts.
  2. Integrate embedding generator (`all-MiniLM-L6-v2` ONNX runner or OpenAI embeddings API).
  3. Create global search overlay (`Cmd/Ctrl + K`) supporting hybrid search queries.
- **Verification Plan**:
  - *Build Command*: `cargo test --manifest-path src-tauri/Cargo.toml --lib search`
  - *Automated Test*: Execute search query against test dataset; verify FTS5 matches exact keywords and vector search returns semantically similar records.
  - *Manual Test*: Open search modal, type query like *"database migration"*, verify matching meetings highlight target search terms.

---

## Milestone 9: Calendar Integration & Export Engine
- **Goal**: Automate calendar event matching and export meeting intelligence to external tools.
- **Tasks**:
  1. Implement OAuth2 integration for Google Calendar and Microsoft Outlook.
  2. Build automatic meeting title/attendee auto-matcher based on recording time.
  3. Build exporter modules for Notion, Slack, Clipboard (Rich Text HTML), and Markdown files.
- **Verification Plan**:
  - *Build Command*: `npm run build`
  - *Automated Test*: Unit test markdown and rich text HTML export formatting logic.
  - *Manual Test*: Trigger "Export to Clipboard", paste into Notion/Email, and confirm formatting and bullet lists render cleanly.

---

## Milestone 10: Security Vault, OS Keyring & Production Packaging
- **Goal**: Hardened production release setup with key security, code signing, and installer bundling.
- **Tasks**:
  1. Integrate OS Keyring (`keyring-rs`) for secure storage of API credentials.
  2. Configure SQLCipher database encryption.
  3. Configure Tauri production bundler (MSI/NSIS for Windows, DMG/App Bundle for macOS) with auto-updater support.
- **Verification Plan**:
  - *Build Command*: `npm run tauri build`
  - *Automated Test*: Packaging test suite verifying binary signatures, bundle size, and key security isolation.
  - *Manual Test*: Install clean production bundle on clean test machine, store API keys, relaunch application, and verify key persistence via system credential manager.
