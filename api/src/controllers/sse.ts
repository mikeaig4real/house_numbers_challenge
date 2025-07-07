import { Response } from 'express';
import { countWords, normalizeErrorMessage } from '../utils';
import { AuthRequest } from './../../types';
import { TextDTO } from '../schemas';
import { snippetService } from "../services/snippet.service";
import { ISnippet } from "../models/snippet";

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
  const onDone = ( snippet: ISnippet, type?: 'created' | 'success' ) =>
  {
    const snippetAsString = JSON.stringify( {
      id: snippet.id,
      text: snippet.text,
      summary: snippet.summary,
    } );
    res.write(`event: end\ndata: ${snippetAsString}\n\n`);
    res.end();
  };
  try {
    const { text } = req.params;
    await snippetService(
      text,
      req.user!,
      true,
      (chunk) => {
        res.write(`data: ${chunk}\n\n`);
      },
      onError,
      (message) => {
        res.write(`event: error\ndata: ${message}\n\n`);
        res.end();
      },
      onDone,
    );
    req.on('close', () => {
      console.log('Client disconnected from SSE stream');
      res.end();
    });    
  } catch (error) {
    console.error('Error during SSE stream:', error);
    onError( error );
  }
};
