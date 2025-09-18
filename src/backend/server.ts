import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { serverConfig } from '../config/database';
import DatabaseConnection from './utils/DatabaseConnection';
import { AuthController } from './controllers/AuthController';
import { authenticateToken } from './middleware/AuthMiddleware';

// Load environment variables
dotenv.config();

const app = express();
const authController = new AuthController();

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
