import { Request, Response } from 'express';
import { IAuthService } from '../interfaces/IAuthService';
import { AuthService } from '../services/AuthService';
import { LoginRequestDTO, RegisterRequestDTO, RefreshTokenRequestDTO, ChangePasswordRequestDTO, ForgotPasswordRequestDTO, ResetPasswordRequestDTO } from '../dtos/AuthDTOs';

export class AuthController {
  private authService: IAuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: LoginRequestDTO = req.body;
      
      // Basic validation
      if (!credentials.email || !credentials.password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required',
          error: 'Missing required fields'
        });
        return;
      }

      const result = await this.authService.login(credentials);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      console.error('Login controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: 'Login failed'
      });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: RegisterRequestDTO = req.body;
      
      // Basic validation
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName || !userData.department) {
        res.status(400).json({
          success: false,
          message: 'All required fields must be provided',
          error: 'Missing required fields'
        });
        return;
      }

      // Validate password confirmation
      if (userData.confirmPassword && userData.password !== userData.confirmPassword) {
        res.status(400).json({
          success: false,
          message: 'Passwords do not match',
          error: 'Password mismatch'
        });
        return;
      }

      const result = await this.authService.register(userData);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Register controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: 'Registration failed'
      });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const request: RefreshTokenRequestDTO = req.body;
      
      if (!request.refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required',
          error: 'Missing refresh token'
        });
        return;
      }

      const result = await this.authService.refreshToken(request);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      console.error('Refresh token controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: 'Token refresh failed'
      });
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: 'User not authenticated'
        });
        return;
      }

      const request: ChangePasswordRequestDTO = req.body;
      
      if (!request.currentPassword || !request.newPassword || !request.confirmPassword) {
        res.status(400).json({
          success: false,
          message: 'All password fields are required',
          error: 'Missing required fields'
        });
        return;
      }

      if (request.newPassword !== request.confirmPassword) {
        res.status(400).json({
          success: false,
          message: 'New passwords do not match',
          error: 'Password mismatch'
        });
        return;
      }

      const result = await this.authService.changePassword(userId, request);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Change password controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: 'Password change failed'
      });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const request: ForgotPasswordRequestDTO = req.body;
      
      if (!request.email) {
        res.status(400).json({
          success: false,
          message: 'Email is required',
          error: 'Missing email'
        });
        return;
      }

      const result = await this.authService.forgotPassword(request);
      res.status(200).json(result);
    } catch (error) {
      console.error('Forgot password controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: 'Forgot password failed'
      });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const request: ResetPasswordRequestDTO = req.body;
      
      if (!request.token || !request.newPassword || !request.confirmPassword) {
        res.status(400).json({
          success: false,
          message: 'All fields are required',
          error: 'Missing required fields'
        });
        return;
      }

      if (request.newPassword !== request.confirmPassword) {
        res.status(400).json({
          success: false,
          message: 'Passwords do not match',
          error: 'Password mismatch'
        });
        return;
      }

      const result = await this.authService.resetPassword(request);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Reset password controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: 'Password reset failed'
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const refreshToken = req.body.refreshToken;

      if (userId) {
        await this.authService.logout(userId, refreshToken);
      }

      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: 'Logout failed'
      });
    }
  }
}
