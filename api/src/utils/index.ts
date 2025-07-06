import dotenv from 'dotenv';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
dotenv.config();
import { GoogleGenerativeAI, EnhancedGenerateContentResponse } from '@google/generative-ai';
import { config } from "../../config";
import { AuthRequest, AuthSocket, User } from "../../types";
import { error } from "console";
import { AuthError } from "../errors/authError";

const GEMINI_API_KEY = config.geminiApiKey;
const GEMINI_MODEL = config.geminiModel;


// Google Generative AI model configuration and Recommended functions from sdk documentation/template

/**
 * Google Generative AI instance.
 * @type {GoogleGenerativeAI}
 */
const genAI = new GoogleGenerativeAI( GEMINI_API_KEY || "" );


/**
 * Returns the text from the stream.
 * @param {ReadableStream} stream - The stream to be read.
 * @returns {Promise<string>} - The text from the stream.
 */
export async function streamToText(stream: ReadableStream): Promise<string> {
  let text = '';
  for await (const chunk of stream) {
    text += chunk.text();
  }
  return text;
}


/**
 * Applies a callback function on each chunk of a stream.
 * @param {AsyncGenerator<EnhancedGenerateContentResponse, any, any>} stream - The stream to iterate over.
 * @param {Function} cb - The callback function to apply on each chunk.
 * @returns {Promise<void>}
 */
export async function streamToCallBack(
  stream: AsyncGenerator<EnhancedGenerateContentResponse, any, any>,
  cb: (chunk: string) => void | any,
): Promise<void> {
  for await (const chunk of stream) {
    const chunkText = chunk.text();
    if (chunkText) cb(chunkText);
  }
}

/**
 * Creates a generative model.
 * @param {Object} config - The configuration object.
 * @returns {GenerativeModel} - The generative model.
 */
export function createModel ( config = {
    model: GEMINI_MODEL || "",
} as {
    model: string;
} )
{
    return genAI.getGenerativeModel( config );
}

// to avoid making too many requests to the AI service, we can use a fake long text generator for testing purposes
export function makeLongText ( wordCount: number = 100 ): { text: string; error: false }
{
    const words = Array.from({ length: wordCount }, (_, i) => `word${i + 1}`);
    return {
        text: words.join( ' ' ),
        error: false,
    }
}

// to avoid making too many requests to the AI service, we can use a fake summarizer for testing purposes
export function summarizeTextFake ( text: string, wordCount: number = 30 ): { text: string; error: false }
{
    const words = text.trim().split(/\s+/);
    if (words.length <= wordCount) {
        return { text, error: false };
    }
    return {
        text: words.slice(0, wordCount).join(' ') + '...',
        error: false,
    }
};

export function countWords ( text: string ): number
{
    if ( !text ) return 0;
    return text.trim().split(/\s+/).length;
}

export const sleep = ( time: number ) => new Promise( ( resolve ) => setTimeout( resolve, time ) );

export const parseSocketToken = ( socket: AuthSocket ): undefined | string =>
{
  const cookie = socket.handshake.headers.cookie;
  if ( !cookie ) return;
  const [ cookieKey, token ] = cookie.split( '=' );
  if ( cookieKey !== config.jwt.cookieName || !token ) return;
  return token;
};

export const parseExpressToken = ( req: AuthRequest ): string | undefined =>
{
  return ( req.cookies?.[ config.jwt.cookieName ] || req.headers.authorization?.split( ' ' )[ 1 ] );
}

export function isSocket(context: any): context is AuthSocket {
  return 'handshake' in context;
}

export const parseToken = (context: AuthSocket | AuthRequest): string | undefined => {
  return isSocket(context) ? parseSocketToken(context) : parseExpressToken(context);
};


export const validateAndAttachUser = (context: AuthRequest | AuthSocket) => {
  const token = parseToken(context);
  if ( !token ) throw new AuthError('No token provided');

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as Partial<User>;
    context.user = decoded;
  } catch ( err )
  {
    console.error('JWT verification failed:', error); // possible issues from verifying the token (expired, invalid, etc.)
    throw new AuthError('Invalid token');
  };

  if (!context.user || !context.user.id) {
    throw new AuthError('Invalid user data');
  }
};


