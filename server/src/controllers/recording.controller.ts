import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { RecordingService } from '../services/recording.service.js';

// Upload audio recording file and save metadata
export const uploadRecording = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { meetingId, durationSeconds, sampleRate, channels, format } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    if (!meetingId) {
      // Cleanup uploaded temp file if meetingId is missing
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.status(400).json({ error: 'meetingId is required' });
    }

    const recording = await RecordingService.createRecording({
      meetingId,
      filePath: file.path,
      durationSeconds: durationSeconds ? parseFloat(durationSeconds) : 0,
      sampleRate: sampleRate ? parseInt(sampleRate, 10) : 16000,
      channels: channels ? parseInt(channels, 10) : 1,
      format: format || 'wav'
    });

    res.status(201).json({
      success: true,
      message: 'Audio recording uploaded successfully',
      data: recording
    });
  } catch (error: any) {
    // Cleanup uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to upload recording', message: error.message });
  }
};

// Get recordings for a specific meeting
export const getRecordingsByMeeting = async (req: Request, res: Response) => {
  try {
    const { meetingId } = req.params;
    const recordings = await RecordingService.getRecordingsByMeeting(meetingId);
    res.status(200).json({ success: true, count: recordings.length, data: recordings });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch recordings', message: error.message });
  }
};

// Stream audio recording file by filename
export const streamAudioFile = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), 'uploads', 'recordings', filename);

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
      const fileStream = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/wav'
      };

      res.writeHead(206, head);
      fileStream.pipe(res);
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

// Delete recording
export const deleteRecording = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await RecordingService.deleteRecording(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Recording not found' });
    }

    res.status(200).json({ success: true, message: 'Recording deleted successfully', id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete recording', message: error.message });
  }
};
