import { Router } from 'express';
import { audioUpload } from '../middleware/upload.middleware.js';
import {
  uploadRecording,
  getRecordingsByMeeting,
  streamAudioFile,
  deleteRecording
} from '../controllers/recording.controller.js';

const router = Router();

router.post('/upload', audioUpload.single('audio'), uploadRecording);
router.get('/meeting/:meetingId', getRecordingsByMeeting);
router.get('/file/:filename', streamAudioFile);
router.delete('/:id', deleteRecording);

export default router;
