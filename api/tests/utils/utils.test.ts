import { expect, test, afterAll, beforeAll, describe, it } from 'vitest';
import { makeLongText, summarizeTextFake, countWords } from '../../src/utils';

describe('makeLongText', () => {
  it('returns a string with the specified number of words', () => {
    const count = 50;
    const { text } = makeLongText(count);
    const words = text.trim().split(/\s+/);
    expect(words.length).toBe(count);
  });

  it('returns 100 words by default', () => {
    const { text } = makeLongText();
    const words = text.trim().split(/\s+/);
    expect(words.length).toBe(100);
  });
});

describe('summarizeTextFake', () => {
  it('returns a summary with the specified number of words', () => {
    const { text } = makeLongText(50);
    const { text: summary } = summarizeTextFake(text, 30);
    const words = summary.trim().split(/\s+/);
    expect(words.length).toBe(30);
  });

  it('returns 30 words by default', () => {
    const { text } = makeLongText(100);
    const { text: summary } = summarizeTextFake(text);
    const words = summary.trim().split(/\s+/);
    expect(words.length).toBe(30);
  });
});

describe('countWords', () => {
  it('counts the number of words in a string', () => {
    const text = 'This is a test string with seven words.';
    const count = countWords(text);
    expect(count).toBe(8);
  });

  it('returns 0 for an empty string', () => {
    const text = '';
    const count = countWords(text);
    expect(count).toBe(0);
  });

  it('counts words correctly with multiple spaces', () => {
    const text = 'This   has   multiple   spaces.';
    const count = countWords(text);
    expect(count).toBe(4);
  });
});
