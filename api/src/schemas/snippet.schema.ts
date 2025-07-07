import { z } from 'zod';
import { textValidator } from './text.schema';

export const textObjValidator = z.object({
  text: textValidator,
});

export type TextDTO = z.infer<typeof textObjValidator>;

export const createSnippetSchema = z.object({
  body: textObjValidator,
});

export const getSnippetByIdSchema = z.object({
  params: z.object({
    id: z.string().trim(),
  }),
});

export type IdDTO = z.infer<typeof getSnippetByIdSchema>['params'];
export const streamTextSchema = z.object({
  params: textObjValidator,
});
