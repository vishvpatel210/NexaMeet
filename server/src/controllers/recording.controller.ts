import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Recording } from '../models/Recording.js';
import { Meeting } from '../models/Meeting.js';
import { WhisperService } from '../services/whisper.service.js';
import { SummaryService } from '../services/summary.service.js';

// Upload audio file stream for a meeting and trigger automatic STT & AI summary pipeline
export const uploadRecording = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const { meetingId, durationSeconds } = req.body;

    if (!meetingId) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Meeting ID is required' });
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Meeting not found' });
    }

    // 1. Create Recording document
    const recording = await Recording.create({
      meetingId,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype || 'audio/wav',
      durationSeconds: durationSeconds ? parseFloat(durationSeconds) : 0,
      sttStatus: 'pending'
    });

    // Update meeting status from scheduled to completed if needed
    if (meeting.status === 'scheduled') {
      meeting.status = 'completed';
      await meeting.save();
    }

    // 2. Automated Pipeline Step 1: Speech-to-Text Transcription
    try {
      await WhisperService.transcribeRecording((recording._id as any).toString());
    } catch (sttErr: any) {
      console.warn('Automated STT transcription encountered issue:', sttErr.message);
    }

    // 3. Automated Pipeline Step 2: Regenerate AI Summary with merged transcript
    try {
      await SummaryService.generateSummary(meetingId, 'executive-brief');
    } catch (summaryErr: any) {
      console.warn('Automated AI summary regeneration encountered issue:', summaryErr.message);
    }

    // Fetch updated recording status
    const updatedRecording = await Recording.findById(recording._id);

    res.status(201).json({
      success: true,
      message: 'Audio recording uploaded and processed through AI pipeline',
      data: updatedRecording
    });
  } catch (error: any) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to upload audio recording', message: error.message });
  }
};

// Stream audio recording file statically or with range requests
export const getAudioFile = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    let filePath = path.join(process.cwd(), 'uploads', filename);

    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'uploads', 'recordings', filename);
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/wav'
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'audio/wav'
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to stream audio file', message: error.message });
  }
};

// Get all audio recordings for a specific meeting
export const getRecordingsByMeeting = async (req: Request, res: Response) => {
  try {
    const { meetingId } = req.params;
    const recordings = await Recording.find({ meetingId }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, count: recordings.length, data: recordings });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch recordings', message: error.message });
  }
};

// Delete a specific audio recording speech file
export const deleteRecording = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recording = await Recording.findById(id);

    if (!recording) {
      return res.status(404).json({ error: 'Audio recording not found' });
    }

    // Delete audio file from local disk if it exists
    if (fs.existsSync(recording.filePath)) {
      try {
        fs.unlinkSync(recording.filePath);
      } catch (err) {
        console.warn('Failed to delete physical file:', recording.filePath, err);
      }
    }

    // Delete recording record from MongoDB
    await Recording.findByIdAndDelete(id);

    // Regenerate summary with remaining recordings/transcript
    try {
      await SummaryService.generateSummary(recording.meetingId.toString(), 'executive-brief');
    } catch (e) {
      // Ignore if no remaining transcript
    }

    res.status(200).json({
      success: true,
      message: 'Audio recording speech file deleted successfully',
      id
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete recording', message: error.message });
  }
};
