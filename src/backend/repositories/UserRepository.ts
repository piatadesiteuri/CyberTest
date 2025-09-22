import { IUserRepository } from '../interfaces/IUserRepository';
import { User, CreateUserData, UpdateUserData, UserRole } from '../entities/User';
import DatabaseConnection from '../utils/DatabaseConnection';

export class UserRepository implements IUserRepository {
  private db = DatabaseConnection.getInstance().getPool();

  async create(userData: CreateUserData): Promise<User> {
    const query = `
      INSERT INTO users (id, email, password, first_name, last_name, department, role, is_active, email_verified, created_at, updated_at)
      VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const [result] = await this.db.execute(query, [
      userData.email,
      userData.password,
      userData.firstName,
      userData.lastName,
      userData.department,
      userData.role,
      true,
      false
    ]);

    const insertId = (result as any).insertId;
    const newUser = await this.findById(insertId);
    if (!newUser) {
      throw new Error('Failed to create user');
    }
    return newUser;
  }

  async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = ? AND is_active = true';
    const [rows] = await this.db.execute(query, [id]);
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = ? AND is_active = true';
    const [rows] = await this.db.execute(query, [email]);
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  }

  async findAll(limit: number = 50, offset: number = 0): Promise<User[]> {
    const query = 'SELECT * FROM users WHERE is_active = true ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const [rows] = await this.db.execute(query, [limit, offset]);
    return rows as User[];
  }

  async findByRole(role: string): Promise<User[]> {
    const query = 'SELECT * FROM users WHERE role = ? AND is_active = true ORDER BY created_at DESC';
    const [rows] = await this.db.execute(query, [role]);
    return rows as User[];
  }

  async findByDepartment(department: string): Promise<User[]> {
    const query = 'SELECT * FROM users WHERE department = ? AND is_active = true ORDER BY created_at DESC';
    const [rows] = await this.db.execute(query, [department]);
    return rows as User[];
  }

  async update(id: string, userData: UpdateUserData): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (userData.firstName !== undefined) {
      fields.push('first_name = ?');
      values.push(userData.firstName);
    }
    if (userData.lastName !== undefined) {
      fields.push('last_name = ?');
      values.push(userData.lastName);
    }
    if (userData.department !== undefined) {
      fields.push('department = ?');
      values.push(userData.department);
    }
    if (userData.role !== undefined) {
      fields.push('role = ?');
      values.push(userData.role);
    }
    if (userData.isActive !== undefined) {
      fields.push('is_active = ?');
      values.push(userData.isActive);
    }
    if (userData.emailVerified !== undefined) {
      fields.push('email_verified = ?');
      values.push(userData.emailVerified);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push('updated_at = NOW()');
    values.push(id);

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await this.db.execute(query, values);

    return this.findById(id);
  }

  async updateLastLogin(id: string): Promise<void> {
    const query = 'UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = ?';
    await this.db.execute(query, [id]);
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    const query = 'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?';
    await this.db.execute(query, [hashedPassword, id]);
  }

  async verifyEmail(id: string): Promise<void> {
    const query = 'UPDATE users SET email_verified = true, updated_at = NOW() WHERE id = ?';
    await this.db.execute(query, [id]);
  }

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await this.db.execute(query, [id]);
    return (result as any).affectedRows > 0;
  }

  async softDelete(id: string): Promise<boolean> {
    const query = 'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = ?';
    const [result] = await this.db.execute(query, [id]);
    return (result as any).affectedRows > 0;
  }

  async exists(email: string): Promise<boolean> {
    const query = 'SELECT 1 FROM users WHERE email = ? LIMIT 1';
    const [rows] = await this.db.execute(query, [email]);
    return (rows as any).length > 0;
  }

  async count(): Promise<number> {
    const query = 'SELECT COUNT(*) as count FROM users WHERE is_active = true';
    const [rows] = await this.db.execute(query);
    return (rows as any)[0].count;
  }
}
