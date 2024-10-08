// src/middleware/AuthMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Extend Express's Request interface to include user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: Role;
      };
    }
  }
}

async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expected format: "Bearer TOKEN"

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    res.status(401).json({ message: "Unauthorized User, no token" });
    return;
  }


  if (!token) {
    res.status(401).json({ message: 'Access token missing.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { userId: number; role: Role };
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
}

/**
 * Middleware to authorize based on user roles.
 */
function authorizeRoles(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
      return;
    }

    next();
  };
}


export { authenticateToken, authorizeRoles };
