import { query } from '../utils/DatabaseConnection';
import { v4 as uuidv4 } from 'uuid';

export interface UserProgress {
  id: string;
  userId: string;
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  quizId?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  progressPercentage: number;
  timeSpent: number;
  score?: number;
  completedAt?: Date;
  startedAt: Date;
  updatedAt: Date;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: { [questionId: string]: string | string[] };
  score: number;
  passed: boolean;
  timeSpent: number;
  attemptNumber: number;
  completedAt: Date;
  createdAt: Date;
}

export interface CreateUserProgressData {
  userId: string;
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  quizId?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  progressPercentage?: number;
  timeSpent?: number;
  score?: number;
}

export interface UpdateUserProgressData {
  status?: 'not_started' | 'in_progress' | 'completed' | 'failed';
  progressPercentage?: number;
  timeSpent?: number;
  score?: number;
  completedAt?: Date;
}

export interface CreateQuizAttemptData {
  userId: string;
  quizId: string;
  answers: { [questionId: string]: string | string[] };
  score: number;
  passed: boolean;
  timeSpent: number;
}

export class ProgressService {
  // User Progress Management
  async createUserProgress(data: CreateUserProgressData): Promise<UserProgress> {
    const id = uuidv4();
    const now = new Date();
    
    await query(
      `INSERT INTO user_progress (id, user_id, course_id, module_id, lesson_id, quiz_id, status, progress_percentage, time_spent, score, started_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.userId,
        data.courseId || null,
        data.moduleId || null,
        data.lessonId || null,
        data.quizId || null,
        data.status,
        data.progressPercentage || 0,
        data.timeSpent || 0,
        data.score || null,
        now,
        now
      ]
    );

    return {
      id,
      userId: data.userId,
      courseId: data.courseId,
      moduleId: data.moduleId,
      lessonId: data.lessonId,
      quizId: data.quizId,
      status: data.status,
      progressPercentage: data.progressPercentage || 0,
      timeSpent: data.timeSpent || 0,
      score: data.score,
      startedAt: now,
      updatedAt: now
    };
  }

  async updateUserProgress(id: string, data: UpdateUserProgressData): Promise<UserProgress | null> {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    
    if (fields.length === 0) return this.getUserProgressById(id);

    await query(
      `UPDATE user_progress SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );

    return this.getUserProgressById(id);
  }

  async getUserProgressById(id: string): Promise<UserProgress | null> {
    const [rows] = await query<UserProgress[]>(
      `SELECT * FROM user_progress WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  async getUserProgress(userId: string, courseId?: string, moduleId?: string, lessonId?: string): Promise<UserProgress[]> {
    let sql = `SELECT * FROM user_progress WHERE user_id = ?`;
    const params: any[] = [userId];

    if (courseId) {
      sql += ` AND course_id = ?`;
      params.push(courseId);
    }
    if (moduleId) {
      sql += ` AND module_id = ?`;
      params.push(moduleId);
    }
    if (lessonId) {
      sql += ` AND lesson_id = ?`;
      params.push(lessonId);
    }

    sql += ` ORDER BY updated_at DESC`;

    const [rows] = await query<UserProgress[]>(sql, params);
    return rows;
  }

  async getUserCourseProgress(userId: string, courseId: string): Promise<{
    overallProgress: number;
    completedLessons: number;
    totalLessons: number;
    completedModules: number;
    totalModules: number;
    lastActivity: Date | null;
  }> {
    // Get all lessons in the course
    const [lessonRows] = await query<{id: string, module_id: string}[]>(
      `SELECT l.id, l.module_id 
       FROM lessons l 
       JOIN modules m ON l.module_id = m.id 
       WHERE m.course_id = ?`,
      [courseId]
    );

    // Get all modules in the course
    const [moduleRows] = await query<{id: string}[]>(
      `SELECT id FROM modules WHERE course_id = ?`,
      [courseId]
    );

    // Get user progress for this course
    const [progressRows] = await query<UserProgress[]>(
      `SELECT * FROM user_progress 
       WHERE user_id = ? AND course_id = ?`,
      [userId, courseId]
    );

    const totalLessons = lessonRows.length;
    const totalModules = moduleRows.length;
    
    const completedLessons = progressRows.filter(p => 
      p.lessonId && p.status === 'completed'
    ).length;
    
    const completedModules = progressRows.filter(p => 
      p.moduleId && p.status === 'completed'
    ).length;

    const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    const lastActivity = progressRows.length > 0 
      ? new Date(Math.max(...progressRows.map(p => new Date(p.updatedAt).getTime())))
      : null;

    return {
      overallProgress,
      completedLessons,
      totalLessons,
      completedModules,
      totalModules,
      lastActivity
    };
  }

  // Quiz Attempt Management
  async createQuizAttempt(data: CreateQuizAttemptData): Promise<QuizAttempt> {
    const id = uuidv4();
    const now = new Date();
    
    // Get the attempt number for this user and quiz
    const [attemptRows] = await query<{attempt_number: number}[]>(
      `SELECT MAX(attempt_number) as attempt_number FROM quiz_attempts 
       WHERE user_id = ? AND quiz_id = ?`,
      [data.userId, data.quizId]
    );
    
    const attemptNumber = (attemptRows[0]?.attempt_number || 0) + 1;

    await query(
      `INSERT INTO quiz_attempts (id, user_id, quiz_id, answers, score, passed, time_spent, attempt_number, completed_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.userId,
        data.quizId,
        JSON.stringify(data.answers),
        data.score,
        data.passed,
        data.timeSpent,
        attemptNumber,
        now,
        now
      ]
    );

    return {
      id,
      userId: data.userId,
      quizId: data.quizId,
      answers: data.answers,
      score: data.score,
      passed: data.passed,
      timeSpent: data.timeSpent,
      attemptNumber,
      completedAt: now,
      createdAt: now
    };
  }

