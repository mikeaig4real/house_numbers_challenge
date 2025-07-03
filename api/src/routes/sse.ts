import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { jwtAuth } from "../middleware/jwtAuth";
import { streamBySSE } from '../controllers/sse';

const router = Router();

router.get('/stream/:text', jwtAuth, requireAuth, streamBySSE);

export default router;
