import { z } from 'zod';
import { config } from '../../config';
import { countWords } from "../utils";

export const createSnippetSchema = z.object( {
  body: z.object({
      text: z
        .string()
        .trim()
        .min(1, { message: 'Invalid or empty text provided.' })
        .refine(
          (val) => {
            const wordCount = countWords(val);
            return wordCount >= config.wordDelta;
          },
          { message: `Text must contain at least ${config.wordDelta} words.` },
        ),
    })
});

export const getSnippetByIdSchema = z.object( {
  params: z.object({
    id: z.string(),
  }),
});
