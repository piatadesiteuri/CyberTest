'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userDashboardService, UserDashboardData, QuizAttempt } from '@/services/userDashboardService';
import { 
  Trophy, 
  Clock, 
  Target, 
  BookOpen, 
  CheckCircle, 
  TrendingUp, 
  Award,
  Calendar,
  BarChart3,
  Star,
  Timer,
  Brain
} from 'lucide-react';

export default function UserPersonalizedDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await userDashboardService.getUserDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number): string => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-2">⚠️ Error</div>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-harmony-dark mb-2">
            Welcome back, {user?.firstName || 'User'}! 👋
          </h1>
          <p className="text-gray-600">
            Here's your personalized cybersecurity training progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold text-harmony-dark">{dashboardData.overallProgress}%</p>
              </div>
              <div className="p-3 bg-harmony-cream/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-harmony-dark" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-harmony-dark h-2 rounded-full transition-all duration-300"
                  style={{ width: `${dashboardData.overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Quizzes</p>
                <p className="text-2xl font-bold text-harmony-dark">{dashboardData.completedQuizzes.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {dashboardData.completedModules}/{dashboardData.totalModules} modules completed
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-harmony-dark">{dashboardData.averageScore}%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Across all completed quizzes
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-harmony-dark">
                  {formatTime(dashboardData.totalTimeSpent)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Total learning time
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-harmony-dark flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Recent Activity
              </h2>
            </div>
            <div className="p-6">
              {dashboardData.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((quiz, index) => (
                    <div key={quiz.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-harmony-cream/20 rounded-full">
                          <Brain className="h-4 w-4 text-harmony-dark" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{quiz.quiz?.title || 'Quiz'}</p>
                          <p className="text-sm text-gray-500">{quiz.quiz?.moduleTitle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreBadgeColor(quiz.score)}`}>
                          {quiz.score}%
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(quiz.completedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent activity</p>
                  <p className="text-sm">Complete some quizzes to see your progress here!</p>
                </div>
              )}
            </div>
          </div>

          {/* Quiz Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-harmony-dark flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Quiz Performance
              </h2>
            </div>
            <div className="p-6">
              {dashboardData.completedQuizzes.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.completedQuizzes.slice(0, 5).map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 truncate">{quiz.quiz?.title || 'Quiz'}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-500">{quiz.quiz?.moduleTitle}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-sm text-gray-500">{formatTime(quiz.timeSpent)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getScoreColor(quiz.score)}`}>
                          {quiz.score}%
                        </span>
                        {quiz.passed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <div className="h-4 w-4 rounded-full bg-red-500"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No quizzes completed yet</p>
                  <p className="text-sm">Start taking quizzes to see your performance!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-harmony-dark flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Achievements
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Achievement cards based on progress */}
              {dashboardData.completedQuizzes.length >= 1 && (
                <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="p-2 bg-green-100 rounded-full mr-3">
                    <Star className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">First Quiz</p>
                    <p className="text-sm text-green-700">Completed your first quiz!</p>
                  </div>
                </div>
              )}

              {dashboardData.completedQuizzes.length >= 5 && (
                <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="p-2 bg-blue-100 rounded-full mr-3">
                    <Trophy className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Quiz Master</p>
                    <p className="text-sm text-blue-700">Completed 5+ quizzes!</p>
                  </div>
                </div>
              )}

              {dashboardData.averageScore >= 90 && (
                <div className="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="p-2 bg-purple-100 rounded-full mr-3">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">High Performer</p>
                    <p className="text-sm text-purple-700">90%+ average score!</p>
                  </div>
                </div>
              )}

              {dashboardData.overallProgress >= 100 && (
                <div className="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="p-2 bg-yellow-100 rounded-full mr-3">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-yellow-900">Course Complete</p>
                    <p className="text-sm text-yellow-700">Finished the entire course!</p>
                  </div>
                </div>
              )}

              {dashboardData.completedQuizzes.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No achievements yet</p>
                  <p className="text-sm">Complete quizzes and lessons to unlock achievements!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
