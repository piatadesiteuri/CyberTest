import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME || 'cyber',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  };

  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database');

    // Check if admin already exists
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['admin@cybertest.com']
    );

    if ((existingAdmin as any[]).length > 0) {
      console.log('⚠️  Admin user already exists');
      await connection.end();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const [result] = await connection.execute(
      `INSERT INTO users (id, email, password, first_name, last_name, department, role, is_active, email_verified, created_at, updated_at) 
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        'admin@cybertest.com',
        hashedPassword,
        'Admin',
        'User',
        'IT Security',
        'admin',
        true,
        true
      ]
    );

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@cybertest.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');

    await connection.end();
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

createAdmin();
