import { Router } from 'express';
import { audioUpload } from '../middleware/upload.middleware.js';
import { uploadRecording, getAudioFile, getRecordingsByMeeting, deleteRecording } from '../controllers/recording.controller.js';

const router = Router();

router.post('/upload', audioUpload.single('audio'), uploadRecording);
router.get('/file/:filename', getAudioFile);
router.get('/meeting/:meetingId', getRecordingsByMeeting);
router.delete('/:id', deleteRecording);

export default router;
