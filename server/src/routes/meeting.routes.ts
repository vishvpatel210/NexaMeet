import { Router } from 'express';
import {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting
} from '../controllers/meeting.controller.js';

const router = Router();

router.route('/')
  .post(createMeeting)
  .get(getMeetings);

router.route('/:id')
  .get(getMeetingById)
  .patch(updateMeeting)
  .delete(deleteMeeting);

export default router;
