import { summarizeContent } from '../services/summarize';
import { countWords } from '../utils';
import { AuthRequest } from './../../types';
import { Response } from 'express';
import { Snippet } from '../models/snippet';
import { config } from '../../config';

export const createSnippet = async (req: AuthRequest, res: Response): Promise<void> => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    res.status(400).json({ message: 'Invalid or empty text provided.' });
    return;
  }

  const trimmedText = text.trim();
  const wordCount = countWords(trimmedText);

  if (wordCount < config.wordDelta) {
    res.status(400).json({ message: `Text must contain at least ${config.wordDelta} words.` });
    return;
  }

  try {
    const existingSnippet = await Snippet.findOne({ text: trimmedText, user: req.user!.id });
    if (existingSnippet) {
      res.status(200).json({
        id: existingSnippet._id,
        text: existingSnippet.text,
        summary: existingSnippet.summary,
      });
      return;
    }
    const normalizedLimit = Math.min(config.wordLimit, wordCount);
    const { error, text: summary } = await summarizeContent(trimmedText, normalizedLimit);
    if (error) {
      res.status(500).json({ message: 'Failed to summarize content.' });
      return;
    }
    const summaryWordCount = countWords(summary);
    if (summaryWordCount > config.wordLimit) {
      res.status(400).json({
        message: `Summary must be ${config.wordLimit} words or fewer, but got ${summaryWordCount}.`,
      });
      return;
    }
    const snippet = new Snippet({ text: trimmedText, summary, user: req.user!.id });
    await snippet.save();
    res.status(201).json({
      id: snippet._id,
      text: snippet.text,
      summary: snippet.summary,
    });
  } catch (error) {
    console.error('Error creating snippet:', error);
    res.status(500).json({ message: 'Failed to create snippet.' });
  }
};

export const getAllSnippets = async (req: AuthRequest, res: Response) => {
  try {
    const snippets = await Snippet.find({ user: req.user!.id }).sort({ createdAt: -1 });
    res.status(200).json(
      snippets.map((snippet) => ({
        id: snippet._id,
        text: snippet.text,
        summary: snippet.summary,
      })),
    );
  } catch (error) {
    console.error('Error fetching snippets:', error);
    res.status(500).json({ message: 'Failed to fetch snippets.' });
  }
};

export const getSnippetById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const snippet = await Snippet.findOne({ _id: req.params.id, user: req.user!.id });
    if (!snippet) {
      res.status(404).json({ message: 'Snippet not found.' });
      return;
    }
    res.status(200).json({
      id: snippet._id,
      text: snippet.text,
      summary: snippet.summary,
    });
  } catch (error) {
    console.error('Error fetching snippet:', error);
    res.status(500).json({ message: 'Failed to fetch snippet.' });
  }
};
