import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { config } from '../../config';
import { BadRequestError } from "../errors/badRequestError";
import { CustomResponse } from "../responses/customResponse";
import {  User as UserType } from "../../types";

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      throw new BadRequestError('Email already registered.');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });
    const token = jwt.sign({ id: user._id, email: user.email }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
    res.cookie(config.jwt.cookieName, token, config.jwt.cookieOptions);
    CustomResponse.created<Partial<UserType>>(res, { id: user.id, email: user.email });
  } catch ( e )
  {
    console.error('Signup error:', e);
    next(e);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError('Invalid credentials.');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new BadRequestError('Invalid credentials.');
    }
    const token = jwt.sign({ id: user._id, email: user.email }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
    res.cookie(config.jwt.cookieName, token, config.jwt.cookieOptions);
    CustomResponse.success<Partial<UserType>>(res, { id: user.id, email: user.email });
  } catch (e) {
    next(e);
  }
};

export const logout = (req: Request, res: Response): void => {
  const { maxAge, ...CLEAR_COOKIE_OPTIONS } = config.jwt.cookieOptions;
  res.clearCookie(config.jwt.cookieName, CLEAR_COOKIE_OPTIONS);
  res.status(204).end();
};
