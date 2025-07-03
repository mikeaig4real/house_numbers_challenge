
import { Router } from 'express';

import { requireAuth } from '../middleware/requireAuth';
import { createSnippet, getAllSnippets, getSnippetById } from '../controllers/snippet';

const router = Router();

router.post('/', requireAuth, createSnippet);
router.get('/', requireAuth, getAllSnippets);

router.get('/:id', requireAuth, getSnippetById);

export default router;
