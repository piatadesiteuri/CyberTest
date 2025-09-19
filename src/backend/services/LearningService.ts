import DatabaseConnection from '../utils/DatabaseConnection';
import { Course, CreateCourseData, UpdateCourseData, CourseLevel, CourseStatus } from '../entities/Course';
import { Module, CreateModuleData, UpdateModuleData } from '../entities/Module';
import { Lesson, CreateLessonData, UpdateLessonData, LessonType } from '../entities/Lesson';
import { Quiz, CreateQuizData, UpdateQuizData, QuizType, QuizStatus } from '../entities/Quiz';
import { Question, CreateQuestionData, UpdateQuestionData, QuestionType } from '../entities/Question';
import { UserProgress, CreateUserProgressData, UpdateUserProgressData, ProgressStatus, QuizAttempt, CreateQuizAttemptData } from '../entities/UserProgress';

export class LearningService {
  private db: DatabaseConnection;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  // Course Management
  async createCourse(courseData: CreateCourseData): Promise<Course> {
    const id = this.generateId();
    const course: Course = {
      id,
      ...courseData,
      prerequisites: courseData.prerequisites || [],
      status: CourseStatus.PUBLISHED,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const query = `
      INSERT INTO courses (id, title, description, level, status, estimated_duration, 
                          prerequisites, learning_objectives, tags, is_active, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db.getPool().execute(query, [
      course.id,
      course.title,
      course.description,
      course.level,
      course.status,
      course.estimatedDuration,
      JSON.stringify(course.prerequisites || []),
      JSON.stringify(course.learningObjectives),
      JSON.stringify(course.tags),
      course.isActive,
      course.createdBy,
      course.createdAt,
      course.updatedAt
    ]);

    return course;
  }

  async getCourseById(id: string): Promise<Course | null> {
    const query = 'SELECT * FROM courses WHERE id = ? AND is_active = TRUE';
    const [results] = await this.db.getPool().execute(query, [id]) as [any[], any];
    
    if (results.length === 0) return null;
    
    return this.mapCourseFromDb(results[0]);
  }

  async getCoursesByLevel(level: CourseLevel): Promise<Course[]> {
    const query = 'SELECT * FROM courses WHERE level = ? AND status = "published" AND is_active = TRUE ORDER BY created_at DESC';
    const [results] = await this.db.getPool().execute(query, [level]) as [any[], any];
    
    return results.map(this.mapCourseFromDb);
  }

  async getAllPublishedCourses(): Promise<Course[]> {
    const query = 'SELECT * FROM courses WHERE status = "published" AND is_active = TRUE ORDER BY level, created_at DESC';
    const [results] = await this.db.getPool().execute(query) as [any[], any];
    
    return results.map(this.mapCourseFromDb);
  }

  // Module Management
  async createModule(moduleData: CreateModuleData): Promise<Module> {
    const id = this.generateId();
    const module: Module = {
      id,
      ...moduleData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const query = `
      INSERT INTO modules (id, course_id, title, description, \`order\`, estimated_duration, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db.getPool().execute(query, [
      module.id,
      module.courseId,
      module.title,
      module.description,
      module.order,
      module.estimatedDuration,
      module.isActive,
      module.createdAt,
      module.updatedAt
    ]);

    return module;
  }

  async getModulesByCourseId(courseId: string): Promise<Module[]> {
    const query = 'SELECT * FROM modules WHERE course_id = ? AND is_active = TRUE ORDER BY `order`';
    const [results] = await this.db.getPool().execute(query, [courseId]) as [any[], any];
    
    return results.map(this.mapModuleFromDb);
  }

  // Lesson Management
  async createLesson(lessonData: CreateLessonData): Promise<Lesson> {
    const id = this.generateId();
    const lesson: Lesson = {
      id,
      ...lessonData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const query = `
      INSERT INTO lessons (id, module_id, title, description, content, type, \`order\`, estimated_duration, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db.getPool().execute(query, [
      lesson.id,
      lesson.moduleId,
      lesson.title,
      lesson.description,
      lesson.content,
      lesson.type,
      lesson.order,
      lesson.estimatedDuration,
      lesson.isActive,
      lesson.createdAt,
      lesson.updatedAt
    ]);

    return lesson;
  }

  async getLessonsByModuleId(moduleId: string): Promise<Lesson[]> {
    const query = 'SELECT * FROM lessons WHERE module_id = ? AND is_active = TRUE ORDER BY `order`';
    const [results] = await this.db.getPool().execute(query, [moduleId]) as [any[], any];
    
    return results.map(this.mapLessonFromDb);
  }

  // Quiz Management
  async createQuiz(quizData: CreateQuizData): Promise<Quiz> {
    const id = this.generateId();
    const quiz: Quiz = {
      id,
      ...quizData,
      timeLimit: quizData.timeLimit || 0,
      maxAttempts: quizData.maxAttempts || 0,
      status: QuizStatus.PUBLISHED,
      questions: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const query = `
      INSERT INTO quizzes (id, module_id, title, description, type, status, time_limit, passing_score, max_attempts, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db.getPool().execute(query, [
      quiz.id,
      quiz.moduleId,
      quiz.title,
      quiz.description,
      quiz.type,
      quiz.status,
      quiz.timeLimit,
      quiz.passingScore,
      quiz.maxAttempts,
      quiz.isActive,
      quiz.createdAt,
      quiz.updatedAt
    ]);

    return quiz;
  }

  async getQuizById(id: string): Promise<Quiz | null> {
    const query = 'SELECT * FROM quizzes WHERE id = ? AND is_active = TRUE';
    const [results] = await this.db.getPool().execute(query, [id]) as [any[], any];
    
    if (results.length === 0) return null;
    
    const quiz = this.mapQuizFromDb(results[0]);
    
    // Get questions for this quiz
    const questions = await this.getQuestionsByQuizId(id);
    quiz.questions = questions;
    
    return quiz;
  }

  // Question Management
  async createQuestion(questionData: CreateQuestionData): Promise<Question> {
    const id = this.generateId();
    const question: Question = {
      id,
      ...questionData,
      answers: questionData.answers.map((answer, index) => ({
        ...answer,
        id: this.generateId()
      })),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const query = `
      INSERT INTO questions (id, quiz_id, text, type, answers, explanation, points, \`order\`, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db.getPool().execute(query, [
      question.id,
      question.quizId,
      question.text,
      question.type,
      JSON.stringify(question.answers),
      question.explanation,
      question.points,
      question.order,
      question.isActive,
      question.createdAt,
      question.updatedAt
    ]);

    return question;
  }

  async getQuestionsByQuizId(quizId: string): Promise<Question[]> {
    const query = 'SELECT * FROM questions WHERE quiz_id = ? AND is_active = TRUE ORDER BY `order`';
    const [results] = await this.db.getPool().execute(query, [quizId]) as [any[], any];
    
    return results.map(this.mapQuestionFromDb);
  }

  // User Progress Management
  async createUserProgress(progressData: CreateUserProgressData): Promise<UserProgress> {
    const id = this.generateId();
    const progress: UserProgress = {
      id,
      ...progressData,
      timeSpent: progressData.timeSpent || 0,
      lastAccessedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const query = `
      INSERT INTO user_progress (id, user_id, course_id, module_id, lesson_id, quiz_id, status, progress_percentage, score, time_spent, last_accessed_at, completed_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db.getPool().execute(query, [
      progress.id,
      progress.userId,
      progress.courseId,
      progress.moduleId || null,
      progress.lessonId || null,
      progress.quizId || null,
      progress.status,
      progress.progressPercentage,
      progress.score || null,
      progress.timeSpent,
      progress.lastAccessedAt,
      progress.completedAt || null,
      progress.createdAt,
      progress.updatedAt
    ]);

    return progress;
  }

  async getUserProgress(userId: string, courseId: string): Promise<UserProgress | null> {
    const query = 'SELECT * FROM user_progress WHERE user_id = ? AND course_id = ? ORDER BY updated_at DESC LIMIT 1';
    const [results] = await this.db.getPool().execute(query, [userId, courseId]) as [any[], any];
    
    if (results.length === 0) return null;
    
    return this.mapUserProgressFromDb(results[0]);
  }

  async updateUserProgress(id: string, updateData: UpdateUserProgressData): Promise<void> {
    const fields = [];
    const values = [];

    if (updateData.status !== undefined) {
      fields.push('status = ?');
      values.push(updateData.status);
    }
    if (updateData.progressPercentage !== undefined) {
      fields.push('progress_percentage = ?');
      values.push(updateData.progressPercentage);
    }
    if (updateData.score !== undefined) {
      fields.push('score = ?');
      values.push(updateData.score);
    }
    if (updateData.timeSpent !== undefined) {
      fields.push('time_spent = ?');
      values.push(updateData.timeSpent);
    }
    if (updateData.lastAccessedAt !== undefined) {
      fields.push('last_accessed_at = ?');
      values.push(updateData.lastAccessedAt);
    }
    if (updateData.completedAt !== undefined) {
      fields.push('completed_at = ?');
      values.push(updateData.completedAt);
    }

    if (fields.length === 0) return;

    fields.push('updated_at = ?');
    values.push(new Date());
    values.push(id);

    const query = `UPDATE user_progress SET ${fields.join(', ')} WHERE id = ?`;
    await this.db.getPool().execute(query, values);
  }

  // Quiz Attempt Management
  async createQuizAttempt(attemptData: CreateQuizAttemptData): Promise<QuizAttempt> {
    const id = this.generateId();
    
    // Calculate score and correct answers
    const quiz = await this.getQuizById(attemptData.quizId);
    if (!quiz) throw new Error('Quiz not found');

    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    const processedAnswers = attemptData.answers.map(answer => {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      if (!question) return { ...answer, isCorrect: false, points: 0 };

      let isCorrect = false;
      if (question.type === QuestionType.MULTIPLE_CHOICE || question.type === QuestionType.SINGLE_CHOICE) {
        const correctAnswerIds = question.answers.filter((a: any) => a.isCorrect).map((a: any) => a.id);
        isCorrect = answer.answerIds.length === correctAnswerIds.length && 
                   answer.answerIds.every((id: any) => correctAnswerIds.includes(id));
      } else if (question.type === QuestionType.TRUE_FALSE) {
        const correctAnswer = question.answers.find((a: any) => a.isCorrect);
        isCorrect = correctAnswer && answer.answerIds.includes(correctAnswer.id);
      }

      if (isCorrect) {
        correctAnswers++;
        earnedPoints += question.points;
      }
      totalPoints += question.points;

      return {
        ...answer,
        isCorrect,
        points: isCorrect ? question.points : 0
      };
    });

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= quiz.passingScore;

    const attempt: QuizAttempt = {
      id,
      userId: attemptData.userId,
      quizId: attemptData.quizId,
      answers: processedAnswers,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      timeSpent: attemptData.timeSpent,
      startedAt: new Date(),
      completedAt: new Date(),
      passed
    };

    const query = `
      INSERT INTO quiz_attempts (id, user_id, quiz_id, answers, score, total_questions, correct_answers, time_spent, started_at, completed_at, passed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db.getPool().execute(query, [
      attempt.id,
      attempt.userId,
      attempt.quizId,
      JSON.stringify(attempt.answers),
      attempt.score,
      attempt.totalQuestions,
      attempt.correctAnswers,
      attempt.timeSpent,
      attempt.startedAt,
      attempt.completedAt,
      attempt.passed
    ]);

    return attempt;
  }

  // Progress Calculation
  async calculateUserProgress(userId: string, courseId: string): Promise<{ progressPercentage: number; completedModules: number; totalModules: number }> {
    const modules = await this.getModulesByCourseId(courseId);
    const totalModules = modules.length;
    
    let completedModules = 0;
    
    for (const module of modules) {
      const progress = await this.getUserProgress(userId, courseId);
      if (progress && progress.status === ProgressStatus.COMPLETED) {
        completedModules++;
      }
    }
    
    const progressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
    
    return {
      progressPercentage,
      completedModules,
      totalModules
    };
  }

  // Helper methods
  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private mapCourseFromDb(row: any): Course {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      level: row.level,
      status: row.status,
      estimatedDuration: row.estimated_duration,
      prerequisites: JSON.parse(row.prerequisites || '[]'),
      learningObjectives: JSON.parse(row.learning_objectives || '[]'),
      tags: JSON.parse(row.tags || '[]'),
      isActive: row.is_active,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapModuleFromDb(row: any): Module {
    return {
      id: row.id,
      courseId: row.course_id,
      title: row.title,
      description: row.description,
      order: row.order,
      estimatedDuration: row.estimated_duration,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapLessonFromDb(row: any): Lesson {
    return {
      id: row.id,
      moduleId: row.module_id,
      title: row.title,
      description: row.description,
      content: row.content,
      type: row.type,
      order: row.order,
      estimatedDuration: row.estimated_duration,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapQuizFromDb(row: any): Quiz {
    return {
      id: row.id,
      moduleId: row.module_id,
      title: row.title,
      description: row.description,
      type: row.type,
      status: row.status,
      timeLimit: row.time_limit,
      passingScore: row.passing_score,
      maxAttempts: row.max_attempts,
      questions: [],
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapQuestionFromDb(row: any): Question {
    return {
      id: row.id,
      quizId: row.quiz_id,
      text: row.text,
      type: row.type,
      answers: JSON.parse(row.answers || '[]'),
      explanation: row.explanation,
      points: row.points,
      order: row.order,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapUserProgressFromDb(row: any): UserProgress {
    return {
      id: row.id,
      userId: row.user_id,
      courseId: row.course_id,
      moduleId: row.module_id,
      lessonId: row.lesson_id,
      quizId: row.quiz_id,
      status: row.status,
      progressPercentage: row.progress_percentage,
      score: row.score,
      timeSpent: row.time_spent,
      lastAccessedAt: row.last_accessed_at,
      completedAt: row.completed_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}
