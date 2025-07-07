import { normalizeErrorMessage } from '../utils';
import { AuthRequest } from './../../types';
import { Response } from 'express';
import { ISnippet, Snippet } from '../models/snippet';
import { BadRequestError } from '../errors/badRequestError';
import { NotFoundError } from '../errors/notFoundError';
import { CustomResponse } from '../responses/customResponse';
import { Snippet as SnippetType } from '../../types';
import { IdDTO, TextDTO } from '../schemas';
import { snippetService } from '../services/snippet.service';

export const createSnippet = async (
  req: AuthRequest<{}, {}, TextDTO>,
  res: Response,
): Promise<void> =>
{
  const onDone = ( snippet: ISnippet, type?: 'created' | 'success' ) =>
  {
    CustomResponse[type!]<SnippetType>(res, {
      id: snippet.id,
      text: snippet.text,
      summary: snippet.summary,
    });
  }
  const { text } = req.body;
  await snippetService(
    text,
    req.user!,
    false,
    () => {},
    (e) => {
      const message = normalizeErrorMessage(e, 'Failed to summarize content.');
      throw new BadRequestError(message);
    },
    (message) => {
      throw new BadRequestError(message);
    },
    onDone,
  );
};

export const getAllSnippets = async (req: AuthRequest, res: Response) => {
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

export const getSnippetById = async (req: AuthRequest<IdDTO>, res: Response): Promise<void> => {
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
