import fs from 'fs';
import path from 'path';
import { Types } from 'mongoose';
import { Recording, IRecordingDocument } from '../models/Recording.js';
import { Meeting } from '../models/Meeting.js';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'recordings');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export class RecordingService {
  /**
   * Register a new audio recording in MongoDB and link to meeting
   */
  static async createRecording(params: {
    meetingId: string;
    filePath: string;
    durationSeconds?: number;
    sampleRate?: number;
    channels?: number;
    format?: 'wav' | 'opus';
  }): Promise<IRecordingDocument> {
    const { meetingId, filePath, durationSeconds = 0, sampleRate = 16000, channels = 1, format = 'wav' } = params;

    // Verify meeting exists
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      throw new Error(`Meeting with ID ${meetingId} not found`);
    }

    const recording = await Recording.create({
      meetingId: new Types.ObjectId(meetingId),
      filePath,
      durationSeconds,
      sampleRate,
      channels,
      format
    });

    // Update meeting status if recording
    if (meeting.status === 'scheduled') {
      meeting.status = 'completed';
      await meeting.save();
    }

    return recording;
  }

  /**
   * Get all recordings for a given meeting ID
   */
  static async getRecordingsByMeeting(meetingId: string): Promise<IRecordingDocument[]> {
    return Recording.find({ meetingId: new Types.ObjectId(meetingId) }).sort({ createdAt: 1 });
  }

  /**
   * Get recording by ID
   */
  static async getRecordingById(recordingId: string): Promise<IRecordingDocument | null> {
    return Recording.findById(recordingId);
  }

  /**
   * Delete recording from disk and database
   */
  static async deleteRecording(recordingId: string): Promise<boolean> {
    const recording = await Recording.findById(recordingId);
    if (!recording) return false;

    // Delete physical file if exists
    if (fs.existsSync(recording.filePath)) {
      try {
        fs.unlinkSync(recording.filePath);
      } catch (err) {
        console.warn(`Failed to delete recording file at ${recording.filePath}:`, err);
      }
    }

    await Recording.findByIdAndDelete(recordingId);
    return true;
  }
}
