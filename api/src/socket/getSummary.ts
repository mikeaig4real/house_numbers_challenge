import { Express } from 'express';
import { Server } from 'socket.io';
import { AuthSocket } from '../../types';
import { normalizeErrorMessage } from '../utils';
import { ISnippet } from '../models/snippet';
import EVENTS from '../constants/events';
import { getSummarySchema, getSummaryDTO } from '../schemas';
import { snippetService } from '../services/snippet.service';

export const getSummary = (app: Express, io: Server, socket: AuthSocket) => {
  return async (data: getSummaryDTO, ack: (arg?: any) => void) => {
    const onError = (error: unknown | Error | string) => {
      ack({
        data: null,
        error: true,
        message: normalizeErrorMessage(error, `Failed to summarize content.`),
      });
    };
    const onDone = ( snippet: ISnippet ) =>
    {
      ack({
        data: {
          id: snippet.id,
          text: snippet.text,
          summary: snippet.summary,
        },
        error: false,
        message: `Successfully summarized content.`,
      });
    }
    try {
      const { text } = await getSummarySchema.parseAsync(data);
      await snippetService(
        text,
        socket.user!,
        true,
        (chunk) => {
          socket.emit(EVENTS.SEND_SUMMARY, {
            data: {
              text,
              summary: chunk,
            },
            error: false,
            message: 'Streaming summary...',
          });
        },
        onError,
        (message) => {
          ack({
            data: null,
            error: true,
            message,
          });
        },
        onDone,
      );
    } catch (error) {
      console.error('Error during socket.io stream:', error);
      onError( error );
    }
  };
};
