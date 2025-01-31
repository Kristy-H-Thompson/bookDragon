import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    const secretKey = process.env.JWT_SECRET_KEY || '';

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      req.user = user as JwtPayload;
      return next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

export const getUserFromToken = (token: string): JwtPayload | null => {
  if (!token) return null;
  try {
      const secretKey = process.env.JWT_SECRET_KEY || '';
      return jwt.verify(token, secretKey) as JwtPayload;
  } catch {
      return null;
  }
};


export const signToken = (userId: string, email: string, username: string): string => {
  console.log('JWT Secret:', process.env.JWT_SECRET_KEY);
  try {
    const payload = { _id: userId, email, username };
    const secretKey = process.env.JWT_SECRET_KEY;
    
    // Make sure the secret key exists
    if (!secretKey) {
      throw new Error('JWT_SECRET_KEY is not defined in environment variables.');
    }

    // Sign the token with the payload and secret key
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
  } catch (error) {
    console.error('Error signing token:', error);
    throw new Error('Failed to sign token');
  }
};