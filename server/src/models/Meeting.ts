import { Schema, model, Document } from 'mongoose';
import { CategoryType, MeetingStatus } from '../../../shared/types/index.js';

export interface IMeetingDocument extends Document {
  title: string;
  category: CategoryType;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  location?: string;
  status: MeetingStatus;
  isStarred: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema = new Schema<IMeetingDocument>(
  {
    title: { type: String, required: true, trim: true, index: true },
    category: {
      type: String,
      enum: ['Work', 'Personal', 'Important'],
      default: 'Work',
      index: true
    },
    scheduledStart: { type: Date },
    scheduledEnd: { type: Date },
    location: { type: String, trim: true },
    status: {
      type: String,
      enum: ['scheduled', 'recording', 'completed', 'archived'],
      default: 'completed',
      index: true
    },
    isStarred: { type: Boolean, default: false, index: true },
    tags: [{ type: String, trim: true }]
  },
  {
    timestamps: true
  }
);

export const Meeting = model<IMeetingDocument>('Meeting', MeetingSchema);
