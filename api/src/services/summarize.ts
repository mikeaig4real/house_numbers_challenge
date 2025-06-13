import dotenv from 'dotenv';
dotenv.config();
import { GenerativeModel } from '@google/generative-ai';
import { Response } from "express";
import { createModel, streamToCallBack, streamToText } from '../utils';

let globalModel: null | GenerativeModel = null;

const wordDelta = process.env.SUMMARY_WORD_DELTA ? parseInt(process.env.SUMMARY_WORD_DELTA) : 5;

const wordLimit = process.env.SUMMARY_WORD_LIMIT ? parseInt(process.env.SUMMARY_WORD_LIMIT) : 30;

export function makePrompt(text: string, wordCount: number = wordLimit, delta: number = wordDelta): string {
  return `Summarize the following content:
    ${text};
    in <= ${Math.max(delta, wordCount - delta)} words.
    !!!IMPORTANT: if you cannot just give me a simple sentence.
    `;
}

export function getModel(): GenerativeModel {
  if (globalModel === null) {
    globalModel = createModel();
  }
  return globalModel;
}

export async function summarizeContent(text: string, wordCount: number = wordLimit): Promise<{ error: boolean; text: string }> {
  try {
    const model = getModel();
    const prompt = makePrompt(text, wordCount);
    const { response } = await model.generateContent(prompt);
    const responseText = response.text();
    return {
      error: false,
      text: responseText,
    }
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
  try
  {
    let fullText = "";
    const model = getModel();
    const prompt = makePrompt(text, wordCount);
    const { stream } = await model.generateContentStream(prompt);
    await streamToCallBack(stream, (chunk) => {
      cb( chunk );
      fullText += chunk;
    } );
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
