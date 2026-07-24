import { Schema, model, Document, Types } from 'mongoose';
import { STTEngineType } from '../../../shared/types/index.js';

export interface ITranscriptSegmentDoc {
  startTime: number;
  endTime: number;
  speakerLabel: string;
  content: string;
}

export interface ITranscriptDocument extends Document {
  meetingId: Types.ObjectId;
  sttEngine: STTEngineType;
  language: string;
  segments: ITranscriptSegmentDoc[];
  createdAt: Date;
}

const SegmentSchema = new Schema<ITranscriptSegmentDoc>({
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  speakerLabel: { type: String, default: 'Speaker 1' },
  content: { type: String, required: true }
});

const TranscriptSchema = new Schema<ITranscriptDocument>(
  {
    meetingId: { type: Schema.Types.ObjectId, ref: 'Meeting', required: true, index: true },
    sttEngine: { type: String, required: true },
    language: { type: String, default: 'en' },
    segments: [SegmentSchema]
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const Transcript = model<ITranscriptDocument>('Transcript', TranscriptSchema);
