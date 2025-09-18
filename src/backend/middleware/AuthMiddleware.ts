import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '../utils/JwtUtils';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = JwtUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required',
        error: 'No token provided'
      });
      return;
    }

    const payload = JwtUtils.verifyToken(token);
    
    if (!payload || payload.type !== 'access') {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: 'Invalid token'
      });
      return;
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Token validation failed',
      error: 'Invalid token'
    });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'User not authenticated'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        error: 'Access denied'
      });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(['admin', 'it_security_admin', 'ciso']);
export const requireManager = requireRole(['manager', 'admin', 'it_security_admin', 'ciso']);
export const requireEmployee = requireRole(['employee', 'manager', 'admin', 'it_security_admin', 'ciso']);
