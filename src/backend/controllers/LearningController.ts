import { Request, Response } from 'express';
import { LearningService } from '../services/LearningService';
import { CreateCourseData, UpdateCourseData, CourseLevel } from '../entities/Course';
import { CreateModuleData, UpdateModuleData } from '../entities/Module';
import { CreateLessonData, UpdateLessonData, LessonType } from '../entities/Lesson';
import { CreateQuizData, UpdateQuizData, QuizType } from '../entities/Quiz';
import { CreateQuestionData, UpdateQuestionData, QuestionType } from '../entities/Question';
import { CreateUserProgressData, UpdateUserProgressData, ProgressStatus, CreateQuizAttemptData } from '../entities/UserProgress';

export class LearningController {
  private learningService: LearningService;

  constructor() {
    this.learningService = new LearningService();
  }

  // Course Management
  async createCourse(req: Request, res: Response): Promise<void> {
    try {
      const courseData: CreateCourseData = req.body;
      const course = await this.learningService.createCourse(courseData);
      
      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: { course }
      });
    } catch (error) {
      console.error('Create course error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create course',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getCourseById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const course = await this.learningService.getCourseById(id);
      
      if (!course) {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: { course }
      });
    } catch (error) {
      console.error('Get course error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get course',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getCoursesByLevel(req: Request, res: Response): Promise<void> {
    try {
      const { level } = req.params;
      const courses = await this.learningService.getCoursesByLevel(level as CourseLevel);
      
      res.status(200).json({
        success: true,
        data: { courses }
      });
    } catch (error) {
      console.error('Get courses by level error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get courses',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getAllPublishedCourses(req: Request, res: Response): Promise<void> {
    try {
      const courses = await this.learningService.getAllPublishedCourses();
      
      res.status(200).json({
        success: true,
        data: { courses }
      });
    } catch (error) {
      console.error('Get all courses error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get courses',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Module Management
  async createModule(req: Request, res: Response): Promise<void> {
    try {
      const moduleData: CreateModuleData = req.body;
      const module = await this.learningService.createModule(moduleData);
      
      res.status(201).json({
        success: true,
        message: 'Module created successfully',
        data: { module }
      });
    } catch (error) {
      console.error('Create module error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create module',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getModulesByCourseId(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const modules = await this.learningService.getModulesByCourseId(courseId);
      
      res.status(200).json({
        success: true,
        data: { modules }
      });
    } catch (error) {
      console.error('Get modules error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get modules',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Lesson Management
  async createLesson(req: Request, res: Response): Promise<void> {
    try {
      const lessonData: CreateLessonData = req.body;
      const lesson = await this.learningService.createLesson(lessonData);
      
      res.status(201).json({
        success: true,
        message: 'Lesson created successfully',
        data: { lesson }
      });
    } catch (error) {
      console.error('Create lesson error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create lesson',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getLessonsByModuleId(req: Request, res: Response): Promise<void> {
    try {
      const { moduleId } = req.params;
      const lessons = await this.learningService.getLessonsByModuleId(moduleId);
      
      res.status(200).json({
        success: true,
        data: { lessons }
      });
    } catch (error) {
      console.error('Get lessons error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get lessons',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Quiz Management
  async createQuiz(req: Request, res: Response): Promise<void> {
    try {
      const quizData: CreateQuizData = req.body;
      const quiz = await this.learningService.createQuiz(quizData);
      
      res.status(201).json({
        success: true,
        message: 'Quiz created successfully',
        data: { quiz }
      });
    } catch (error) {
      console.error('Create quiz error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create quiz',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getQuizById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const quiz = await this.learningService.getQuizById(id);
      
      if (!quiz) {
        res.status(404).json({
          success: false,
          message: 'Quiz not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: { quiz }
      });
    } catch (error) {
      console.error('Get quiz error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get quiz',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Question Management
  async createQuestion(req: Request, res: Response): Promise<void> {
    try {
      const questionData: CreateQuestionData = req.body;
      const question = await this.learningService.createQuestion(questionData);
      
      res.status(201).json({
        success: true,
        message: 'Question created successfully',
        data: { question }
      });
    } catch (error) {
      console.error('Create question error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create question',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // User Progress Management
  async createUserProgress(req: Request, res: Response): Promise<void> {
    try {
      const progressData: CreateUserProgressData = req.body;
      const progress = await this.learningService.createUserProgress(progressData);
      
      res.status(201).json({
        success: true,
        message: 'User progress created successfully',
        data: { progress }
      });
    } catch (error) {
      console.error('Create user progress error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create user progress',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getUserProgress(req: Request, res: Response): Promise<void> {
    try {
      const { userId, courseId } = req.params;
      const progress = await this.learningService.getUserProgress(userId, courseId);
      
      res.status(200).json({
        success: true,
        data: { progress }
      });
    } catch (error) {
      console.error('Get user progress error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user progress',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateUserProgress(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateUserProgressData = req.body;
      
      await this.learningService.updateUserProgress(id, updateData);
      
      res.status(200).json({
        success: true,
        message: 'User progress updated successfully'
      });
    } catch (error) {
      console.error('Update user progress error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user progress',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Quiz Attempt Management
  async createQuizAttempt(req: Request, res: Response): Promise<void> {
    try {
      const attemptData: CreateQuizAttemptData = req.body;
      const attempt = await this.learningService.createQuizAttempt(attemptData);
      
      res.status(201).json({
        success: true,
        message: 'Quiz attempt submitted successfully',
        data: { attempt }
      });
    } catch (error) {
      console.error('Create quiz attempt error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit quiz attempt',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Progress Calculation
  async calculateUserProgress(req: Request, res: Response): Promise<void> {
    try {
      const { userId, courseId } = req.params;
      const progress = await this.learningService.calculateUserProgress(userId, courseId);
      
      res.status(200).json({
        success: true,
        data: { progress }
      });
    } catch (error) {
      console.error('Calculate user progress error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate user progress',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Dashboard Data
  async getDashboardData(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      // Get all published courses
      const courses = await this.learningService.getAllPublishedCourses();
      
      // Get user progress for each course
      const coursesWithProgress = await Promise.all(
        courses.map(async (course) => {
          const progress = await this.learningService.getUserProgress(userId, course.id);
          const calculatedProgress = await this.learningService.calculateUserProgress(userId, course.id);
          
          return {
            ...course,
            userProgress: progress,
            calculatedProgress
          };
        })
      );
      
      // Calculate overall progress
      const totalCourses = coursesWithProgress.length;
      const completedCourses = coursesWithProgress.filter(c => 
        c.calculatedProgress.progressPercentage === 100
      ).length;
      const overallProgress = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;
      
      res.status(200).json({
        success: true,
        data: {
          courses: coursesWithProgress,
          overallProgress,
          completedCourses,
          totalCourses
        }
      });
    } catch (error) {
      console.error('Get dashboard data error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get dashboard data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
