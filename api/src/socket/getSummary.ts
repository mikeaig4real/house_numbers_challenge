import { Express } from 'express';
import { Server } from 'socket.io';
import { AuthSocket } from '../../types';
import { countWords, normalizeErrorMessage } from '../utils';
import { summarizeContentStream } from '../services/summarize';
import { Snippet } from '../models/snippet';
import { config } from '../../config';
import EVENTS from '../constants/events';
import { getSummarySchema, getSummaryDTO } from '../schemas';

export const getSummary = (app: Express, io: Server, socket: AuthSocket) => {
  return async (data: getSummaryDTO, ack: (arg?: any) => void) => {
    try {
      const { text } = await getSummarySchema.parseAsync(data);
      const wordCount = countWords(text);
      const normalizedLimit = Math.min(config.wordLimit, wordCount);
      const { text: summary, error } = await summarizeContentStream(
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
        text,
        normalizedLimit,
      );
      if (error) {
        console.error('Error summarizing content:', error);
        ack({
          data: null,
          error: true,
          message: normalizeErrorMessage(error, `Failed to summarize content.`),
        });
        return;
      }
      const summaryWordCount = countWords(summary);
      if (summaryWordCount > config.wordLimit) {
        ack({
          data: null,
          error: true,
          message: `Summary exceeds word limit.`,
        });
        return;
      }
      const snippet = new Snippet({ text, summary, user: socket.user!.id });
      await snippet.save();
      ack({
        data: {
          id: snippet._id,
          text,
          summary,
        },
        error: false,
        message: `Successfully summarized content.`,
      });
    } catch (error) {
      console.error('Error during socket.io stream:', error);
      ack({
        data: null,
        error: true,
        message: normalizeErrorMessage(error, `Failed to summarize content.`),
      });
    }
  };
};
