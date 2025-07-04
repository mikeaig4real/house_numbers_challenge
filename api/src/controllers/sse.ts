import { Response } from 'express';
import { Snippet } from '../models/snippet';
import { summarizeContentStream } from '../services/summarize';
import { countWords } from '../utils';
import { AuthRequest } from './../../types';
import { config } from '../../config';

export const streamBySSE = async (req: AuthRequest, res: Response): Promise<void> => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  
  try {
    const { text } = req.params;
    const trimmedText = text.trim();
    const wordCount = countWords(trimmedText);
    const normalizedLimit = Math.min(config.wordLimit, wordCount);
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
    if (summaryWordCount > config.wordLimit) {
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
};
