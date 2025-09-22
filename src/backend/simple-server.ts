import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CourseController } from './controllers/CourseController'
import { PhishingController } from './controllers/PhishingController';
import { AdminController } from './controllers/AdminController';
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
const adminController = new AdminController();
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
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Handle preflight requests - use middleware instead of specific route
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
  } else {
    next();
  }
});

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

// Admin routes (temporarily without auth for testing)
app.get('/api/admin/dashboard/metrics', (req, res) => adminController.getDashboardMetrics(req, res));
app.get('/api/admin/users/groups', (req, res) => adminController.getUserGroups(req, res));
app.get('/api/admin/users/enrollments', (req, res) => adminController.getRecentEnrollments(req, res));
app.get('/api/admin/security/alerts', (req, res) => adminController.getSecurityAlerts(req, res));
app.put('/api/admin/security/alerts/:alertId', (req, res) => adminController.updateAlertStatus(req, res));
app.get('/api/admin/training/programs', (req, res) => adminController.getTrainingPrograms(req, res));
app.post('/api/admin/training/programs', (req, res) => adminController.createTrainingProgram(req, res));
app.put('/api/admin/training/programs/:programId', (req, res) => adminController.updateTrainingProgram(req, res));
app.get('/api/admin/simulations', (req, res) => adminController.getSimulations(req, res));
app.post('/api/admin/simulations/:simulationId/start', (req, res) => adminController.startSimulation(req, res));
app.post('/api/admin/simulations/:simulationId/pause', (req, res) => adminController.pauseSimulation(req, res));
app.put('/api/admin/simulations/:simulationId/configure', (req, res) => adminController.configureSimulation(req, res));
app.get('/api/admin/reports/metrics', (req, res) => adminController.getKeyMetrics(req, res));
app.get('/api/admin/reports', (req, res) => adminController.getReports(req, res));
app.post('/api/admin/reports/generate', (req, res) => adminController.generateReport(req, res));
app.get('/api/admin/reports/:reportId/download', (req, res) => adminController.downloadReport(req, res));
app.get('/api/admin/activity/recent', (req, res) => adminController.getRecentActivity(req, res));
app.get('/api/admin/activity/log', (req, res) => adminController.getActivityLog(req, res));
app.get('/api/admin/system/status', (req, res) => adminController.getSystemStatus(req, res));
app.post('/api/admin/users/groups', (req, res) => adminController.createUserGroup(req, res));
app.post('/api/admin/users/groups/add', (req, res) => adminController.addUserToGroup(req, res));
app.post('/api/admin/users/groups/remove', (req, res) => adminController.removeUserFromGroup(req, res));

// Progress tracking routes (require authentication)
app.post('/api/progress/lesson/complete', authenticateToken, (req, res) => progressController.markLessonComplete(req, res));
app.post('/api/progress/lesson/unmark', authenticateToken, (req, res) => progressController.unmarkLessonComplete(req, res));
app.get('/api/progress/course/:courseId', authenticateToken, (req, res) => progressController.getCourseProgress(req, res));
app.get('/api/progress/lesson/:lessonId', authenticateToken, (req, res) => progressController.getLessonProgress(req, res));
app.put('/api/progress/lesson/time', authenticateToken, (req, res) => progressController.updateLessonTime(req, res));
app.get('/api/progress/stats', authenticateToken, (req, res) => progressController.getLearningStats(req, res));
app.get('/api/progress/next-lesson/:courseId', authenticateToken, (req, res) => progressController.getNextLesson(req, res));
app.get('/api/progress/course/:courseId/lessons', authenticateToken, (req, res) => progressController.getCourseLessonsProgress(req, res));

// Advanced quiz unlock system
app.get('/api/progress/quiz/:quizId/unlock', authenticateToken, (req, res) => progressController.checkQuizUnlock(req, res));
app.get('/api/progress/course/:courseId/quizzes', authenticateToken, (req, res) => progressController.getAvailableQuizzes(req, res));
app.get('/api/progress/module/:moduleId', authenticateToken, (req, res) => progressController.getModuleProgress(req, res));

// User quiz attempts and completed quizzes
app.get('/api/progress/quiz-attempts', authenticateToken, (req, res) => progressController.getUserQuizAttempts(req, res));
app.get('/api/progress/completed-quizzes', authenticateToken, (req, res) => progressController.getUserCompletedQuizzes(req, res));
app.post('/api/progress/quiz-attempt', authenticateToken, (req, res) => progressController.createQuizAttempt(req, res));

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
