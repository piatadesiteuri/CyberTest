import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import path from 'path'; // Not needed for backend-only
import { CourseController } from './controllers/CourseController'
import { LearningController } from './controllers/LearningController';
import { PhishingController } from './controllers/PhishingController';
import { PhishingSimulationController } from './controllers/PhishingSimulationController';
import { AdminController } from './controllers/AdminController';
import { ProgressController } from './controllers/ProgressController';
import { authenticateToken } from './middleware/AuthMiddleware';
import { jwtConfig } from '../config/database';

// Load .env file only if it exists (for local development)
try {
  dotenv.config();
} catch (error) {
  console.log('No .env file found, using environment variables');
}

const app = express();
const PORT = parseInt(process.env.PORT || process.env.RAILWAY_PORT || '3001', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

// JWT Configuration from config file
const JWT_SECRET = jwtConfig.secret;
const JWT_EXPIRES_IN = jwtConfig.expiresIn;
const JWT_REFRESH_EXPIRES_IN = jwtConfig.refreshExpiresIn;

// Database connection
const dbConfig = {
  host: NODE_ENV === 'production' ? process.env.DB_HOST : 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: NODE_ENV === 'production' ? process.env.DB_NAME : 'cyber',
  user: NODE_ENV === 'production' ? process.env.DB_USER : 'root',
  password: NODE_ENV === 'production' ? process.env.DB_PASSWORD : '',
};

let db: mysql.Connection | null = null;
const courseController = new CourseController();
const learningController = new LearningController();
const phishingController = new PhishingController();
const phishingSimulationController = new PhishingSimulationController();
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
console.log('🔧 Backend-only mode - frontend served separately');
console.log('🚀 BACKEND EXPRESS SERVER STARTING - NOT NEXT.JS!');
console.log('📁 Current working directory:', process.cwd());
console.log('📝 Script path:', __filename);

app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://localhost:3002',
    'https://cybertest-production.up.railway.app',
    'https://cybertest-frontend-production.up.railway.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
  preflightContinue: false
}));

// DEBUG: Log toate request-urile
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('🔍 REQUEST:', {
    method: req.method,
    url: req.url,
    origin: req.headers.origin,
    userAgent: req.headers['user-agent'],
    contentType: req.headers['content-type'],
    authorization: req.headers.authorization ? 'Present' : 'Missing',
    body: req.method === 'POST' ? req.body : 'N/A',
    timestamp: new Date().toISOString()
  });
  next();
});

app.use(express.json());

