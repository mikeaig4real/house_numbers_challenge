import { config } from '../../config';
import { Snippet, ISnippet } from '../models/snippet';
import { countWords } from '../utils';
import { summarizeContent, summarizeContentStream } from './summarize';

export const snippetService = async (
  text: string,
  user: {
    id?: string;
  },
  stream: boolean,
  onChunk: (chunk: string) => void,
  onError: (e?: unknown | Error | string) => void,
  onExceededLimit: (message: string) => void,
  onDone: (snippet: ISnippet, type?: 'success' | 'created') => void,
) => {
  try {
    const wordCount = countWords(text);
    const normalizedLimit = Math.min(config.wordLimit, wordCount);
    const existingSnippet = await Snippet.findOne({ text, user: user.id });
    if (existingSnippet) return onDone(existingSnippet, 'success');
    const { text: summary, error } = stream
      ? await summarizeContentStream(
          (chunk) => {
            onChunk(chunk);
          },
          text,
          normalizedLimit,
        )
      : await summarizeContent(text, normalizedLimit);
    if (error) return onError();
    const summaryWordCount = countWords(summary);
    if (summaryWordCount > config.wordLimit)
      return onExceededLimit(
        `Summary must be ${config.wordLimit} words or fewer, but got ${summaryWordCount}.`,
      );
    const snippet = new Snippet({ text, summary, user: user.id });
    await snippet.save();
    onDone(snippet, 'created');
  } catch (error) {
    console.error('Error summarizing content:', error);
    onError(error);
  }
};
