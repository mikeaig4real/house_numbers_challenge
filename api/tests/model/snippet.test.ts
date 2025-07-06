import { Snippet } from '../../src/models/snippet';
import { expect, describe, it } from 'vitest';
import mongoose from 'mongoose';

describe('Snippet model', () => {
  it('rejects summaries over word limit', async () => {
    const longSummary = 'word '.repeat(100).trim();
    const snippet = new Snippet({
      text: 'Hello',
      summary: longSummary,
      user: new mongoose.Types.ObjectId(),
    });

    await expect(snippet.validate()).rejects.toThrow(/Summary must be/);
  });

  it('accepts valid summaries', async () => {
    const summary = 'short summary under limit';
    const snippet = new Snippet({ text: 'Test', summary, user: new mongoose.Types.ObjectId() });
    await expect(snippet.validate()).resolves.toBeUndefined();
  });
});
