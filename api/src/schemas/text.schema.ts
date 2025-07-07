import z from 'zod';
import { countWords } from '../utils';
import { config } from '../../config';

export const textValidator = z
  .string()
  .trim()
  .min(1, { message: 'Invalid or empty text provided.' })
  .refine(
    (val) => {
      const wordCount = countWords(val);
      return wordCount >= config.wordDelta;
    },
    { message: `Text must contain at least ${config.wordDelta} words.` },
  );
