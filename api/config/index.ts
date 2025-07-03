import dotenv from 'dotenv';
import { getMaxAgeFromExpiresAt } from '../src/utils';
import { SignOptions } from 'jsonwebtoken';

dotenv.config();

type Config = {
  env: string;
  port: string;
  mongoUri: string;
  jwt: {
    secret: string;
    expiresIn: SignOptions['expiresIn'];
    cookieName: string;
    cookieOptions: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: 'lax' | 'strict' | 'none';
      maxAge: number;
    };
  };
  frontendUrl: string;
  geminiApiKey: string;
  wordLimit: number;
  wordDelta: number;
};

const requiredEnv = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.BE_PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME,
  FE_URL: process.env.FE_URL,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  SUMMARY_WORD_LIMIT: process.env.SUMMARY_WORD_LIMIT ?? '30',
  SUMMARY_WORD_DELTA: process.env.SUMMARY_WORD_DELTA ?? '5',
};

const missing = Object.entries(requiredEnv).filter(([_, v]) => typeof v === 'undefined');
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variable(s):\n${missing.map(([key]) => `- ${key}`).join('\n')}`,
  );
}

const config: Config = Object.freeze({
  env: requiredEnv.NODE_ENV as string,
  port: requiredEnv.PORT as string,
  mongoUri: requiredEnv.MONGO_URI as string,
  jwt: {
    secret: requiredEnv.JWT_SECRET as string,
    expiresIn: requiredEnv.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    cookieName: requiredEnv.JWT_COOKIE_NAME as string,
    cookieOptions: {
      httpOnly: true,
      secure: requiredEnv.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: getMaxAgeFromExpiresAt(requiredEnv.JWT_EXPIRES_IN!),
    },
  },
  frontendUrl: requiredEnv.FE_URL as string,
  geminiApiKey: requiredEnv.GEMINI_API_KEY as string,
  wordLimit: +requiredEnv.SUMMARY_WORD_LIMIT!,
  wordDelta: +requiredEnv.SUMMARY_WORD_DELTA!,
});

export { config };
