import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const COOKIE_NAME = 'snipify_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};

// Signup
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required.' });
    return;
  }
  try {
   
  } catch (e) {
    res.status(500).json({ error: 'Signup failed.' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required.' });
    return;
  }
  try {
  
  } catch (e) {
    res.status(500).json({ error: 'Login failed.' });
  }
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
  res.status(204).end();
});

export default router;
