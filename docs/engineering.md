# Engineering Architecture: NexaMeet

## 1. System Flow & Architecture Pipeline

```
+-----------------------------------------------------------------------------------+
| ELECTRON DESKTOP LAYER (desktop/)                                                 |
| - Main Process: Electron App Lifecycle, Frameless Window, Native Audio Capture     |
| - Preload IPC Bridge: Context-Isolated IPC Channels                               |
| - Renderer Process: React Desktop UI Layer                                        |
+-----------------------------------------------------------------------------------+
                                         |
                                HTTP / WebSocket REST
                                         v
+-----------------------------------------------------------------------------------+
| EXPRESS BACKEND SERVER LAYER (server/)                                            |
| - REST Controllers: /api/v1/meetings, /api/v1/recordings, /api/v1/search         |
| - Express Middleware: Auth, File Uploads (Multer Audio Stream), Error Handling    |
+-----------------------------------------------------------------------------------+
             |                                                |
             v                                                v
+-----------------------------+             +---------------------------------------+
| MONGODB STORAGE LAYER       |             | AI SERVICES PIPELINE (server/services)|
| - Mongoose ODM Models       |             |                                       |
| - Database Collections:     |             | 1. Whisper Speech-to-Text Engine      |
|   - Meetings                |             |    - Audio Chunking & STT Runner     |
|   - Recordings              |             | 2. Gemini / OpenAI LLM Orchestrator   |
|   - Transcripts             |             |    - Prompt Hydration & Summarization |
|   - Summaries               |             | 3. Vector DB Search Engine            |
|   - Action Items            |             |    - Embeddings & Cosine Search       |
+-----------------------------+             +---------------------------------------+
```

---

## 2. Directory Layout & Architecture Roles

```
NexaMeet/
├── desktop/                 # Electron main process & IPC renderer bridge
│   ├── src/
│   │   ├── main/            # Electron main window & system audio recording
│   │   ├── preload/         # IPC bridge exposes window.api to Renderer
│   │   └── renderer/        # React Application UI (Components, State, Views)
├── server/                  # Express API Server Backend
│   ├── src/
│   │   ├── controllers/     # Express route handlers
│   │   ├── models/          # MongoDB Mongoose schemas
│   │   ├── routes/          # Express API route endpoints
│   │   ├── services/        # AI engines (Whisper, Gemini/OpenAI, Vector DB)
│   │   └── config/          # DB connection & environment configs
├── shared/                  # Shared DTOs, Enums, TypeScript Interfaces
│   ├── types/               # Meeting, Audio, Transcript, Summary interfaces
│   └── constants/           # API routes, Category enums, Error codes
├── docs/                    # Architecture Specs & Design Systems
├── scripts/                 # Dev scripts, DB seeders, environment setup
└── assets/                  # Application branding, icons, graphic assets
```

---

## 3. Component Details & Pipeline Flow

### 3.1 Audio Capture & Upload Flow
1. **Desktop App (`desktop/`)**: Native Audio loopback stream records microphone and desktop output into PCM buffers.
2. **Audio File Transfer**: Electron uploads `.wav` audio chunk stream to Express backend `/api/v1/recordings/upload` endpoint using `multer`.
3. **MongoDB Registration**: Metadata entry created in `recordings` MongoDB collection.

### 3.2 Speech-to-Text (Whisper STT Pipeline)
1. Express API passes recorded audio file path to `WhisperService`.
2. Whisper processes audio chunks and returns timestamped speaker segments (`WhisperSegment[]`).
3. Segments stored in `transcripts` collection linked to the `meetingId`.

### 3.3 Gemini / OpenAI LLM Summarization
1. `SummaryService` retrieves transcript segments and human notes.
2. Prompt Builder formats context with chosen template (`Executive Brief`, `1-on-1`, `Podcast Prep`).
3. Gemini / OpenAI API invoked with structured JSON Schema requirement.
4. Summary and Action Items stored in MongoDB `summaries` and `action_items` collections.

### 3.4 Vector DB Semantic Search Engine
1. Transcript and Summary text chunks are passed to `EmbeddingService` (OpenAI / Gemini Embeddings).
2. 1536-dimensional embedding vectors stored in Vector DB (ChromaDB / Qdrant / Pinecone).
3. Search controller performs vector cosine similarity queries to return semantically relevant meetings.