  async getQuizAttempts(userId: string, quizId?: string): Promise<QuizAttempt[]> {
    let sql = `SELECT * FROM quiz_attempts WHERE user_id = ?`;
    const params: any[] = [userId];

    if (quizId) {
      sql += ` AND quiz_id = ?`;
      params.push(quizId);
    }

    sql += ` ORDER BY created_at DESC`;

    const [rows] = await query<QuizAttempt[]>(sql, params);
    return rows.map(row => ({
      ...row,
      answers: typeof row.answers === 'string' ? JSON.parse(row.answers) : row.answers
    }));
  }

  async getQuizAttemptById(id: string): Promise<QuizAttempt | null> {
    const [rows] = await query<QuizAttempt[]>(
      `SELECT * FROM quiz_attempts WHERE id = ?`,
      [id]
    );
    
    if (rows.length === 0) return null;
    
    const row = rows[0];
    return {
      ...row,
      answers: typeof row.answers === 'string' ? JSON.parse(row.answers) : row.answers
    };
  }

  // Analytics and Reporting
  async getUserLearningStats(userId: string): Promise<{
    totalTimeSpent: number;
    completedCourses: number;
    completedLessons: number;
    completedQuizzes: number;
    averageQuizScore: number;
    currentStreak: number;
    longestStreak: number;
  }> {
    // Get total time spent
    const [timeRows] = await query<{total_time: number}[]>(
      `SELECT SUM(time_spent) as total_time FROM user_progress WHERE user_id = ?`,
      [userId]
    );

    // Get completed courses
    const [courseRows] = await query<{count: number}[]>(
      `SELECT COUNT(DISTINCT course_id) as count 
       FROM user_progress 
       WHERE user_id = ? AND course_id IS NOT NULL AND status = 'completed'`,
      [userId]
    );

    // Get completed lessons
    const [lessonRows] = await query<{count: number}[]>(
      `SELECT COUNT(*) as count 
       FROM user_progress 
       WHERE user_id = ? AND lesson_id IS NOT NULL AND status = 'completed'`,
      [userId]
    );

    // Get completed quizzes
    const [quizRows] = await query<{count: number}[]>(
      `SELECT COUNT(*) as count 
       FROM quiz_attempts 
       WHERE user_id = ? AND passed = true`,
      [userId]
    );

    // Get average quiz score
    const [scoreRows] = await query<{avg_score: number}[]>(
      `SELECT AVG(score) as avg_score 
       FROM quiz_attempts 
       WHERE user_id = ? AND passed = true`,
      [userId]
    );

    // Get learning streak (simplified - would need more complex logic for actual streaks)
    const [streakRows] = await query<{current_streak: number, longest_streak: number}[]>(
      `SELECT 
         COUNT(DISTINCT DATE(completed_at)) as current_streak,
         MAX(consecutive_days) as longest_streak
       FROM (
         SELECT completed_at,
                ROW_NUMBER() OVER (ORDER BY completed_at) - 
                ROW_NUMBER() OVER (PARTITION BY DATE(completed_at) ORDER BY completed_at) as consecutive_days
         FROM user_progress 
         WHERE user_id = ? AND status = 'completed' AND completed_at IS NOT NULL
       ) t`,
      [userId]
    );

    return {
      totalTimeSpent: timeRows[0]?.total_time || 0,
      completedCourses: courseRows[0]?.count || 0,
      completedLessons: lessonRows[0]?.count || 0,
      completedQuizzes: quizRows[0]?.count || 0,
      averageQuizScore: Math.round(scoreRows[0]?.avg_score || 0),
      currentStreak: streakRows[0]?.current_streak || 0,
      longestStreak: streakRows[0]?.longest_streak || 0
    };
  }

  // Get next incomplete lesson for resume functionality
  async getNextIncompleteLesson(userId: string, courseId: string): Promise<{
    lessonId: string;
    moduleId: string;
    lessonTitle: string;
    moduleTitle: string;
  } | null> {
    const [rows] = await query<{
      lesson_id: string;
      module_id: string;
      lesson_title: string;
      module_title: string;
      order_index: number;
      lesson_order: number;
    }[]>(
      `SELECT l.id as lesson_id, l.module_id, l.title as lesson_title, m.title as module_title, m.order_index, l.order_index as lesson_order
       FROM lessons l
       JOIN modules m ON l.module_id = m.id
       WHERE m.course_id = ?
       AND l.id NOT IN (
         SELECT lesson_id FROM user_progress 
         WHERE user_id = ? AND lesson_id = l.id AND status = 'completed'
       )
       ORDER BY m.order_index, l.order_index
       LIMIT 1`,
      [courseId, userId]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      lessonId: row.lesson_id,
      moduleId: row.module_id,
      lessonTitle: row.lesson_title,
      moduleTitle: row.module_title
    };
  }
}
