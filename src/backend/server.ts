import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { serverConfig } from '../config/database';
import DatabaseConnection from './utils/DatabaseConnection';
import { AuthController } from './controllers/AuthController';
import { AdminController } from './controllers/AdminController';
import { CourseController } from './controllers/CourseController';
import { LearningController } from './controllers/LearningController';
import { PhishingController } from './controllers/PhishingController';
import { authenticateToken } from './middleware/AuthMiddleware';

// Load environment variables
dotenv.config();

const app = express();
const authController = new AuthController();
const adminController = new AdminController();
const courseController = new CourseController();
const learningController = new LearningController();
const phishingController = new PhishingController();

// Middleware
app.use(cors({
  origin: serverConfig.corsOrigin,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Auth routes
app.post('/api/auth/login', (req, res) => authController.login(req, res));
app.post('/api/auth/register', (req, res) => authController.register(req, res));
app.post('/api/auth/refresh', (req, res) => authController.refreshToken(req, res));
app.post('/api/auth/logout', authenticateToken, (req, res) => authController.logout(req, res));
app.post('/api/auth/change-password', authenticateToken, (req, res) => authController.changePassword(req, res));
app.post('/api/auth/forgot-password', (req, res) => authController.forgotPassword(req, res));
app.post('/api/auth/reset-password', (req, res) => authController.resetPassword(req, res));

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

// Course routes (protected)
app.get('/api/courses', (req, res) => courseController.getCourses(req, res));
app.get('/api/courses/:id', (req, res) => courseController.getCourseById(req, res));

// Learning routes (protected)
app.post('/api/learning/courses', authenticateToken, (req, res) => learningController.createCourse(req, res));
app.get('/api/learning/courses/:id', authenticateToken, (req, res) => learningController.getCourseById(req, res));
app.get('/api/learning/courses/level/:level', authenticateToken, (req, res) => learningController.getCoursesByLevel(req, res));
app.get('/api/learning/courses/published', authenticateToken, (req, res) => learningController.getAllPublishedCourses(req, res));
app.post('/api/learning/modules', authenticateToken, (req, res) => learningController.createModule(req, res));
app.get('/api/learning/modules/course/:courseId', authenticateToken, (req, res) => learningController.getModulesByCourseId(req, res));
app.post('/api/learning/lessons', authenticateToken, (req, res) => learningController.createLesson(req, res));
app.get('/api/learning/lessons/module/:moduleId', authenticateToken, (req, res) => learningController.getLessonsByModuleId(req, res));
app.post('/api/learning/quizzes', authenticateToken, (req, res) => learningController.createQuiz(req, res));
app.get('/api/learning/quizzes/:id', authenticateToken, (req, res) => learningController.getQuizById(req, res));
app.post('/api/learning/questions', authenticateToken, (req, res) => learningController.createQuestion(req, res));
app.post('/api/learning/progress', authenticateToken, (req, res) => learningController.createUserProgress(req, res));
app.get('/api/learning/progress/:userId/:courseId', authenticateToken, (req, res) => learningController.getUserProgress(req, res));
app.put('/api/learning/progress/:id', authenticateToken, (req, res) => learningController.updateUserProgress(req, res));
app.post('/api/learning/quiz-attempts', authenticateToken, (req, res) => learningController.createQuizAttempt(req, res));
app.get('/api/learning/progress/calculate/:userId/:courseId', authenticateToken, (req, res) => learningController.calculateUserProgress(req, res));
app.get('/api/learning/dashboard/:userId', authenticateToken, (req, res) => learningController.getDashboardData(req, res));

// Phishing routes (protected)
app.post('/api/phishing/campaigns', authenticateToken, (req, res) => phishingController.createCampaign(req, res));
app.get('/api/phishing/campaigns', authenticateToken, (req, res) => phishingController.getCampaigns(req, res));
app.get('/api/phishing/campaigns/:id', authenticateToken, (req, res) => phishingController.getCampaignById(req, res));
app.post('/api/phishing/templates', authenticateToken, (req, res) => phishingController.createTemplate(req, res));
app.get('/api/phishing/templates/campaign/:campaignId', authenticateToken, (req, res) => phishingController.getTemplatesByCampaign(req, res));
app.post('/api/phishing/send-email', authenticateToken, (req, res) => phishingController.sendPhishingEmail(req, res));
app.post('/api/phishing/track/open', (req, res) => phishingController.trackEmailOpen(req, res));
app.post('/api/phishing/track/click', (req, res) => phishingController.trackLinkClick(req, res));
app.get('/api/phishing/reports/:campaignId', authenticateToken, (req, res) => phishingController.generateReport(req, res));
app.get('/api/phishing/results/:campaignId', authenticateToken, (req, res) => phishingController.getResultsByCampaign(req, res));

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'This is a protected route',
    user: (req as any).user
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: serverConfig.nodeEnv === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: 'The requested endpoint does not exist'
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnection = DatabaseConnection.getInstance();
    const isConnected = await dbConnection.testConnection();
    
    if (!isConnected) {
      console.error('❌ Failed to connect to database. Server will not start.');
      process.exit(1);
    }

    // Start the server
    app.listen(serverConfig.port, () => {
      console.log(`🚀 Server running on port ${serverConfig.port}`);
      console.log(`🌍 Environment: ${serverConfig.nodeEnv}`);
      console.log(`🔗 CORS enabled for: ${serverConfig.corsOrigin}`);
      console.log(`📊 Health check: http://localhost:${serverConfig.port}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  const dbConnection = DatabaseConnection.getInstance();
  await dbConnection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  const dbConnection = DatabaseConnection.getInstance();
  await dbConnection.close();
  process.exit(0);
});

startServer();
