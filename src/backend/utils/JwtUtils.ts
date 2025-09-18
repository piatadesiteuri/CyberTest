import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../config/database';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
}

export class JwtUtils {
  static generateAccessToken(payload: Omit<JwtPayload, 'type'>): string {
    return jwt.sign(
      { ...payload, type: 'access' },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
  }

  static generateRefreshToken(payload: Omit<JwtPayload, 'type'>): string {
    return jwt.sign(
      { ...payload, type: 'refresh' },
      jwtConfig.secret,
      { expiresIn: jwtConfig.refreshExpiresIn }
    );
  }

  static verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, jwtConfig.secret) as JwtPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}
