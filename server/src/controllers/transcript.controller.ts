import { Request, Response } from 'express';
import { WhisperService } from '../services/whisper.service.js';
import { Transcript } from '../models/Transcript.js';

// Trigger audio transcription for a specific recording
export const transcribeRecording = async (req: Request, res: Response) => {
  try {
    const { recordingId } = req.params;
    const { language, sttEngine } = req.body;

    if (!recordingId) {
      return res.status(400).json({ error: 'recordingId parameter is required' });
    }

    const transcript = await WhisperService.transcribeRecording(recordingId, { language, sttEngine });

    res.status(200).json({
      success: true,
      message: 'Audio transcribed successfully',
      data: transcript
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Transcription failed', message: error.message });
  }
};

// Get transcript for a meeting
export const getTranscriptByMeeting = async (req: Request, res: Response) => {
  try {
    const { meetingId } = req.params;
    const transcript = await WhisperService.getTranscriptByMeeting(meetingId);

    if (!transcript) {
      return res.status(404).json({ error: 'No transcript found for this meeting' });
    }

    res.status(200).json({ success: true, data: transcript });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch transcript', message: error.message });
  }
};

// Update speaker label or text content of a transcript segment
export const updateSegment = async (req: Request, res: Response) => {
  try {
    const { meetingId, segmentId } = req.params;
    const { speakerLabel, content } = req.body;

    const updatedTranscript = await WhisperService.updateSegment(meetingId, segmentId, { speakerLabel, content });

    if (!updatedTranscript) {
      return res.status(404).json({ error: 'Transcript or Segment not found' });
    }

    res.status(200).json({ success: true, data: updatedTranscript });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update transcript segment', message: error.message });
  }
};

// Delete transcript
export const deleteTranscript = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Transcript.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Transcript not found' });
    }

    res.status(200).json({ success: true, message: 'Transcript deleted successfully', id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete transcript', message: error.message });
  }
};
