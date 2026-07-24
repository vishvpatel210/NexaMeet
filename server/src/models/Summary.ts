import { Schema, model, Document, Types } from 'mongoose';
import { SummaryModelType } from '../../../shared/types/index.js';

export interface ISummaryDocument extends Document {
  meetingId: Types.ObjectId;
  templateId?: string;
  rawUserNotes?: string;
  executiveSummary: string;
  keyPoints: string[];
  decisions: string[];
  risks: string[];
  questions: string[];
  nextSteps: string[];
  modelUsed: SummaryModelType;
  createdAt: Date;
}

const SummarySchema = new Schema<ISummaryDocument>(
  {
    meetingId: { type: Schema.Types.ObjectId, ref: 'Meeting', required: true, index: true },
    templateId: { type: String },
    rawUserNotes: { type: String, default: '' },
    executiveSummary: { type: String, required: true },
    keyPoints: [{ type: String }],
    decisions: [{ type: String }],
    risks: [{ type: String }],
    questions: [{ type: String }],
    nextSteps: [{ type: String }],
    modelUsed: { type: String, required: true }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const Summary = model<ISummaryDocument>('Summary', SummarySchema);
