import { Router } from 'express';
import {
  transcribeRecording,
  retryTranscription,
  getTranscriptByMeeting,
  updateSegment,
  deleteTranscript
} from '../controllers/transcript.controller.js';

const router = Router();

router.post('/transcribe/:recordingId', transcribeRecording);
router.post('/retry/:recordingId', retryTranscription);
router.get('/meeting/:meetingId', getTranscriptByMeeting);
router.patch('/meeting/:meetingId/segment/:segmentId', updateSegment);
router.delete('/:id', deleteTranscript);

export default router;
