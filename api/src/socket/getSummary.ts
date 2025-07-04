import { Express } from 'express';
import { Server, Socket } from 'socket.io';
import { countWords } from '../utils';
import { summarizeContentStream } from '../services/summarize';
import { Snippet } from '../models/snippet';
import { config } from "../../config";
import EVENTS from '../constants/events';

const wordLimit = config.wordLimit;
const wordDelta = config.wordDelta;

export const getSummary = (app: Express, io: Server, socket: Socket) => {
  return async (
    {
      text,
      user,
    }: {
      text: string;
      user: {
        id?: string;
      };
    },
    ack: (arg?: any) => void,
  ) => {
    if (!socket.user) {
      ack({ data: null, error: true, message: 'User not found in socket' });
      return;
    }
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      ack({ data: null, error: true, message: 'Invalid or empty text provided.' });
      return;
    }

    const trimmedText = text.trim();
    const wordCount = countWords(trimmedText);

    if (wordCount < wordDelta) {
      ack({ data: null, error: true, message: `Text must contain at least ${wordDelta} words.` });
      return;
    }
    try {
      const normalizedLimit = Math.min(wordLimit, wordCount);
      const { text: summary, error } = await summarizeContentStream(
        (chunk) => {
          socket.emit(EVENTS.SEND_SUMMARY, {
            data: {
              text: trimmedText,
              summary: chunk,
            },
            error: false,
            message: 'Streaming summary...',
          });
        },
        trimmedText,
        normalizedLimit,
      );
      if (error) {
        console.error('Error summarizing content:', error);
        ack({
          data: null,
          error: true,
          message: `Failed to summarize content.`,
        });
        return;
      }
      const summaryWordCount = countWords(summary);
      if (summaryWordCount > wordLimit) {
        ack({
          data: null,
          error: true,
          message: `Summary exceeds word limit.`,
        });
        return;
      }
      const snippet = new Snippet({ text: trimmedText, summary, user: socket.user!.id });
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
      const e = error as Error;
      ack({
        data: null,
        error: true,
        message: e.message || `Failed to summarize content.`,
      });
    }
  };
};
