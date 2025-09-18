import { UserRole } from '../entities/User';

export interface LoginRequestDTO {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequestDTO {
  email: string;
  password: string;
  confirmPassword?: string; // Only for frontend validation
  firstName: string;
  lastName: string;
  department: string;
  role: UserRole;
}

export interface AuthResponseDTO {
  success: boolean;
  message: string;
  data?: {
    token: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      department: string;
    };
  };
  error?: string;
}

export interface RefreshTokenRequestDTO {
  refreshToken: string;
}

export interface ChangePasswordRequestDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequestDTO {
  email: string;
}

export interface ResetPasswordRequestDTO {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
