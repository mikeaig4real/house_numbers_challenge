import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';

dotenv.config();

type Config = {
  env: string;
  port: string;
  mongoUri: string;
  mongoTestUri: string;
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
  geminiModel: string;
  wordLimit: number;
  wordDelta: number;
};

const requiredEnv = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.BE_PORT,
  MONGO_URI: process.env.MONGO_URI,
  MONGO_TEST_URI: process.env.MONGO_TEST_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME,
  FE_URL: process.env.FE_URL,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL ?? 'gemini-2.0-flash',
  SUMMARY_WORD_LIMIT: process.env.SUMMARY_WORD_LIMIT ?? '30',
  SUMMARY_WORD_DELTA: process.env.SUMMARY_WORD_DELTA ?? '5',
};

const missing = Object.entries(requiredEnv).filter(([_, v]) => typeof v === 'undefined');
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variable(s):\n${missing.map(([key]) => `- ${key}`).join('\n')}`,
  );
}

/**
 * Converts a human-readable expiration string like "7d", "12h", "30m" into milliseconds.
 * Supports days (d), hours (h), minutes (m), seconds (s).
 * @param expiresAt - e.g. "7d", "12h", "30m"
 * @returns number - duration in milliseconds
 */
export const getMaxAgeFromExpiresAt = (expiresAt: string): number => {
  const match = expiresAt.match(/^(\d+)([dhms])$/i);
  if (!match) throw new Error(`Invalid expiresAt format: ${expiresAt}`);

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  const multipliers: Record<string, number> = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    s: 1000,
  };

  return value * multipliers[unit];
}

const config: Config = Object.freeze({
  env: requiredEnv.NODE_ENV as string,
  port: requiredEnv.PORT as string,
  mongoUri: requiredEnv.MONGO_URI as string,
  mongoTestUri: requiredEnv.MONGO_TEST_URI as string,
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
  geminiModel: requiredEnv.GEMINI_MODEL as string,
  wordLimit: +requiredEnv.SUMMARY_WORD_LIMIT!,
  wordDelta: +requiredEnv.SUMMARY_WORD_DELTA!,
});

export { config };
