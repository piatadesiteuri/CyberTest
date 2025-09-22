import DatabaseConnection from '../utils/DatabaseConnection';
const { v4: uuidv4 } = require('uuid');

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
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  timeSpent: number;
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
  completedAt?: Date;
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
  private db = DatabaseConnection.getInstance();

  // User Progress Management
  async createUserProgress(data: CreateUserProgressData): Promise<UserProgress> {
    const id = uuidv4();
    const now = new Date();
    
    await this.db.getPool().execute(
      `INSERT INTO user_progress (id, user_id, course_id, module_id, lesson_id, quiz_id, status, progress_percentage, time_spent, score, completed_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        data.completedAt || null,
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
      completedAt: data.completedAt,
      updatedAt: now
    };
  }

  async updateUserProgress(id: string, data: UpdateUserProgressData): Promise<UserProgress | null> {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    
    if (fields.length === 0) return this.getUserProgressById(id);

    await this.db.getPool().execute(
      `UPDATE user_progress SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );

    return this.getUserProgressById(id);
  }

  async getUserProgressById(id: string): Promise<UserProgress | null> {
    const [rows] = await this.db.getPool().execute(
      `SELECT * FROM user_progress WHERE id = ?`,
      [id]
    );
    return (rows as UserProgress[])[0] || null;
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

    console.log('🔍 getUserProgress SQL:', sql);
    console.log('🔍 getUserProgress params:', params);

    const [rows] = await this.db.getPool().execute(sql, params);
    console.log('🔍 getUserProgress rows:', rows);
    
    return rows as UserProgress[];
  }

  async getUserCourseProgress(userId: string, courseId: string): Promise<{
    overallProgress: number;
    completedLessons: number;
    totalLessons: number;
    completedModules: number;
    totalModules: number;
    lastActivity: Date | null;
  }> {
    const db = this.db.getPool();

    // Get total lessons and modules for the course
    const [courseStatsRows] = await db.execute(
      `SELECT 
         COUNT(DISTINCT l.id) as totalLessons,
         COUNT(DISTINCT m.id) as totalModules
       FROM courses c
       JOIN modules m ON c.id = m.course_id
       JOIN lessons l ON m.id = l.module_id
       WHERE c.id = ?`,
      [courseId]
    );

    const totalLessons = (courseStatsRows as {totalLessons: number}[])[0]?.totalLessons || 0;
    const totalModules = (courseStatsRows as {totalModules: number}[])[0]?.totalModules || 0;

    // Get user's completed lessons for the course
    const [userProgressRows] = await db.execute(
      `SELECT 
         COUNT(DISTINCT up.lesson_id) as completedLessons,
         MAX(up.updated_at) as lastActivity
       FROM user_progress up
       WHERE up.user_id = ? AND up.course_id = ? AND up.status = 'completed' AND up.lesson_id IS NOT NULL`,
      [userId, courseId]
    );

    const completedLessons = (userProgressRows as {completedLessons: number}[])[0]?.completedLessons || 0;
    const lastActivity = (userProgressRows as {lastActivity: Date}[])[0]?.lastActivity || null;

    // Calculate completed modules - a module is completed when ALL lessons are completed AND (no quizzes OR at least one quiz with score >= 75%)
    const [completedModulesRows] = await db.execute(
      `SELECT m.id as module_id,
         COUNT(DISTINCT l.id) as total_lessons,
         COUNT(DISTINCT q.id) as total_quizzes,
         COUNT(DISTINCT CASE WHEN up_lessons.status = 'completed' THEN up_lessons.lesson_id END) as completed_lessons,
         COUNT(DISTINCT CASE WHEN qa.completed_at IS NOT NULL AND qa.score >= 75 THEN qa.quiz_id END) as completed_quizzes_with_good_score
       FROM modules m
       LEFT JOIN lessons l ON m.id = l.module_id
       LEFT JOIN quizzes q ON m.id = q.module_id
       LEFT JOIN user_progress up_lessons ON up_lessons.lesson_id = l.id AND up_lessons.user_id = ? AND up_lessons.course_id = ?
       LEFT JOIN quiz_attempts qa ON qa.quiz_id = q.id AND qa.user_id = ?
       WHERE m.course_id = ?
       GROUP BY m.id
       HAVING completed_lessons = total_lessons AND (total_quizzes = 0 OR completed_quizzes_with_good_score > 0)`,
      [userId, courseId, userId, courseId]
    );

    const completedModules = (completedModulesRows as any[]).length;
    
    console.log('🔍 Module completion calculation:');
    console.log('  - Total modules:', totalModules);
    console.log('  - Completed modules:', completedModules);
    console.log('  - Module details:', completedModulesRows);

    const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

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
  async createQuizAttempt(userId: string, quizAttemptData: any): Promise<QuizAttempt> {
    const id = uuidv4();
    const now = new Date();
    const { quizId, answers, score, totalQuestions, correctAnswers, timeSpent, passed } = quizAttemptData;

    await this.db.getPool().execute(
      `INSERT INTO quiz_attempts (id, user_id, quiz_id, answers, score, total_questions, correct_answers, time_spent, passed, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userId,
        quizId,
        JSON.stringify(answers),
        score,
        totalQuestions || 0,
        correctAnswers || 0,
        timeSpent,
        passed,
        now
      ]
    );

    return {
      id,
      userId,
      quizId,
      answers,
      score,
      totalQuestions: totalQuestions || 0,
      correctAnswers: correctAnswers || 0,
      passed,
      timeSpent,
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

    sql += ` ORDER BY completed_at DESC`;

    const [rows] = await this.db.getPool().execute(sql, params);
    return (rows as any[]).map(row => ({
      id: row.id,
      userId: row.user_id,
      quizId: row.quiz_id,
      answers: typeof row.answers === 'string' ? JSON.parse(row.answers) : row.answers,
      score: row.score,
      totalQuestions: row.total_questions,
      correctAnswers: row.correct_answers,
      passed: row.passed,
      timeSpent: row.time_spent,
      completedAt: row.completed_at,
      createdAt: row.created_at
    }));
  }

  async getQuizAttemptById(id: string): Promise<QuizAttempt | null> {
    const [rows] = await this.db.getPool().execute(
      `SELECT * FROM quiz_attempts WHERE id = ?`,
      [id]
    );
    
    if ((rows as any[]).length === 0) return null;
    
    const row = (rows as any[])[0];
    return {
      id: row.id,
      userId: row.user_id,
      quizId: row.quiz_id,
      answers: typeof row.answers === 'string' ? JSON.parse(row.answers) : row.answers,
      score: row.score,
      totalQuestions: row.total_questions,
      correctAnswers: row.correct_answers,
      passed: row.passed,
      timeSpent: row.time_spent,
      completedAt: row.completed_at,
      createdAt: row.created_at
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
    const [timeRows] = await this.db.getPool().execute(
      `SELECT SUM(time_spent) as total_time FROM user_progress WHERE user_id = ?`,
      [userId]
    );

    // Get completed courses
    const [courseRows] = await this.db.getPool().execute(
      `SELECT COUNT(DISTINCT course_id) as count 
       FROM user_progress 
       WHERE user_id = ? AND course_id IS NOT NULL AND status = 'completed'`,
      [userId]
    );

    // Get completed lessons
    const [lessonRows] = await this.db.getPool().execute(
      `SELECT COUNT(*) as count 
       FROM user_progress 
       WHERE user_id = ? AND lesson_id IS NOT NULL AND status = 'completed'`,
      [userId]
    );

    // Get completed quizzes
    const [quizRows] = await this.db.getPool().execute(
      `SELECT COUNT(*) as count 
       FROM quiz_attempts 
       WHERE user_id = ? AND passed = true`,
      [userId]
    );

    // Get average quiz score
    const [scoreRows] = await this.db.getPool().execute(
      `SELECT AVG(score) as avg_score 
       FROM quiz_attempts 
       WHERE user_id = ? AND passed = true`,
      [userId]
    );

    // Get learning streak (simplified - would need more complex logic for actual streaks)
    const [streakRows] = await this.db.getPool().execute(
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
      totalTimeSpent: (timeRows as {total_time: number}[])[0]?.total_time || 0,
      completedCourses: (courseRows as {count: number}[])[0]?.count || 0,
      completedLessons: (lessonRows as {count: number}[])[0]?.count || 0,
      completedQuizzes: (quizRows as {count: number}[])[0]?.count || 0,
      averageQuizScore: Math.round((scoreRows as {avg_score: number}[])[0]?.avg_score || 0),
      currentStreak: (streakRows as {current_streak: number, longest_streak: number}[])[0]?.current_streak || 0,
      longestStreak: (streakRows as {current_streak: number, longest_streak: number}[])[0]?.longest_streak || 0
    };
  }

  // Get next incomplete lesson for resume functionality
  async getNextIncompleteLesson(userId: string, courseId: string): Promise<{
    lessonId: string;
    moduleId: string;
    lessonTitle: string;
    moduleTitle: string;
  } | null> {
    const [rows] = await this.db.getPool().execute(
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

    if ((rows as any[]).length === 0) return null;

    const row = (rows as any[])[0];
    return {
      lessonId: row.lesson_id,
      moduleId: row.module_id,
      lessonTitle: row.lesson_title,
      moduleTitle: row.module_title
    };
  }

  // Mark lesson as completed
  async markLessonComplete(userId: string, lessonId: string, courseId: string, moduleId: string, timeSpent: number = 0): Promise<UserProgress> {
    const db = DatabaseConnection.getInstance().getPool();
    
    // Check if progress already exists
    const existingProgress = await this.getUserProgress(
      userId,
      courseId,
      moduleId,
      lessonId
    );

    if (existingProgress.length > 0) {
      // Update existing progress
      const updatedProgress = await this.updateUserProgress(existingProgress[0].id, {
        status: 'completed',
        progressPercentage: 100,
        timeSpent: timeSpent,
        completedAt: new Date()
      });
      
      if (!updatedProgress) {
        throw new Error('Failed to update progress');
      }
      
      return updatedProgress;
    } else {
      // Create new progress
      return await this.createUserProgress({
        userId,
        courseId,
        moduleId,
        lessonId,
        status: 'completed',
        progressPercentage: 100,
        timeSpent: timeSpent,
        completedAt: new Date()
      });
    }
  }

  // Unmark lesson as completed
  async unmarkLessonComplete(userId: string, lessonId: string): Promise<boolean> {
    const db = DatabaseConnection.getInstance().getPool();
    
    try {
      // Find the progress record for this lesson
      const [rows] = await db.execute(
        `SELECT id FROM user_progress WHERE user_id = ? AND lesson_id = ? AND status = 'completed'`,
        [userId, lessonId]
      );

      if ((rows as any[]).length === 0) {
        return false; // No completed progress found
      }

      const progressId = (rows as any[])[0].id;

      // Delete the progress record
      await db.execute(
        `DELETE FROM user_progress WHERE id = ?`,
        [progressId]
      );

      return true;
    } catch (error) {
      console.error('Error unmarking lesson:', error);
      return false;
    }
  }

  // Check if quiz is unlocked for user
  async isQuizUnlocked(userId: string, quizId: string): Promise<{
    isUnlocked: boolean;
    reason?: string;
    requiredProgress?: number;
    currentProgress?: number;
  }> {
    const db = DatabaseConnection.getInstance().getPool();
    
    try {
      // Get quiz details
      const [quizRows] = await db.execute(
        `SELECT q.*, m.course_id, m.title as module_title 
         FROM quizzes q 
         JOIN modules m ON q.module_id = m.id 
         WHERE q.id = ?`,
        [quizId]
      );

      if ((quizRows as any[]).length === 0) {
        return { isUnlocked: false, reason: 'Quiz not found' };
      }

      const quiz = (quizRows as any[])[0];
      const courseId = quiz.course_id;

      // Check course progress
      const courseProgress = await this.getUserCourseProgress(userId, courseId);

      // Different unlock conditions based on quiz type
      switch (quiz.type) {
        case 'post_assessment':
          // Module quiz - unlock after completing all lessons in the module
          const moduleProgress = await this.getModuleProgress(userId, quiz.module_id);
          if (moduleProgress.completedLessons >= moduleProgress.totalLessons) {
            return { isUnlocked: true };
          } else {
            return {
              isUnlocked: false,
              reason: `Complete all lessons in ${quiz.module_title} to unlock this quiz`,
              requiredProgress: 100,
              currentProgress: moduleProgress.overallProgress
            };
          }

        case 'practice':
          // Practice quiz - unlock after completing module quiz
          const moduleQuizCompleted = await this.isModuleQuizCompleted(userId, quiz.module_id);
          if (moduleQuizCompleted) {
            return { isUnlocked: true };
          } else {
            return {
              isUnlocked: false,
              reason: `Complete the module assessment to unlock this practice quiz`,
              requiredProgress: 100,
              currentProgress: 0
            };
          }

        case 'final_exam':
          // Final exam - unlock only at 100% course progress
          if (courseProgress.overallProgress >= 100) {
            return { isUnlocked: true };
          } else {
            return {
              isUnlocked: false,
              reason: `Complete 100% of the course to unlock the final exam`,
              requiredProgress: 100,
              currentProgress: courseProgress.overallProgress
            };
          }

        default:
          return { isUnlocked: true }; // Other quiz types are always unlocked
      }
    } catch (error) {
      console.error('Error checking quiz unlock status:', error);
      return { isUnlocked: false, reason: 'Error checking unlock status' };
    }
  }

  // Get module progress
  async getModuleProgress(userId: string, moduleId: string): Promise<{
    overallProgress: number;
    completedLessons: number;
    totalLessons: number;
  }> {
    const db = DatabaseConnection.getInstance().getPool();

    // Get total lessons in module
    const [totalRows] = await db.execute(
      `SELECT COUNT(*) as total FROM lessons WHERE module_id = ? AND is_active = 1`,
      [moduleId]
    );

    const totalLessons = (totalRows as {total: number}[])[0]?.total || 0;

    // Get completed lessons
    const [completedRows] = await db.execute(
      `SELECT COUNT(*) as completed 
       FROM user_progress up
       JOIN lessons l ON up.lesson_id = l.id
       WHERE up.user_id = ? AND l.module_id = ? AND up.status = 'completed'`,
      [userId, moduleId]
    );

    const completedLessons = (completedRows as {completed: number}[])[0]?.completed || 0;
    const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      overallProgress,
      completedLessons,
      totalLessons
    };
  }

  // Check if module quiz is completed
  async isModuleQuizCompleted(userId: string, moduleId: string): Promise<boolean> {
    const db = DatabaseConnection.getInstance().getPool();

    const [rows] = await db.execute(
      `SELECT COUNT(*) as count
       FROM user_progress up
       JOIN quizzes q ON up.quiz_id = q.id
       WHERE up.user_id = ? AND q.module_id = ? AND q.type = 'post_assessment' AND up.status = 'completed'`,
      [userId, moduleId]
    );

    return (rows as {count: number}[])[0]?.count > 0;
  }

  // Get available quizzes for user (unlocked quizzes)
  async getAvailableQuizzes(userId: string, courseId: string): Promise<{
    unlocked: any[];
    locked: any[];
  }> {
    const db = DatabaseConnection.getInstance().getPool();

    // Get all quizzes for the course
    const [quizRows] = await db.execute(
      `SELECT q.*, m.title as module_title, m.\`order\` as module_order
       FROM quizzes q
       JOIN modules m ON q.module_id = m.id
       WHERE m.course_id = ? AND q.is_active = 1
       ORDER BY m.\`order\`, q.type, q.created_at`,
      [courseId]
    );

    const quizzes = quizRows as any[];
    const unlocked: any[] = [];
    const locked: any[] = [];

    for (const quiz of quizzes) {
      const unlockStatus = await this.isQuizUnlocked(userId, quiz.id);
      
      if (unlockStatus.isUnlocked) {
        unlocked.push({
          ...quiz,
          unlockReason: null
        });
      } else {
        locked.push({
          ...quiz,
          unlockReason: unlockStatus.reason,
          requiredProgress: unlockStatus.requiredProgress,
          currentProgress: unlockStatus.currentProgress
        });
      }
    }

    return { unlocked, locked };
  }

}
