import { authService } from './auth/authService';

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: Record<string, any>;
  score: number;
  passed: boolean;
  timeSpent: number;
  attemptNumber: number;
  completedAt: string;
  createdAt: string;
  quiz?: {
    id: string;
    title: string;
    description: string;
    type: string;
    moduleTitle: string;
    courseTitle: string;
    passingScore: number;
    timeLimit: number;
  };
}

export interface UserDashboardData {
  overallProgress: number;
  completedLessons: number;
  totalLessons: number;
  completedModules: number;
  totalModules: number;
  completedQuizzes: QuizAttempt[];
  recentActivity: any[];
  totalTimeSpent: number;
  averageScore: number;
  lastActivity: string | null;
}

class UserDashboardService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  async getUserDashboardData(): Promise<UserDashboardData> {
    try {
      const token = authService.getAccessToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch all dashboard data in parallel
      const [progressResponse, completedQuizzesResponse] = await Promise.all([
        fetch(`${this.baseUrl}/api/progress/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${this.baseUrl}/api/progress/completed-quizzes`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!progressResponse.ok || !completedQuizzesResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const progressData = await progressResponse.json();
      const completedQuizzesData = await completedQuizzesResponse.json();

      // Calculate additional statistics
      const completedQuizzes = completedQuizzesData.completedQuizzes || [];
      const totalTimeSpent = completedQuizzes.reduce((total: number, quiz: QuizAttempt) => total + quiz.timeSpent, 0);
      const averageScore = completedQuizzes.length > 0 
        ? completedQuizzes.reduce((total: number, quiz: QuizAttempt) => total + quiz.score, 0) / completedQuizzes.length 
        : 0;

      // Get recent activity (last 5 completed quizzes)
      const recentActivity = completedQuizzes
        .sort((a: QuizAttempt, b: QuizAttempt) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
        .slice(0, 5);

      const lastActivity = recentActivity.length > 0 ? recentActivity[0].completedAt : null;

      return {
        overallProgress: progressData.data?.completedCourses > 0 ? 100 : 0, // Simplified for now
        completedLessons: progressData.data?.completedLessons || 0,
        totalLessons: progressData.data?.completedLessons || 0, // Will be updated when we have total lessons
        completedModules: progressData.data?.completedCourses || 0,
        totalModules: progressData.data?.completedCourses || 0, // Will be updated when we have total modules
        completedQuizzes,
        recentActivity,
        totalTimeSpent: progressData.data?.totalTimeSpent || 0,
        averageScore: progressData.data?.averageQuizScore || 0,
        lastActivity
      };
    } catch (error) {
      console.error('Error fetching user dashboard data:', error);
      throw error;
    }
  }

  async getQuizAttempts(): Promise<QuizAttempt[]> {
    try {
      const token = authService.getAccessToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/api/progress/quiz-attempts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quiz attempts');
      }

      const data = await response.json();
      return data.attempts || [];
    } catch (error) {
      console.error('Error fetching quiz attempts:', error);
      throw error;
    }
  }

  async getCompletedQuizzes(): Promise<QuizAttempt[]> {
    try {
      const token = authService.getAccessToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/api/progress/completed-quizzes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch completed quizzes');
      }

      const data = await response.json();
      return data.completedQuizzes || [];
    } catch (error) {
      console.error('Error fetching completed quizzes:', error);
      throw error;
    }
  }
}

export const userDashboardService = new UserDashboardService();
