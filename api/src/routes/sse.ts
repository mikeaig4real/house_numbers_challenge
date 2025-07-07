import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuthExpress';
import { streamBySSE } from '../controllers/sse';
import {
  createSnippetSchema,
  getSnippetByIdSchema,
  streamTextSchema,
} from '../schemas/snippet.schema';
import { validate } from '../middleware/validateRequest';

const router = Router();

router.get('/stream/:text', requireAuth, validate(streamTextSchema), streamBySSE);

export default router;
