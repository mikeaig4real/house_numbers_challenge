import { Router, Request, Response } from 'express';
import { Snippet } from '../models/snippet';
import { summarizeContent } from '../services/summarize';
import { countWords } from '../utils';
import { requireAuth } from '../middleware/requireAuth';

const wordLimit = process.env.SUMMARY_WORD_LIMIT ? parseInt( process.env.SUMMARY_WORD_LIMIT ) : 30;
const wordDelta = process.env.SUMMARY_WORD_DELTA ? parseInt(process.env.SUMMARY_WORD_DELTA) : 5;

const router = Router();

interface AuthUser {
  id: string;
  email: string;
}

interface AuthRequest extends Request {
  user?: AuthUser;
}

router.post('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    res.status(400).json({ message: 'Invalid or empty text provided.' });
    return;
  }

  const trimmedText = text.trim();
  const wordCount = countWords(trimmedText);

  if (wordCount < wordDelta) {
    res.status(400).json({ message: `Text must contain at least ${wordDelta} words.` });
    return;
  }

  try {
   
    res.status(201).json({
     
    });
  } catch (error) {
    console.error('Error creating snippet:', error);
    res.status(500).json({ message: 'Failed to create snippet.' });
  }
});

router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const snippets = []
    res.status( 200 ).json(
      []
    );
  } catch (error) {
    console.error('Error fetching snippets:', error);
    res.status(500).json({ message: 'Failed to fetch snippets.' });
  }
});

router.get('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.status(200).json({
    
    });
  } catch (error) {
    console.error('Error fetching snippet:', error);
    res.status(500).json({ message: 'Failed to fetch snippet.' });
  }
});

export default router;
