import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User } from '../models/User.model';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Token ')) {
      return res.status(401).json({ errors: { body: ['Unauthorized'] } });
    }

    const token = authHeader.substring(6);
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ errors: { body: ['User not found'] } });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ errors: { body: ['Invalid token'] } });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Token ')) {
      const token = authHeader.substring(6);
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);
      if (user) req.user = user;
    }
  } catch (error) {
    // Ignore errors for optional auth
  }
  next();
};
