import { Router } from 'express';
import { searchMeetings, indexMeeting } from '../controllers/search.controller.js';

const router = Router();

router.get('/', searchMeetings);
router.post('/index/:meetingId', indexMeeting);

export default router;
