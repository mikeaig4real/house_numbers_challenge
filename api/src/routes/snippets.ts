
import { Router } from 'express';

import { requireAuth } from '../middleware/requireAuth';
import { createSnippet, getAllSnippets, getSnippetById } from '../controllers/snippet';
import { createSnippetSchema, getSnippetByIdSchema } from "../schemas/snippet.schema";
import { validate } from "../middleware/validate";

const router = Router();

router.post('/', requireAuth, validate(createSnippetSchema), createSnippet);
router.get('/', requireAuth, getAllSnippets);
router.get('/:id', requireAuth, validate(getSnippetByIdSchema), getSnippetById);

export default router;
