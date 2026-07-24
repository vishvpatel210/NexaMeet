import { Schema, model, Document, Types } from 'mongoose';

export interface IActionItemDocument extends Document {
  meetingId: Types.ObjectId;
  summaryId: Types.ObjectId;
  taskDescription: string;
  assignee: string;
  status: 'pending' | 'completed';
  dueDate?: Date;
  priority: 'High' | 'Medium' | 'Low';
  createdAt: Date;
}

const ActionItemSchema = new Schema<IActionItemDocument>(
  {
    meetingId: { type: Schema.Types.ObjectId, ref: 'Meeting', required: true, index: true },
    summaryId: { type: Schema.Types.ObjectId, ref: 'Summary', required: true, index: true },
    taskDescription: { type: String, required: true },
    assignee: { type: String, default: 'Unassigned' },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending', index: true },
    dueDate: { type: Date },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' }
  },
  {
    timestamps: true
  }
);

export const ActionItem = model<IActionItemDocument>('ActionItem', ActionItemSchema);
