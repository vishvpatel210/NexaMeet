import { Router } from 'express';
import {
  generateSummary,
  getSummaryByMeeting,
  getTemplates,
  updateActionItem,
  deleteSummary
} from '../controllers/summary.controller.js';

const router = Router();

router.post('/generate', generateSummary);
router.get('/templates', getTemplates);
router.get('/meeting/:meetingId', getSummaryByMeeting);
router.patch('/action-items/:id', updateActionItem);
router.delete('/:id', deleteSummary);

export default router;
