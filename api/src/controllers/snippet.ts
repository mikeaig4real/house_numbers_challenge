import { summarizeContent } from '../services/summarize';
import { countWords } from '../utils';
import { AuthRequest } from './../../types';
import { Response, NextFunction } from 'express';
import { Snippet } from '../models/snippet';
import { config } from '../../config';
import { BadRequestError } from '../errors/badRequestError';
import { NotFoundError } from '../errors/notFoundError';
import { CustomResponse } from '../responses/customResponse';
import { Snippet as SnippetType } from '../../types';

export const createSnippet = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { text } = req.body;
  const trimmedText = text.trim();
  const existingSnippet = await Snippet.findOne({ text: trimmedText, user: req.user!.id });
  if (existingSnippet) {
    CustomResponse.success<SnippetType>(res, {
      id: existingSnippet.id,
      text: existingSnippet.text,
      summary: existingSnippet.summary,
    });
    return;
  }
  const wordCount = countWords(trimmedText);
  const normalizedLimit = Math.min(config.wordLimit, wordCount);
  const { error, text: summary } = await summarizeContent(trimmedText, normalizedLimit);
  if (error) {
    throw new BadRequestError('Failed to summarize content.');
  }
  const summaryWordCount = countWords(summary);
  if (summaryWordCount > config.wordLimit) {
    throw new BadRequestError(
      `Summary must be ${config.wordLimit} words or fewer, but got ${summaryWordCount}.`,
    );
  }
  const snippet = new Snippet({ text: trimmedText, summary, user: req.user!.id });
  await snippet.save();
  CustomResponse.created<SnippetType>(res, {
    id: snippet.id,
    text: snippet.text,
    summary: snippet.summary,
  });
};

export const getAllSnippets = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const snippets = await Snippet.find({ user: req.user!.id }).sort({ createdAt: -1 });
  CustomResponse.success<SnippetType[]>(
    res,
    snippets.map((snippet) => ({
      id: snippet.id,
      text: snippet.text,
      summary: snippet.summary,
    })),
  );
};

export const getSnippetById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const snippet = await Snippet.findOne({ _id: req.params.id, user: req.user!.id });
  if (!snippet) {
    throw new NotFoundError('Snippet not found.');
  }
  CustomResponse.success<SnippetType>(res, {
    id: snippet.id,
    text: snippet.text,
    summary: snippet.summary,
  });
};
