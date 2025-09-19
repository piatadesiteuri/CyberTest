import { authService } from './auth/authService';

const API_BASE_URL = 'http://localhost:3001/api';

class ProgressService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = authService.getAccessToken();
    console.log('🔑 Token from authService:', token);
    
    if (!token) {
      throw new Error('No access token available. Please login again.');
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Mark lesson as completed
  async markLessonComplete(lessonId: string, courseId: string, moduleId: string, timeSpent: number = 0) {
    return this.makeRequest('/progress/lesson/complete', {
      method: 'POST',
      body: JSON.stringify({
        lessonId,
        courseId,
        moduleId,
        timeSpent
      }),
    });
  }

  // Unmark lesson as completed
  async unmarkLessonComplete(lessonId: string) {
    return this.makeRequest('/progress/lesson/unmark', {
      method: 'POST',
      body: JSON.stringify({
        lessonId
      }),
    });
  }

  // Get course progress
  async getCourseProgress(courseId: string) {
    return this.makeRequest(`/progress/course/${courseId}`);
  }

  // Get lesson progress
  async getLessonProgress(lessonId: string) {
    return this.makeRequest(`/progress/lesson/${lessonId}`);
  }

  // Get all lessons progress for a course
  async getCourseLessonsProgress(courseId: string) {
    return this.makeRequest(`/progress/course/${courseId}/lessons`);
  }

  // Update lesson time spent
  async updateLessonTime(lessonId: string, timeSpent: number) {
    return this.makeRequest('/progress/lesson/time', {
      method: 'PUT',
      body: JSON.stringify({
        lessonId,
        timeSpent
      }),
    });
  }

  // Get learning statistics
  async getLearningStats() {
    return this.makeRequest('/progress/stats');
  }

  // Get next incomplete lesson
  async getNextLesson(courseId: string) {
    return this.makeRequest(`/progress/next-lesson/${courseId}`);
  }
}

export const progressService = new ProgressService();
