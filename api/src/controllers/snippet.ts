import { summarizeContent } from '../services/summarize';
import { countWords } from '../utils';
import { AuthRequest } from './../../types';
import { Response, NextFunction } from 'express';
import { Snippet } from '../models/snippet';
import { config } from '../../config';
import { BadRequestError } from "../errors/badRequestError";

export const createSnippet = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {

  try {
    const { text } = req.body;
    const trimmedText = text.trim();
    const wordCount = countWords(trimmedText);
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
      throw new BadRequestError('Failed to summarize content.');
    }
    const summaryWordCount = countWords(summary);
    if (summaryWordCount > config.wordLimit) {
      throw new BadRequestError(`Summary must be ${config.wordLimit} words or fewer, but got ${summaryWordCount}.`);
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
    next(new BadRequestError('Failed to create snippet.'));
  }
};

export const getAllSnippets = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
    console.error( 'Error fetching snippets:', error );
    next(new BadRequestError('Failed to fetch snippets.'));
  }
};

export const getSnippetById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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
    next(new BadRequestError('Failed to fetch snippet.'));
  }
};
