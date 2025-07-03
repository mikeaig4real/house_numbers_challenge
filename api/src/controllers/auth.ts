import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { config } from '../../config';

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required.' });
    return;
  }
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ error: 'Email already registered.' });
      return;
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });
    const token = jwt.sign({ id: user._id, email: user.email }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
    res.cookie(config.jwt.cookieName, token, config.jwt.cookieOptions);
    res.status(201).json({ id: user._id, email: user.email });
  } catch (e) {
    res.status(500).json({ error: 'Signup failed.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required.' });
    return;
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'Invalid credentials.' });
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(400).json({ error: 'Invalid credentials.' });
      return;
    }
    const token = jwt.sign({ id: user._id, email: user.email }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
    res.cookie(config.jwt.cookieName, token, config.jwt.cookieOptions);
    res.status(200).json({ id: user._id, email: user.email });
  } catch (e) {
    res.status(500).json({ error: 'Login failed.' });
  }
};

export const logout = (req: Request, res: Response) => {
  const { maxAge, ...CLEAR_COOKIE_OPTIONS } = config.jwt.cookieOptions;
  res.clearCookie(config.jwt.cookieName, CLEAR_COOKIE_OPTIONS);
  res.status(204).end();
};
