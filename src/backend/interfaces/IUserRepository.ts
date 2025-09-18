import { User, CreateUserData, UpdateUserData } from '../entities/User';

export interface IUserRepository {
  // Create
  create(userData: CreateUserData): Promise<User>;
  
  // Read
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(limit?: number, offset?: number): Promise<User[]>;
  findByRole(role: string): Promise<User[]>;
  findByDepartment(department: string): Promise<User[]>;
  
  // Update
  update(id: string, userData: UpdateUserData): Promise<User | null>;
  updateLastLogin(id: string): Promise<void>;
  updatePassword(id: string, hashedPassword: string): Promise<void>;
  verifyEmail(id: string): Promise<void>;
  
  // Delete
  delete(id: string): Promise<boolean>;
  softDelete(id: string): Promise<boolean>;
  
  // Utility
  exists(email: string): Promise<boolean>;
  count(): Promise<number>;
}