// DEBUG: Log specific OPTIONS requests for CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    console.log('🌐 OPTIONS (CORS PREFLIGHT):', {
      url: req.url,
      origin: req.headers.origin,
      method: req.headers['access-control-request-method'],
      headers: req.headers['access-control-request-headers'],
      timestamp: new Date().toISOString()
    });
  }
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  console.log('💚 HEALTH CHECK accessed');
  res.json({
    success: true,
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

// Register endpoint with database
app.post('/api/auth/register', async (req: Request, res: Response) => {
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
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    console.log('🔐 LOGIN REQUEST received:', {
      body: req.body,
      headers: {
        origin: req.headers.origin,
        contentType: req.headers['content-type'],
        userAgent: req.headers['user-agent']
      },
      timestamp: new Date().toISOString()
    });
    
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

    console.log('✅ LOGIN SUCCESS for user:', user.email);
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
    console.error('❌ LOGIN ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req: Request, res: Response) => {
  console.log('🚪 LOGOUT REQUEST received');
  
  // Simply return success - in a stateless JWT system, logout is handled client-side
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

// Progress endpoints
app.get('/api/progress/stats', authenticateToken, async (req: Request, res: Response) => {
  try {
    console.log('📊 PROGRESS STATS requested for user:', (req as any).user?.userId);
    
    // Return mock data for now - implement actual progress logic later
    const mockStats = {
      coursesCompleted: 0,
      lessonsCompleted: 0,
      quizzesCompleted: 0,
      totalTimeSpent: 0,
      averageScore: 0,
      lastActivity: null
    };
    
    res.status(200).json({
      success: true,
      data: mockStats
    });
  } catch (error) {
    console.error('❌ PROGRESS STATS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress stats'
    });
  }
});

app.get('/api/progress/completed-quizzes', authenticateToken, async (req: Request, res: Response) => {
  try {
    console.log('📝 COMPLETED QUIZZES requested for user:', (req as any).user?.userId);
    
    // Return mock data for now - implement actual quiz history logic later
    const mockQuizzes = {
      completedQuizzes: []
    };
    
    res.status(200).json({
      success: true,
      data: mockQuizzes
    });
  } catch (error) {
    console.error('❌ COMPLETED QUIZZES ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch completed quizzes'
    });
  }
});

// Course routes (legacy)
app.get('/api/courses', (req: Request, res: Response) => courseController.getCourses(req, res));
app.get('/api/courses/:id', (req: Request, res: Response) => courseController.getCourseById(req, res));

// Learning routes
app.post('/api/learning/courses', (req: Request, res: Response) => learningController.createCourse(req, res));
app.get('/api/learning/courses/stats', (req: Request, res: Response) => learningController.getCoursesWithStats(req, res));
app.get('/api/learning/courses/published', (req: Request, res: Response) => learningController.getAllPublishedCourses(req, res));
app.get('/api/learning/courses/level/:level', (req: Request, res: Response) => learningController.getCoursesByLevel(req, res));
app.get('/api/learning/courses/:id', (req: Request, res: Response) => learningController.getCourseById(req, res));

// Module routes
app.post('/api/learning/modules', (req: Request, res: Response) => learningController.createModule(req, res));
app.get('/api/learning/courses/:courseId/modules', (req: Request, res: Response) => learningController.getModulesByCourseId(req, res));

// Lesson routes
app.post('/api/learning/lessons', (req: Request, res: Response) => learningController.createLesson(req, res));
app.get('/api/learning/modules/:moduleId/lessons', (req: Request, res: Response) => learningController.getLessonsByModuleId(req, res));

// Quiz routes
app.post('/api/learning/quizzes', (req: Request, res: Response) => learningController.createQuiz(req, res));
app.get('/api/learning/quizzes/:id', (req: Request, res: Response) => learningController.getQuizById(req, res));
app.get('/api/learning/modules/:moduleId/quizzes', (req: Request, res: Response) => learningController.getQuizzesByModuleId(req, res));

// Question routes
app.post('/api/learning/questions', (req: Request, res: Response) => learningController.createQuestion(req, res));
app.get('/api/learning/quizzes/:quizId/questions', (req: Request, res: Response) => learningController.getQuestionsByQuizId(req, res));

// Phishing simulation routes
app.post('/api/phishing/campaigns', (req: Request, res: Response) => phishingController.createCampaign(req, res));
app.get('/api/phishing/campaigns', (req: Request, res: Response) => phishingController.getCampaigns(req, res));
app.get('/api/phishing/campaigns/:id', (req: Request, res: Response) => phishingController.getCampaignById(req, res));
app.post('/api/phishing/templates', (req: Request, res: Response) => phishingController.createTemplate(req, res));
app.get('/api/phishing/campaigns/:campaignId/templates', (req: Request, res: Response) => phishingController.getTemplatesByCampaign(req, res));
app.post('/api/phishing/send', (req: Request, res: Response) => phishingController.sendPhishingEmail(req, res));
app.post('/api/phishing/track/open', (req: Request, res: Response) => phishingController.trackEmailOpen(req, res));
app.post('/api/phishing/track/click', (req: Request, res: Response) => phishingController.trackLinkClick(req, res));
app.get('/api/phishing/campaigns/:campaignId/report', (req: Request, res: Response) => phishingController.generateReport(req, res));
app.get('/api/phishing/campaigns/:campaignId/results', (req: Request, res: Response) => phishingController.getResultsByCampaign(req, res));

// Phishing Simulation routes
app.post('/api/phishing-simulation/start', (req: Request, res: Response) => phishingSimulationController.startSimulation(req, res));
app.put('/api/phishing-simulation/:sessionId', (req: Request, res: Response) => phishingSimulationController.updateSimulation(req, res));
app.get('/api/phishing-simulation/:sessionId', (req: Request, res: Response) => phishingSimulationController.getSimulation(req, res));
app.get('/api/phishing-simulation/campaigns/active', (req: Request, res: Response) => phishingSimulationController.getActiveCampaigns(req, res));
app.get('/api/phishing-simulation/templates/:campaignId', (req: Request, res: Response) => phishingSimulationController.getTemplatesByCampaign(req, res));
app.post('/api/phishing-simulation/:sessionId/track', (req: Request, res: Response) => phishingSimulationController.trackAction(req, res));

// Admin routes (temporarily without auth for testing)
app.get('/api/admin/dashboard/metrics', (req: Request, res: Response) => adminController.getDashboardMetrics(req, res));
app.get('/api/admin/users/groups', (req: Request, res: Response) => adminController.getUserGroups(req, res));
app.get('/api/admin/users/enrollments', (req: Request, res: Response) => adminController.getRecentEnrollments(req, res));
app.get('/api/admin/security/alerts', (req: Request, res: Response) => adminController.getSecurityAlerts(req, res));
app.put('/api/admin/security/alerts/:alertId', (req: Request, res: Response) => adminController.updateAlertStatus(req, res));
app.get('/api/admin/training/programs', (req: Request, res: Response) => adminController.getTrainingPrograms(req, res));
app.post('/api/admin/training/programs', (req: Request, res: Response) => adminController.createTrainingProgram(req, res));
app.put('/api/admin/training/programs/:programId', (req: Request, res: Response) => adminController.updateTrainingProgram(req, res));
app.get('/api/admin/simulations', (req: Request, res: Response) => adminController.getSimulations(req, res));
app.post('/api/admin/simulations/:simulationId/start', (req: Request, res: Response) => adminController.startSimulation(req, res));
app.post('/api/admin/simulations/:simulationId/pause', (req: Request, res: Response) => adminController.pauseSimulation(req, res));
app.put('/api/admin/simulations/:simulationId/configure', (req: Request, res: Response) => adminController.configureSimulation(req, res));
app.get('/api/admin/reports/metrics', (req: Request, res: Response) => adminController.getKeyMetrics(req, res));
app.get('/api/admin/reports', (req: Request, res: Response) => adminController.getReports(req, res));
app.post('/api/admin/reports/generate', (req: Request, res: Response) => adminController.generateReport(req, res));
app.get('/api/admin/reports/:reportId/download', (req: Request, res: Response) => adminController.downloadReport(req, res));
app.get('/api/admin/activity/recent', (req: Request, res: Response) => adminController.getRecentActivity(req, res));
app.get('/api/admin/activity/log', (req: Request, res: Response) => adminController.getActivityLog(req, res));
app.get('/api/admin/system/status', (req: Request, res: Response) => adminController.getSystemStatus(req, res));
app.post('/api/admin/users/groups', (req: Request, res: Response) => adminController.createUserGroup(req, res));
app.post('/api/admin/users/groups/add', (req: Request, res: Response) => adminController.addUserToGroup(req, res));
app.post('/api/admin/users/groups/remove', (req: Request, res: Response) => adminController.removeUserFromGroup(req, res));

// Progress tracking routes (require authentication)
app.post('/api/progress/lesson/complete', authenticateToken, (req: Request, res: Response) => progressController.markLessonComplete(req, res));
app.post('/api/progress/lesson/unmark', authenticateToken, (req: Request, res: Response) => progressController.unmarkLessonComplete(req, res));
app.get('/api/progress/course/:courseId', authenticateToken, (req: Request, res: Response) => progressController.getCourseProgress(req, res));
app.get('/api/progress/lesson/:lessonId', authenticateToken, (req: Request, res: Response) => progressController.getLessonProgress(req, res));
app.put('/api/progress/lesson/time', authenticateToken, (req: Request, res: Response) => progressController.updateLessonTime(req, res));
app.get('/api/progress/stats', authenticateToken, (req: Request, res: Response) => progressController.getLearningStats(req, res));
app.get('/api/progress/next-lesson/:courseId', authenticateToken, (req: Request, res: Response) => progressController.getNextLesson(req, res));
app.get('/api/progress/course/:courseId/lessons', authenticateToken, (req: Request, res: Response) => progressController.getCourseLessonsProgress(req, res));

// Advanced quiz unlock system
app.get('/api/progress/quiz/:quizId/unlock', authenticateToken, (req: Request, res: Response) => progressController.checkQuizUnlock(req, res));
app.get('/api/progress/course/:courseId/quizzes', authenticateToken, (req: Request, res: Response) => progressController.getAvailableQuizzes(req, res));
app.get('/api/progress/module/:moduleId', authenticateToken, (req: Request, res: Response) => progressController.getModuleProgress(req, res));

// User quiz attempts and completed quizzes
app.get('/api/progress/quiz-attempts', authenticateToken, (req: Request, res: Response) => progressController.getUserQuizAttempts(req, res));
app.get('/api/progress/completed-quizzes', authenticateToken, (req: Request, res: Response) => progressController.getUserCompletedQuizzes(req, res));
app.post('/api/progress/quiz-attempt', authenticateToken, (req: Request, res: Response) => progressController.createQuizAttempt(req, res));

// Backend only - no frontend serving

// Start server
const startServer = async () => {
  console.log('🔄 Starting server...');
  console.log('🔧 Environment variables:');
  console.log('  - PORT:', process.env.PORT);
  console.log('  - RAILWAY_PORT:', process.env.RAILWAY_PORT);
  console.log('  - Final PORT:', PORT);
  console.log('  - NODE_ENV:', NODE_ENV);
  console.log('  - DB_HOST:', dbConfig.host);
  console.log('  - DB_NAME:', dbConfig.database);
  console.log('  - JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
  
  await connectDB();
  
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
    console.log(`🗄️  Database: ${db ? 'Connected' : 'Not connected'}`);
    console.log('✅ Server started successfully!');
  });

  // Handle server errors
  server.on('error', (error: any) => {
    console.error('❌ Server error:', error);
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use`);
    }
  });
};

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
