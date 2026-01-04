import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token malformatted' });
  }

  const secret = process.env.JWT_SECRET || 'dinex-secret-key-2026';

  try {
    const decoded = jwt.verify(token, secret);
    // @ts-ignore
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};