export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  department?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  ADMIN = 'admin',
  IT_SECURITY_ADMIN = 'it_security_admin',
  CISO = 'ciso'
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  department?: string
  role?: UserRole
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<AuthResponse>
  register: (userData: RegisterRequest) => Promise<AuthResponse>
  logout: () => void
  refreshToken: () => Promise<void>
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  isAdmin: () => boolean
  isManager: () => boolean
}
