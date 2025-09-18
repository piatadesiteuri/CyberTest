import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CourseController } from './controllers/CourseController'
import { PhishingController } from './controllers/PhishingController';
import { ProgressController } from './controllers/ProgressController';
import { authenticateToken } from './middleware/AuthMiddleware';
import { jwtConfig } from '../config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// JWT Configuration from config file
const JWT_SECRET = jwtConfig.secret;
const JWT_EXPIRES_IN = jwtConfig.expiresIn;
const JWT_REFRESH_EXPIRES_IN = jwtConfig.refreshExpiresIn;

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'cyber',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

let db: mysql.Connection | null = null;
const courseController = new CourseController();
const phishingController = new PhishingController();
const progressController = new ProgressController();

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
    
    // Generate JWT tokens
    const token = jwt.sign(
      { 
        userId: insertId, 
        email: email, 
        role: role,
        type: 'access'
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    const refreshToken = jwt.sign(
      { 
        userId: insertId, 
        email: email, 
        role: role,
        type: 'refresh'
      },
      JWT_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN as any }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token: token,
        refreshToken: refreshToken,
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

// Login endpoint with database verification
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    
    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const [users] = await db.execute(
      'SELECT id, email, password, first_name, last_name, department, role, is_active, email_verified FROM users WHERE email = ?',
      [email]
    );

    if ((users as any[]).length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = (users as any[])[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await db.execute(
      'UPDATE users SET last_login_at = NOW() WHERE id = ?',
      [user.id]
    );

    // Generate JWT tokens
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        type: 'access'
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    const refreshToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        type: 'refresh'
      },
      JWT_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN as any }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: token,
        refreshToken: refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          department: user.department,
          isActive: user.is_active,
          emailVerified: user.email_verified
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Course routes
app.get('/api/courses', (req, res) => courseController.getCourses(req, res));
app.get('/api/courses/:id', (req, res) => courseController.getCourseById(req, res));

// Phishing simulation routes
app.post('/api/phishing/campaigns', (req, res) => phishingController.createCampaign(req, res));
app.get('/api/phishing/campaigns', (req, res) => phishingController.getCampaigns(req, res));
app.get('/api/phishing/campaigns/:id', (req, res) => phishingController.getCampaignById(req, res));
app.post('/api/phishing/templates', (req, res) => phishingController.createTemplate(req, res));
app.get('/api/phishing/campaigns/:campaignId/templates', (req, res) => phishingController.getTemplatesByCampaign(req, res));
app.post('/api/phishing/send', (req, res) => phishingController.sendPhishingEmail(req, res));
app.post('/api/phishing/track/open', (req, res) => phishingController.trackEmailOpen(req, res));
app.post('/api/phishing/track/click', (req, res) => phishingController.trackLinkClick(req, res));
app.get('/api/phishing/campaigns/:campaignId/report', (req, res) => phishingController.generateReport(req, res));
app.get('/api/phishing/campaigns/:campaignId/results', (req, res) => phishingController.getResultsByCampaign(req, res));

// Progress tracking routes (require authentication)
app.post('/api/progress/lesson/complete', authenticateToken, (req, res) => progressController.markLessonComplete(req, res));
app.post('/api/progress/lesson/unmark', authenticateToken, (req, res) => progressController.unmarkLessonComplete(req, res));
app.get('/api/progress/course/:courseId', authenticateToken, (req, res) => progressController.getCourseProgress(req, res));
app.get('/api/progress/lesson/:lessonId', authenticateToken, (req, res) => progressController.getLessonProgress(req, res));
app.put('/api/progress/lesson/time', authenticateToken, (req, res) => progressController.updateLessonTime(req, res));
app.get('/api/progress/stats', authenticateToken, (req, res) => progressController.getLearningStats(req, res));
app.get('/api/progress/next-lesson/:courseId', authenticateToken, (req, res) => progressController.getNextLesson(req, res));
app.get('/api/progress/course/:courseId/lessons', authenticateToken, (req, res) => progressController.getCourseLessonsProgress(req, res));

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
