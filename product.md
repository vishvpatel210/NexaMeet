# Product Specification: NexaMeet AI Desktop Notepad

## 1. Executive Summary & Vision
NexaMeet is a next-generation, local-first AI-powered desktop notepad and meeting intelligence application inspired by Granola. Designed for executives, engineers, product managers, and researchers, NexaMeet transforms unorganized meeting audio and scribbled notes into structured, actionable intelligence. 

Unlike traditional passive meeting bots that join video calls as visible guests, NexaMeet runs directly on the user's computer, capturing system audio (speakers/headphones) and microphone audio natively without needing permission to invite external bots into calendar calls.

## 2. Target Audience & Core Value Proposition
- **Target Persona**: Software Architects, Tech Leads, Product Managers, Founders, Consultants, and Knowledge Workers who spend 15+ hours/week in synchronous discussions.
- **Core Value Proposition**:
  - **Bot-Free Audio Capture**: Invisible, seamless recording of Zoom, Google Meet, Teams, Podcasts, or face-to-face conversations without third-party bot intrusion.
  - **Local-First Privacy**: Encrypted, local audio storage and local database. Options for 100% offline transcription and summary using local models.
  - **AI-Enhanced Human Notes**: Combines raw user shorthand notes with AI meeting transcripts to generate rich, context-aware summaries tailored to user templates.
  - **Instant Searchability**: Hybrid search (Full-Text + Vector Semantic Search) across all historic meetings, decisions, and action items.

---

## 3. Feature Specifications

### 3.1 Meeting Recording & Audio Engine
- **Dual-Channel Native Audio Capture**:
  - Simultaneous recording of system audio output (virtual loopback) and microphone input.
  - Noise suppression and auto-gain control.
  - Multi-recording support per meeting (ability to pause, add supplemental audio clips, or append follow-up recordings to an existing meeting entry).
- **Live Visualizer & Quick Tray Control**:
  - Dynamic audio equalizer waveform visualization during recording.
  - Timer displaying elapsed time (HH:MM:SS).
  - One-click Pause, Resume, and Stop controls.
  - Global desktop hotkeys (e.g., `Cmd/Ctrl + Shift + R`) to start/stop instant recording.

### 3.2 Speech-to-Text (STT) & Diarization
- **Hybrid STT Pipeline**:
  - **Local STT**: Embedded Whisper.cpp / ONNX runner for zero-latency, offline, privacy-first transcription.
  - **Cloud STT**: API fallback (Deepgram Nova-2 / OpenAI Whisper API) for low-resource hardware or higher precision.
- **Speaker Diarization & Timestamping**:
  - Automatic speaker segmentation (Speaker 1, Speaker 2) with manual name assignment.
  - Word-level timestamps enabling click-to-play audio alignment from transcript sentences.

### 3.3 Notes Editor & AI Summarization
- **Split-View Workspace**:
  - Left Pane / Tab: High-speed Markdown notes editor for real-time human note-taking.
  - Right Pane / Tab: Auto-generated AI Summary & Structured Extraction.
- **Dynamic Template Engine**:
  - Built-in templates:
    - *1-on-1 Sync*: Objectives, Feedback, Action Items, Key Takeaways.
    - *Executive Brief*: Summary, High-Level Decisions, Risks, Resource Needs.
    - *Product & Architecture Review*: Technical Decisions, Tradeoffs, Blockers, Tasks.
    - *Podcast / Interview Prep*: Main Topics, Highlights, Notable Quotes.
    - *Bug Scrub / Standup*: Blockers, Progress, Escalations.
  - Custom Prompt & Template Builder with variables (`{{transcript}}`, `{{user_notes}}`, `{{attendees}}`).
- **AI Action Item & Highlight Extraction**:
  - Automatic extraction of tasks with assignee tags and due dates.
  - Key decision callouts formatted in structured Markdown blockquotes.

### 3.4 Meeting Library & Knowledge Management
- **Category & Tag Organization**:
  - Categories: Work, Personal, Important, Custom Projects.
  - Flexible Tagging System (`#vibecode`, `#architecture`, `#hiring`).
- **Temporal Filtering & Views**:
  - Filter tabs: All, Today, This Week, This Month.
  - Custom date range picker.
- **Universal Hybrid Search**:
  - Search across meeting titles, tags, verbatim transcripts, human notes, and AI summaries.
  - Semantic vector search to answer questions like *"What did we decide about database migrations last week?"*

### 3.5 Integrations & Export Capabilities
- **Calendar Synchronization**:
  - Google Calendar & Microsoft Outlook OAuth2 integration.
  - Auto-matching incoming/ongoing recordings to calendar events based on time and attendees.
- **One-Click Export**:
  - Export to Notion, Slack, Obsidian, Jira, Markdown, JSON, and PDF.
  - Copy formatted summaries to clipboard with rich HTML or plain text formatting.

---

## 4. Non-Functional Requirements
- **Performance**:
  - App launch time < 1.5 seconds.
  - Audio capture CPU utilization < 3%.
  - Local transcription processing speed >= 3x real-time speed on Apple Silicon / modern x64 CPUs with AVX2.
- **Security & Privacy**:
  - Local database encrypted via SQLCipher (AES-256).
  - API keys stored in system secure keystore (macOS Keychain / Windows Credential Manager / Secret Service API).
  - Zero telemetry or audio data sent to external servers without explicit user opt-in.
- **Reliability & Crash Resilience**:
  - Auto-flushing audio buffer every 5 seconds to temporary disk storage to prevent data loss on unexpected power-off or app crash.
