
import { Router } from 'express';

import { requireAuth } from '../middleware/requireAuth';
import { jwtAuth } from "../middleware/jwtAuth";
import { createSnippet, getAllSnippets, getSnippetById } from '../controllers/snippet';

const router = Router();

router.post('/', jwtAuth, requireAuth, createSnippet);
router.get('/', jwtAuth, requireAuth, getAllSnippets);

router.get('/:id', jwtAuth, requireAuth, getSnippetById);

export default router;
