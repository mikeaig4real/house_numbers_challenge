import { countWords, sleep } from '../../src/utils';
import { expect, test, describe, it } from 'vitest';
import { summarizeContent, summarizeContentStream } from '../../src/services/summarize';

describe( 'Summarize Service', () =>
{
  const text = `
        Currently, when Remix rebuilds your app,
        the compiler has to process your app code along with any of its dependencies.
        The compiler tree-shakes unused code from the app so that you don't ship any
        unused code to the browser and so that you keep your server as slim as possible.
        But the compiler still needs to crawl all the code to know what to keep and what to
        tree shake away.
        In short, this means that the way you do imports and exports can have a
        big impact on how long it takes to rebuild your app.
        For example, if you are using a library like Material UI or AntD,
        you can likely speed up your builds by using path imports:
        `;
        const keywords = [
          'Remix',
          'rebuilds',
          'compiler',
          'tree-shakes',
          'unused code',
          'browser',
          'server',
  ];
  const currentWordCount = countWords(text);
  const possibleLimits = [2, 3].map((num) => Math.floor(currentWordCount / num));
  const testResponse = async ( error: boolean, summary: string, limit: number ) =>
  {
    if (error) {
      expect(summary).toBe('Failed to summarize content.');
    } else {
      const summaryWordCount = countWords(summary);
      expect(summaryWordCount).toBeLessThanOrEqual(limit);
      expect(summaryWordCount).toBeGreaterThanOrEqual(1);
      const hasKeyword = keywords.some((keyword) => summary.includes(keyword));
      expect(hasKeyword).toBe(true);
      await sleep(2000); // to avoid rate limiting
    }
  }
  test('AI can try to summarize some text adequately (reduce word count) - No Streaming', async () => {
    for (let limit of possibleLimits) {
      const { text: summary, error } = await summarizeContent( text, limit );
      testResponse( error, summary, limit );
    }
  });
  test('AI can try to summarize some text adequately (reduce word count) - Streaming', async () => {
    for (let limit of possibleLimits) {
      const cb = console.log;
      const { text: fullText, error } = await summarizeContentStream( cb, text, limit );
      testResponse(error, fullText, limit);
    };
  });
}, 10000);
