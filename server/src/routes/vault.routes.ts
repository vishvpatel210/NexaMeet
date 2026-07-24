import { Router } from 'express';
import { getVaultStatus, updateVaultKeys } from '../controllers/vault.controller.js';

const router = Router();

router.get('/status', getVaultStatus);
router.post('/keys', updateVaultKeys);

export default router;
