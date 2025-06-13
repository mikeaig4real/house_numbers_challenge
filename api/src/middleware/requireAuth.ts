import { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || !req.user.id) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  next();
}
