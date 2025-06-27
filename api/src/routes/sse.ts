import { Router, Request, Response } from 'express';
import { Snippet } from '../models/snippet';
import { summarizeContentStream } from '../services/summarize';
import { countWords } from '../utils';
import { requireAuth } from '../middleware/requireAuth';

const wordLimit = process.env.SUMMARY_WORD_LIMIT ? parseInt( process.env.SUMMARY_WORD_LIMIT ) : 30;
const wordDelta = process.env.SUMMARY_WORD_DELTA ? parseInt(process.env.SUMMARY_WORD_DELTA) : 5;

const router = Router();

router.get('/stream/:text', requireAuth, async (req: Request, res: Response): Promise<void> => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const { text } = req.params;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    res.status(404).end('Invalid or empty text provided.');
    return;
  }

  const trimmedText = text.trim();
  const wordCount = countWords(trimmedText);

  if (wordCount < wordDelta) {
    res.status(400).end(`Text must contain at least ${wordDelta} words.`);
    return;
  }

  try {
    const normalizedLimit = Math.min(wordLimit, wordCount);
    const { text: summary, error } = await summarizeContentStream(
      (chunk) => {
        res.write(`data: ${chunk}\n\n`);
      },
      trimmedText,
      normalizedLimit,
    );
    if (error) {
      res.write('event: error\ndata: Failed to summarize content.\n\n');
      res.end();
      return;
    }
    const summaryWordCount = countWords(summary);
    if (summaryWordCount > wordLimit) {
      res.write(`event: error\ndata: Summary exceeds word limit.\n\n`);
      res.end();
      return;
    }
    const snippet = new Snippet({ text: trimmedText, summary, user: req.user!.id });
    await snippet.save();
    res.write('event: end\ndata: done\n\n');
    res.end();
  } catch (error) {
    console.error('Error during SSE stream:', error);
    res.write('event: error\ndata: Internal server error.\n\n');
    res.end();
  }
});

export default router;
