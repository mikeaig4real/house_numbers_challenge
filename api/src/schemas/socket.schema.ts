import { z } from 'zod';
import { textValidator } from './text.schema';

export const getSummarySchema = z.object({
  text: textValidator,
});

export type getSummaryDTO = z.infer<typeof getSummarySchema>;
