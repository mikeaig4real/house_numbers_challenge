import dotenv from 'dotenv';
dotenv.config();
import { GenerativeModel } from '@google/generative-ai';
import { createModel, streamToCallBack } from '../utils';
import { config } from '../../config';

let globalModel: null | GenerativeModel = null;

const wordDelta = config.wordDelta;

const wordLimit = config.wordLimit;

export function makePrompt(
  text: string,
  wordCount: number = wordLimit,
  delta: number = wordDelta,
): string {
  return `Summarize the following content in ${Math.max(delta, wordCount - delta)} words or fewer:

    "${text}"

    !!!IMPORTANT: If a short summary isn't possible, return a concise sentence instead.
    `;
}

export function getModel(): GenerativeModel {
  if (globalModel === null) {
    globalModel = createModel();
  }
  return globalModel;
}

export async function summarizeContent(
  text: string,
  wordCount: number = wordLimit,
): Promise<{ error: boolean; text: string }> {
  try {
    const model = getModel();
    const prompt = makePrompt(text, wordCount);
    const { response } = await model.generateContent(prompt);
    const responseText = response.text();
    return {
      error: false,
      text: responseText,
    };
  } catch (error) {
    console.error('Error summarizing content:', error);
    return {
      error: true,
      text: 'Failed to summarize content.',
    };
  }
}

export async function summarizeContentStream(
  cb: (chunk: string) => void | any,
  text: string,
  wordCount: number = wordLimit,
): Promise<{
  error: boolean;
  text: string;
}> {
  try {
    let fullText = '';
    const model = getModel();
    const prompt = makePrompt(text, wordCount);
    const { stream } = await model.generateContentStream(prompt);
    await streamToCallBack(stream, (chunk) => {
      cb(chunk);
      fullText += chunk;
    });
    return {
      error: false,
      text: fullText,
    };
  } catch (error) {
    console.error('Error summarizing content:', error);
    return {
      error: true,
      text: 'Failed to summarize content.',
    };
  }
}
