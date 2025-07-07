import { Response } from 'express';
import { countWords, normalizeErrorMessage } from '../utils';
import { AuthRequest } from './../../types';
import { TextDTO } from '../schemas';
import { snippetService } from "../services/snippet.service";

export const streamBySSE = async (
  req: AuthRequest<TextDTO, {}, {}>,
  res: Response,
): Promise<void> => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  const onError = (error: unknown | Error | string) => {
    res.write(
      `event: error\ndata: ${normalizeErrorMessage(error, 'Failed to summarize content.')}\n\n`,
    );
    res.end();
  };
  try {
    const { text } = req.params;
    await snippetService(
      text,
      req.user!,
      true,
      ( chunk ) =>
      {
        res.write(`data: ${chunk}\n\n`);
      },
      onError,
      (message) =>
      {
        res.write(`event: error\ndata: ${message}\n\n`);
        res.end();
      },
      () =>
      {
        res.write('event: end\ndata: done\n\n');
        res.end();
      }
    )
  } catch (error) {
    console.error('Error during SSE stream:', error);
    onError( error );
  }
};
