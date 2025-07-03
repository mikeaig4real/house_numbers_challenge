import { expect, describe, it } from 'vitest';
import {
  makeLongText,
  summarizeTextFake,
  countWords,
  getMaxAgeFromExpiresAt,
} from '../../src/utils';

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
} );

describe('getMaxAgeFromExpiresAt', () => {
  it('parses days correctly', () => {
    expect(getMaxAgeFromExpiresAt('1d')).toBe(86400000);
    expect(getMaxAgeFromExpiresAt('7d')).toBe(7 * 86400000);
  });

  it('parses hours correctly', () => {
    expect(getMaxAgeFromExpiresAt('1h')).toBe(3600000);
    expect(getMaxAgeFromExpiresAt('12h')).toBe(12 * 3600000);
  });

  it('parses minutes correctly', () => {
    expect(getMaxAgeFromExpiresAt('30m')).toBe(30 * 60000);
    expect(getMaxAgeFromExpiresAt('5m')).toBe(5 * 60000);
  });

  it('parses seconds correctly', () => {
    expect(getMaxAgeFromExpiresAt('10s')).toBe(10 * 1000);
    expect(getMaxAgeFromExpiresAt('1s')).toBe(1000);
  });

  it('throws error on invalid format', () => {
    expect(() => getMaxAgeFromExpiresAt('10')).toThrow();
    expect(() => getMaxAgeFromExpiresAt('d')).toThrow();
    expect(() => getMaxAgeFromExpiresAt('123x')).toThrow();
    expect(() => getMaxAgeFromExpiresAt('')).toThrow();
  });

  it('is case insensitive', () => {
    expect(getMaxAgeFromExpiresAt('7D')).toBe(7 * 86400000);
    expect(getMaxAgeFromExpiresAt('1H')).toBe(3600000);
    expect(getMaxAgeFromExpiresAt('2M')).toBe(2 * 60000);
    expect(getMaxAgeFromExpiresAt('3S')).toBe(3000);
  });
});

