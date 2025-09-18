import { Request, Response } from 'express';
import { ProgressService } from '../services/ProgressService';
import { AuthenticatedRequest } from '../middleware/AuthMiddleware';

export class ProgressController {
  private progressService: ProgressService;

  constructor() {
    this.progressService = new ProgressService();
  }

  // Mark lesson as completed
  async markLessonComplete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { lessonId, courseId, moduleId, timeSpent } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' });
        return;
      }

      if (!lessonId) {
        res.status(400).json({ success: false, message: 'Lesson ID is required' });
        return;
      }

      // Mark lesson as completed
      const progress = await this.progressService.markLessonComplete(
        userId,
        lessonId,
        courseId || '',
        moduleId || '',
        timeSpent || 0
      );

      res.json({ 
        success: true, 
        message: 'Lesson marked as completed',
        data: { lessonId, completed: true }
      });
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to mark lesson as completed' 
      });
    }
  }

  // Unmark lesson as completed
  async unmarkLessonComplete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { lessonId } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' });
        return;
      }

      if (!lessonId) {
        res.status(400).json({ success: false, message: 'Lesson ID is required' });
        return;
      }

      // Unmark lesson as completed
      const success = await this.progressService.unmarkLessonComplete(userId, lessonId);

      if (success) {
        res.json({ 
          success: true, 
          message: 'Lesson unmarked successfully',
          data: { lessonId, completed: false }
        });
      } else {
        res.status(404).json({ 
          success: false, 
          message: 'Lesson progress not found' 
        });
      }
    } catch (error) {
      console.error('Error unmarking lesson:', error);
      res.status(500).json({ success: false, message: 'Failed to unmark lesson' });
    }
  }

  // Get user progress for a course
  async getCourseProgress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' });
        return;
      }

      const progress = await this.progressService.getUserCourseProgress(userId, courseId);
      
      res.json({ 
        success: true, 
        data: progress 
      });
    } catch (error) {
      console.error('Error getting course progress:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get course progress' 
      });
    }
  }

  // Get user progress for a specific lesson
  async getLessonProgress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { lessonId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' });
        return;
      }

      const progress = await this.progressService.getUserProgress(userId, undefined, undefined, lessonId);
      
      res.json({ 
        success: true, 
        data: progress[0] || null 
      });
    } catch (error) {
      console.error('Error getting lesson progress:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get lesson progress' 
      });
    }
  }

  // Update lesson time spent
  async updateLessonTime(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { lessonId, timeSpent } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' });
        return;
      }

      if (!lessonId || timeSpent === undefined) {
        res.status(400).json({ success: false, message: 'Lesson ID and time spent are required' });
        return;
      }

      // Check if progress exists
      const existingProgress = await this.progressService.getUserProgress(userId, undefined, undefined, lessonId);

      if (existingProgress.length > 0) {
        // Update existing progress
        await this.progressService.updateUserProgress(existingProgress[0].id, {
          timeSpent,
          status: existingProgress[0].status === 'completed' ? 'completed' : 'in_progress'
        });
      } else {
        // Create new progress
        await this.progressService.createUserProgress({
          userId,
          lessonId,
          status: 'in_progress',
          timeSpent
        });
      }

      res.json({ 
        success: true, 
        message: 'Lesson time updated',
        data: { lessonId, timeSpent }
      });
    } catch (error) {
      console.error('Error updating lesson time:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update lesson time' 
      });
    }
  }

  // Get user learning statistics
  async getLearningStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' });
        return;
      }

      const stats = await this.progressService.getUserLearningStats(userId);
      
      res.json({ 
        success: true, 
        data: stats 
      });
    } catch (error) {
      console.error('Error getting learning stats:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get learning statistics' 
      });
    }
  }

  // Get next incomplete lesson for resume functionality
  async getNextLesson(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' });
        return;
      }

      const nextLesson = await this.progressService.getNextIncompleteLesson(userId, courseId);
      
      res.json({ 
        success: true, 
        data: nextLesson 
      });
    } catch (error) {
      console.error('Error getting next lesson:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get next lesson' 
      });
    }
  }

  // Get all lessons progress for a course
  async getCourseLessonsProgress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' });
        return;
      }

      if (!courseId) {
        res.status(400).json({ success: false, message: 'Course ID is required' });
        return;
      }

      // Get all completed lessons for this course
      const completedLessons = await this.progressService.getUserProgress(userId, courseId);
      console.log('🔍 Completed lessons for course:', completedLessons);
      
      // Create a map of lesson IDs to their progress status
      const lessonProgressMap = completedLessons.reduce((acc, progress) => {
        if (progress.lessonId) {
          acc[progress.lessonId] = {
            status: progress.status,
            completedAt: progress.completedAt,
            timeSpent: progress.timeSpent
          };
        }
        return acc;
      }, {} as Record<string, any>);
      
      console.log('📚 Lesson progress map:', lessonProgressMap);

      res.json({ 
        success: true, 
        data: lessonProgressMap 
      });
    } catch (error) {
      console.error('Error getting course lessons progress:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get course lessons progress' 
      });
    }
  }
}
