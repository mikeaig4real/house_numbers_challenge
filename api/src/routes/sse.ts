import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { streamBySSE } from '../controllers/sse';

const router = Router();

router.get('/stream/:text', requireAuth, streamBySSE);

export default router;
