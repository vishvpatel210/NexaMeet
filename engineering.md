# Engineering Architecture & System Design: NexaMeet AI Desktop

## 1. Architectural Overview & System Design

NexaMeet is architected as a hybrid desktop application utilizing **Tauri 2.0 (Rust)** for core platform operations (native audio capture, sqlite persistence, local IPC, hardware APIs) combined with **React + TypeScript** for a high-performance web frontend UI renderer.

```
+-----------------------------------------------------------------------------------+
| FRONTEND LAYER (React 18 + TypeScript + Zustand + Tailwind CSS)                    |
| - UI Components (Dashboard, Detail View, Live Recording Overlay)                   |
| - State Management (TanStack Query, Zustand)                                      |
| - Audio Playback UI (Web Audio API / HTML5 Audio)                                  |
+-----------------------------------------------------------------------------------+
                                   |
                         Tauri IPC (Async JSON RPC)
                                   v
+-----------------------------------------------------------------------------------+
| BACKEND CORE LAYER (Rust Native Engine)                                           |
|                                                                                   |
|  +------------------------+  +------------------------+  +---------------------+  |
|  | Audio Engine (cpal)    |  | Database Layer         |  | Local STT Engine    |  |
|  | - Mic input capture    |  | - SQLite (rusqlite)    |  | - whisper.rs        |  |
|  | - System Loopback      |  | - FTS5 Full Text Search|  | - VAD (Silero VAD)  |  |
|  | - Opus/WAV Encoder     |  | - sqlite-vec           |  | - Diarization       |  |
|  +------------------------+  +------------------------+  +---------------------+  |
|                                                                                   |
|  +------------------------+  +------------------------+  +---------------------+  |
|  | Cloud Integrations     |  | AI Prompt Orchestrator |  | OS System Tray &    |  |
|  | - Deepgram / OpenAI    |  | - Structured JSON LLM  |  |   Global Shortcuts  |  |
|  | - OAuth2 Calendar Sync |  | - Template Hydration   |  | - Keyring / Vault   |  |
|  +------------------------+  +------------------------+  +---------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Technology Stack & Justification

### 2.1 Desktop Application Framework
- **Framework**: **Tauri 2.0 (Rust)**
  - *Justification*: Unmatched resource efficiency (RAM footprint ~40MB vs Electron's ~350MB+), native Rust multithreading for audio streaming, zero Node.js runtime overhead, robust security sandbox.

### 2.2 Frontend Stack
- **Framework**: **React 18 + TypeScript**
- **Build Tool**: **Vite**
- **State Management**: **Zustand** (global UI state & active recording status) + **TanStack Query v5** (async database IPC fetching & cache invalidation)
- **Styling**: **TailwindCSS + Lucide Icons + Framer Motion** (micro-animations for equalizer spectrum and tab transitions).

### 2.3 Backend Engine (Rust Native Plugins)
- **Audio Capture Library**: `cpal` (Cross-Platform Audio Library) + `wasapi` (Windows loopback) / `coreaudio-sys` (macOS loopback) / `pipewire` (Linux).
- **Audio Encoding**: `rubato` (resampling to 16kHz mono) + `hound` (WAV writer) + `opus` encoder (high compression storage).
- **Voice Activity Detection (VAD)**: `silero-vad` (ONNX Runtime via Rust bindings) to filter out silence before STT processing.

### 2.4 Speech-to-Text (STT) & AI Pipeline
- **Local STT**: `whisper-rs` (C++ bindings to `whisper.cpp`) utilizing hardware acceleration (Metal on Apple Silicon, CUDA/DirectML on Windows).
- **Cloud STT Fallback**: HTTP/WebSocket stream via reqwest to Deepgram Nova-2 API / OpenAI Whisper API.
- **LLM Pipeline**:
  - *Local Provider*: `ollama` API / `llama-cpp-rs` (Llama 3.2 3B / Mistral 7B).
  - *Cloud Provider*: `async-openai` crate / Anthropic API wrapper (Claude 3.5 Sonnet / GPT-4o-mini).

### 2.5 Storage & Search
- **Primary DB**: `rusqlite` (Embedded SQLite 3) with WAL (Write-Ahead Logging) mode.
- **Full Text Search**: SQLite FTS5 extension.
- **Vector Embeddings Engine**: `sqlite-vec` extension with standard cosine similarity index for fast local retrieval.

---

## 3. Data Processing Pipelines

### 3.1 Audio Capture & Recording Pipeline
```
[System Audio (Loopback)] \
                           --> [Resampler 16kHz Mono] --> [VAD Filter] --> [Buffer Ring Queue]
[Microphone Audio Input]  /                                                       |
                                                                                  v
                                                        [WAV / Opus Writer] (Disk Dump)
                                                                                  |
                                                                                  v
                                                        [Tauri Event Broadcast] (UI Equalizer)
```

1. **Dual Stream Capture**: Rust thread spawns two audio input streams (`cpal` host): Default Input (Microphone) and Default Output Loopback (System Audio).
2. **Mixing & Resampling**: Dual PCM buffer streams are mixed into a single 16kHz 16-bit mono stream using `rubato`.
3. **Chunking & VAD**: 30-second audio segments are passed through Silero VAD. Non-silent chunks are enqueued to disk (`/recordings/rec_<id>.wav`) and dispatched to the STT pipeline.
4. **UI Real-Time Telemetry**: Peak amplitude levels calculated every 50ms and emitted via Tauri event (`audio-spectrum-data`) to animate the UI spectrum visualizer.

### 3.2 Speech-to-Text & Diarization Pipeline
1. Audio chunks fed into `whisper-rs` engine.
2. Transcription segments emitted asynchronously as `TranscriptSegment`:
   ```json
   {
     "id": "seg_102",
     "recording_id": "rec_001",
     "start_time": 12.4,
     "end_time": 18.2,
     "speaker_label": "Speaker 1",
     "text": "Let's review the architectural changes for the database migration."
   }
   ```
3. Segments stored directly into SQLite `transcript_segments` table and broadcasted to frontend live preview.

### 3.3 AI Summarization Pipeline
1. User clicks "Generate Summary" or recording auto-completes.
2. System fetches:
   - Full transcript ordered by start time.
   - User handwritten markdown notes.
   - Active template configuration (e.g. Executive Brief).
3. Prompt Sanitizer constructs system prompt with JSON schema output enforcement.
4. LLM returns structured JSON payload matching summary schema:
   ```json
   {
     "executive_summary": "...",
     "key_points": ["Point 1", "Point 2"],
     "action_items": [{"task": "Update database schema", "assignee": "Alex"}]
   }
   ```
5. Payload persisted in `summaries` table and rendered in React UI.

---

## 4. Security & Privacy Model

- **OS Keyring Integration**: API Keys (OpenAI, Anthropic, Deepgram) stored in OS keyring (`keyring-rs` targeting macOS Keychain, Windows Credential Manager).
- **Local Storage Encryption**: SQLite database file protected with SQLCipher using a master key stored in the OS Keyring.
- **Network Sandboxing**: All network connections are explicitly restricted to user-configured LLM endpoints. Zero third-party telemetry.
