import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'cyber',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

let db: mysql.Connection | null = null;

// Connect to database
const connectDB = async () => {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
};

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

// Register endpoint with database
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    
    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const { email, password, firstName, lastName, department, role = 'employee' } = req.body;

    // Check if user already exists
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if ((existingUsers as any[]).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user into database
    const [result] = await db.execute(
      'INSERT INTO users (id, email, password, first_name, last_name, department, role, is_active, email_verified, created_at, updated_at) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [email, hashedPassword, firstName, lastName, department, role, true, false]
    );

    const insertId = (result as any).insertId;
    
    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token: 'real-token', // In a real app, generate JWT here
        refreshToken: 'real-refresh-token',
        user: {
          id: insertId,
          email: email,
          firstName: firstName,
          lastName: lastName,
          role: role,
          department: department
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// Simple login endpoint for testing
app.post('/api/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  res.status(200).json({
    success: true,
    message: 'Login successful (mock)',
    data: {
      token: 'mock-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: 'mock-id',
        email: req.body.email,
        firstName: 'Test',
        lastName: 'User',
        role: 'employee',
        department: 'IT'
      }
    }
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🗄️  Database: ${db ? 'Connected' : 'Not connected'}`);
  });
};

startServer();
