// Shared Data Transfer Objects (DTOs) and Interfaces for NexaMeet

export type CategoryType = 'Work' | 'Personal' | 'Important';
export type MeetingStatus = 'scheduled' | 'recording' | 'completed' | 'archived';
export type STTEngineType = 'whisper-local' | 'whisper-api';
export type SummaryModelType = 'google/gemini-2.0-flash-lite-001' | 'openai/gpt-4o-mini' | 'anthropic/claude-3.5-sonnet' | 'google/gemini-flash-1.5' | string;

export interface IMeeting {
  id: string;
  title: string;
  category: CategoryType;
  scheduledStart?: string;
  scheduledEnd?: string;
  location?: string;
  status: MeetingStatus;
  isStarred: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IRecording {
  id: string;
  meetingId: string;
  filePath: string;
  durationSeconds: number;
  sampleRate: number;
  channels: number;
  format: 'wav' | 'opus';
  sttStatus?: 'pending' | 'completed' | 'failed';
  errorMessage?: string;
  createdAt: string;
}

export interface ITranscriptSegment {
  id: string;
  startTime: number;
  endTime: number;
  speakerLabel: string;
  content: string;
}

export interface ITranscript {
  id: string;
  meetingId: string;
  sttEngine: STTEngineType;
  language: string;
  segments: ITranscriptSegment[];
  createdAt: string;
}

export interface ISummary {
  id: string;
  meetingId: string;
  templateId?: string;
  rawUserNotes?: string;
  executiveSummary: string;
  keyPoints: string[];
  decisions?: string[];
  risks?: string[];
  questions?: string[];
  nextSteps?: string[];
  modelUsed: SummaryModelType;
  createdAt: string;
}

export interface IActionItem {
  id: string;
  meetingId: string;
  summaryId: string;
  taskDescription: string;
  assignee: string;
  status: 'pending' | 'completed';
  dueDate?: string;
  priority?: 'High' | 'Medium' | 'Low';
}

export interface ISearchQuery {
  query: string;
  category?: CategoryType;
  limit?: number;
  isSemantic?: boolean;
}

export interface ISearchResult {
  meeting: IMeeting;
  summary?: ISummary;
  matchedSnippets: string[];
  score: number;
}
