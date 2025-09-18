export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export enum UserRole {
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  ADMIN = 'admin',
  IT_SECURITY_ADMIN = 'it_security_admin',
  CISO = 'ciso',
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department: string;
  role: UserRole;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  department?: string;
  role?: UserRole;
  isActive?: boolean;
  emailVerified?: boolean;
}
