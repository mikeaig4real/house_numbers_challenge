import { z } from 'zod';
import { config } from '../../config';
import { countWords } from "../utils";

export const textValidator = z.object({
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
} );

export type TextDTO = z.infer<typeof textValidator>;

export const createSnippetSchema = z.object( {
  body: textValidator,
});

export const getSnippetByIdSchema = z.object( {
  params: z.object({
    id: z.string(),
  }),
} );

export type IdDTO = z.infer<typeof getSnippetByIdSchema>['params'];
export const streamTextSchema = z.object({
  params: textValidator,
});
