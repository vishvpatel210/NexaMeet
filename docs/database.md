# Database Architecture & Mongoose Schemas: NexaMeet

## 1. Data Store Stack Architecture

NexaMeet uses a dual database strategy:
1. **MongoDB**: Core Document Data Store (Meetings, Recordings, Transcripts, Summaries, Action Items, Templates, Tags).
2. **Vector DB (ChromaDB / Qdrant)**: Semantic Vector Index Store for AI vector search embeddings.

---

## 2. MongoDB Mongoose Schemas

### 2.1 `MeetingSchema` (`server/src/models/Meeting.ts`)
```typescript
import { Schema, model } from 'mongoose';

export const MeetingSchema = new Schema({
  title: { type: String, required: true, index: true },
  category: { 
    type: String, 
    enum: ['Work', 'Personal', 'Important'], 
    default: 'Work',
    index: true 
  },
  scheduledStart: { type: Date, index: true },
  scheduledEnd: { type: Date },
  location: { type: String },
  status: { 
    type: String, 
    enum: ['scheduled', 'recording', 'completed', 'archived'], 
    default: 'completed' 
  },
  isStarred: { type: Boolean, default: false },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 2.2 `RecordingSchema` (`server/src/models/Recording.ts`)
```typescript
export const RecordingSchema = new Schema({
  meetingId: { type: Schema.Types.ObjectId, ref: 'Meeting', required: true, index: true },
  filePath: { type: String, required: true },
  durationSeconds: { type: Number, default: 0 },
  sampleRate: { type: Number, default: 16000 },
  channels: { type: Number, default: 1 },
  format: { type: String, enum: ['wav', 'opus'], default: 'wav' },
  createdAt: { type: Date, default: Date.now }
});
```

### 2.3 `TranscriptSchema` (`server/src/models/Transcript.ts`)
```typescript
const SegmentSchema = new Schema({
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  speakerLabel: { type: String, default: 'Speaker 1' },
  content: { type: String, required: true }
});

export const TranscriptSchema = new Schema({
  meetingId: { type: Schema.Types.ObjectId, ref: 'Meeting', required: true, index: true },
  sttEngine: { type: String, enum: ['whisper-local', 'whisper-api'], required: true },
  language: { type: String, default: 'en' },
  segments: [SegmentSchema],
  createdAt: { type: Date, default: Date.now }
});
```

### 2.4 `SummarySchema` (`server/src/models/Summary.ts`)
```typescript
export const SummarySchema = new Schema({
  meetingId: { type: Schema.Types.ObjectId, ref: 'Meeting', required: true, index: true },
  templateId: { type: Schema.Types.ObjectId, ref: 'Template' },
  rawUserNotes: { type: String, default: '' },
  executiveSummary: { type: String, required: true },
  keyPoints: [{ type: String }],
  modelUsed: { type: String, required: true }, // e.g. 'gemini-1.5-pro', 'gpt-4o'
  createdAt: { type: Date, default: Date.now }
});
```

### 2.5 `ActionItemSchema` (`server/src/models/ActionItem.ts`)
```typescript
export const ActionItemSchema = new Schema({
  meetingId: { type: Schema.Types.ObjectId, ref: 'Meeting', required: true, index: true },
  summaryId: { type: Schema.Types.ObjectId, ref: 'Summary', required: true },
  taskDescription: { type: String, required: true },
  assignee: { type: String, default: 'Unassigned' },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  dueDate: { type: Date }
});
```

---

## 3. Vector DB Schema (ChromaDB / Qdrant Collection)

- **Collection Name**: `nexameet_vector_chunks`
- **Embedding Vector Dimension**: 1536 (OpenAI `text-embedding-3-small` or Gemini Embeddings)
- **Metadata Fields**:
  - `meetingId`: MongoDB ObjectId reference string
  - `chunkType`: `'transcript' | 'summary' | 'user_notes'`
  - `chunkText`: Verbatim text content of chunk
  - `createdAt`: ISO Timestamp
