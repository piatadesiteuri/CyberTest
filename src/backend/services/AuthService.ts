import { IAuthService } from '../interfaces/IAuthService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { UserRepository } from '../repositories/UserRepository';
import { JwtUtils } from '../utils/JwtUtils';
import { PasswordUtils } from '../utils/PasswordUtils';
import { 
  LoginRequestDTO, 
  RegisterRequestDTO, 
  AuthResponseDTO, 
  RefreshTokenRequestDTO,
  ChangePasswordRequestDTO,
  ForgotPasswordRequestDTO,
  ResetPasswordRequestDTO
} from '../dtos/AuthDTOs';

export class AuthService implements IAuthService {
  private userRepository: IUserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(credentials: LoginRequestDTO): Promise<AuthResponseDTO> {
    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(credentials.email);
      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials',
          error: 'User not found'
        };
      }

      // Verify password
      const isPasswordValid = await PasswordUtils.comparePassword(
        credentials.password, 
        user.password
      );
      
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials',
          error: 'Invalid password'
        };
      }

      // Check if user is active
      if (!user.isActive) {
        return {
          success: false,
          message: 'Account is deactivated',
          error: 'Account deactivated'
        };
      }

      // Update last login
      await this.userRepository.updateLastLogin(user.id);

      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      const accessToken = JwtUtils.generateAccessToken(tokenPayload);
      const refreshToken = JwtUtils.generateRefreshToken(tokenPayload);

      return {
        success: true,
        message: 'Login successful',
        data: {
          token: accessToken,
          refreshToken: refreshToken,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            department: user.department
          }
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed',
        error: 'Internal server error'
      };
    }
  }

  async register(userData: RegisterRequestDTO): Promise<AuthResponseDTO> {
    try {
      // Validate password strength
      const passwordValidation = PasswordUtils.validatePasswordStrength(userData.password);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          message: 'Password does not meet requirements',
          error: passwordValidation.errors.join(', ')
        };
      }

      // Check if user already exists
      const userExists = await this.userRepository.exists(userData.email);
      if (userExists) {
        return {
          success: false,
          message: 'User already exists',
          error: 'Email already registered'
        };
      }

      // Hash password
      const hashedPassword = await PasswordUtils.hashPassword(userData.password);

      // Create user
      const newUser = await this.userRepository.create({
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        department: userData.department,
        role: userData.role
      });

      // Generate tokens
      const tokenPayload = {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role
      };

      const accessToken = JwtUtils.generateAccessToken(tokenPayload);
      const refreshToken = JwtUtils.generateRefreshToken(tokenPayload);

      return {
        success: true,
        message: 'Registration successful',
        data: {
          token: accessToken,
          refreshToken: refreshToken,
          user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role,
            department: newUser.department
          }
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed',
        error: 'Internal server error'
      };
    }
  }

  async logout(userId: string, refreshToken: string): Promise<boolean> {
    // In a real application, you would store refresh tokens in a database
    // and invalidate them here. For now, we'll just return true.
    return true;
  }

  async refreshToken(request: RefreshTokenRequestDTO): Promise<AuthResponseDTO> {
    try {
      const payload = JwtUtils.verifyToken(request.refreshToken);
      
      if (!payload || payload.type !== 'refresh') {
        return {
          success: false,
          message: 'Invalid refresh token',
          error: 'Invalid token'
        };
      }

      const user = await this.userRepository.findById(payload.userId);
      if (!user || !user.isActive) {
        return {
          success: false,
          message: 'User not found or inactive',
          error: 'User not found'
        };
      }

      // Generate new tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      const accessToken = JwtUtils.generateAccessToken(tokenPayload);
      const newRefreshToken = JwtUtils.generateRefreshToken(tokenPayload);

      return {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          token: accessToken,
          refreshToken: newRefreshToken,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            department: user.department
          }
        }
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        message: 'Token refresh failed',
        error: 'Internal server error'
      };
    }
  }

  async validateToken(token: string): Promise<{ valid: boolean; userId?: string; error?: string }> {
    try {
      const payload = JwtUtils.verifyToken(token);
      
      if (!payload || payload.type !== 'access') {
        return { valid: false, error: 'Invalid token' };
      }

      const user = await this.userRepository.findById(payload.userId);
      if (!user || !user.isActive) {
        return { valid: false, error: 'User not found or inactive' };
      }

      return { valid: true, userId: payload.userId };
    } catch (error) {
      return { valid: false, error: 'Token validation failed' };
    }
  }

  async changePassword(userId: string, request: ChangePasswordRequestDTO): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      // Verify current password
      const isCurrentPasswordValid = await PasswordUtils.comparePassword(
        request.currentPassword,
        user.password
      );

      if (!isCurrentPasswordValid) {
        return { success: false, message: 'Current password is incorrect' };
      }

      // Validate new password
      const passwordValidation = PasswordUtils.validatePasswordStrength(request.newPassword);
      if (!passwordValidation.isValid) {
        return { success: false, message: passwordValidation.errors.join(', ') };
      }

      // Hash new password
      const hashedPassword = await PasswordUtils.hashPassword(request.newPassword);
      await this.userRepository.updatePassword(userId, hashedPassword);

      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, message: 'Failed to change password' };
    }
  }

  async forgotPassword(request: ForgotPasswordRequestDTO): Promise<{ success: boolean; message: string }> {
    // In a real application, you would:
    // 1. Generate a reset token
    // 2. Store it in the database with expiration
    // 3. Send an email with the reset link
    // For now, we'll just return a success message
    return { success: true, message: 'Password reset instructions sent to your email' };
  }

  async resetPassword(request: ResetPasswordRequestDTO): Promise<{ success: boolean; message: string }> {
    // In a real application, you would:
    // 1. Validate the reset token
    // 2. Check if it's not expired
    // 3. Update the password
    // For now, we'll just return a success message
    return { success: true, message: 'Password reset successfully' };
  }

  async sendVerificationEmail(userId: string): Promise<{ success: boolean; message: string }> {
    // In a real application, you would:
    // 1. Generate a verification token
    // 2. Store it in the database
    // 3. Send an email with the verification link
    // For now, we'll just return a success message
    return { success: true, message: 'Verification email sent' };
  }

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    // In a real application, you would:
    // 1. Validate the verification token
    // 2. Update the user's email_verified status
    // For now, we'll just return a success message
    return { success: true, message: 'Email verified successfully' };
  }
}
