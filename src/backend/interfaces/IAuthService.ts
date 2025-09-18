import { LoginRequestDTO, RegisterRequestDTO, AuthResponseDTO, RefreshTokenRequestDTO, ChangePasswordRequestDTO, ForgotPasswordRequestDTO, ResetPasswordRequestDTO } from '../dtos/AuthDTOs';

export interface IAuthService {
  // Authentication
  login(credentials: LoginRequestDTO): Promise<AuthResponseDTO>;
  register(userData: RegisterRequestDTO): Promise<AuthResponseDTO>;
  logout(userId: string, refreshToken: string): Promise<boolean>;
  
  // Token Management
  refreshToken(request: RefreshTokenRequestDTO): Promise<AuthResponseDTO>;
  validateToken(token: string): Promise<{ valid: boolean; userId?: string; error?: string }>;
  
  // Password Management
  changePassword(userId: string, request: ChangePasswordRequestDTO): Promise<{ success: boolean; message: string }>;
  forgotPassword(request: ForgotPasswordRequestDTO): Promise<{ success: boolean; message: string }>;
  resetPassword(request: ResetPasswordRequestDTO): Promise<{ success: boolean; message: string }>;
  
  // Email Verification
  sendVerificationEmail(userId: string): Promise<{ success: boolean; message: string }>;
  verifyEmail(token: string): Promise<{ success: boolean; message: string }>;
}
