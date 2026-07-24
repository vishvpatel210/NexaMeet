import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Recording } from '../models/Recording.js';
import { Meeting } from '../models/Meeting.js';

// Upload audio file stream for a meeting
export const uploadRecording = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const { meetingId, durationSeconds } = req.body;

    if (!meetingId) {
      // Clean up uploaded file if meetingId missing
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Meeting ID is required' });
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Meeting not found' });
    }

    const recording = await Recording.create({
      meetingId,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype || 'audio/wav',
      durationSeconds: durationSeconds ? parseFloat(durationSeconds) : 0
    });

    res.status(201).json({
      success: true,
      message: 'Audio recording uploaded successfully',
      data: recording
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
    const filePath = path.join(process.cwd(), 'uploads', filename);

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

    res.status(200).json({
      success: true,
      message: 'Audio recording speech file deleted successfully',
      id
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete recording', message: error.message });
  }
};
