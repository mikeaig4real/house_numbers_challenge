import { Router } from 'express';

import { requireAuth } from '../middleware/requireAuthExpress';
import { createSnippet, getAllSnippets, getSnippetById } from '../controllers/snippet';
import { createSnippetSchema, getSnippetByIdSchema } from '../schemas';
import { validate } from '../middleware/validateRequest';

const router = Router();

router.post('/', requireAuth, validate(createSnippetSchema), createSnippet);
router.get('/', requireAuth, getAllSnippets);
router.get('/:id', requireAuth, validate(getSnippetByIdSchema), getSnippetById);

export default router;
