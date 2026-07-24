import { Schema, model, Document, Types } from 'mongoose';

export interface IRecordingDocument extends Document {
  meetingId: Types.ObjectId;
  filePath: string;
  durationSeconds: number;
  sampleRate: number;
  channels: number;
  format: 'wav' | 'opus';
  sttStatus: 'pending' | 'completed' | 'failed';
  errorMessage?: string;
  createdAt: Date;
}

const RecordingSchema = new Schema<IRecordingDocument>(
  {
    meetingId: { type: Schema.Types.ObjectId, ref: 'Meeting', required: true, index: true },
    filePath: { type: String, required: true },
    durationSeconds: { type: Number, default: 0 },
    sampleRate: { type: Number, default: 16000 },
    channels: { type: Number, default: 1 },
    format: { type: String, enum: ['wav', 'opus'], default: 'wav' },
    sttStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    errorMessage: { type: String, default: '' }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const Recording = model<IRecordingDocument>('Recording', RecordingSchema);
