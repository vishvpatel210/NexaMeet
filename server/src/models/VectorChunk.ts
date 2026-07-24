import { Schema, model, Document, Types } from 'mongoose';

export interface IVectorChunkDocument extends Document {
  meetingId: Types.ObjectId;
  chunkType: 'transcript' | 'summary' | 'user_notes';
  chunkText: string;
  embedding: number[];
  createdAt: Date;
}

const VectorChunkSchema = new Schema<IVectorChunkDocument>(
  {
    meetingId: { type: Schema.Types.ObjectId, ref: 'Meeting', required: true, index: true },
    chunkType: { type: String, enum: ['transcript', 'summary', 'user_notes'], required: true },
    chunkText: { type: String, required: true },
    embedding: { type: [Number], required: true }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const VectorChunk = model<IVectorChunkDocument>('VectorChunk', VectorChunkSchema);
