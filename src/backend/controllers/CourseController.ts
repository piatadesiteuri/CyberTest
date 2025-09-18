import { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import { databaseConfig } from '../../config/database';

export class CourseController {
  private async getConnection() {
    return await mysql.createConnection({
      host: databaseConfig.host,
      port: databaseConfig.port,
      user: databaseConfig.user,
      password: databaseConfig.password,
      database: databaseConfig.database,
    });
  }

  async getCourses(req: Request, res: Response) {
    try {
      const connection = await this.getConnection();
      
      const [courses] = await connection.query(`
        SELECT 
          id, title, description, level, status, estimated_duration, 
          learning_objectives, tags, is_active, created_by, created_at, updated_at
        FROM courses 
        WHERE is_active = true AND status = 'published'
        ORDER BY 
          CASE level 
            WHEN 'foundation' THEN 1 
            WHEN 'intermediate' THEN 2 
            WHEN 'advanced' THEN 3 
            WHEN 'expert' THEN 4 
          END,
          created_at ASC
      `) as any[];

      const formattedCourses = courses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        status: course.status,
        estimatedDuration: course.estimated_duration,
        learningObjectives: JSON.parse(course.learning_objectives || '[]'),
        tags: JSON.parse(course.tags || '[]'),
        isActive: course.is_active,
        createdBy: course.created_by,
        createdAt: course.created_at,
        updatedAt: course.updated_at
      }));

      await connection.end();
      
      res.json({
        success: true,
        courses: formattedCourses
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch courses'
      });
    }
  }

  async getCourseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const connection = await this.getConnection();
      
      // Get course
      const [courses] = await connection.query(`
        SELECT 
          id, title, description, level, status, estimated_duration, 
          learning_objectives, tags, is_active, created_by, created_at, updated_at
        FROM courses 
        WHERE id = ? AND is_active = true
      `, [id]) as any[];

      if (courses.length === 0) {
        await connection.end();
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      const course = courses[0];

      // Get modules
      const [modules] = await connection.query(`
        SELECT 
          id, course_id, title, description, \`order\`, estimated_duration, 
          is_active, created_at, updated_at
        FROM modules 
        WHERE course_id = ? AND is_active = true
        ORDER BY \`order\` ASC
      `, [id]) as any[];

      // Get lessons for each module
      for (const module of modules) {
        const [lessons] = await connection.query(`
          SELECT 
            id, module_id, title, description, content, type, \`order\`, 
            estimated_duration, is_active, created_at, updated_at
          FROM lessons 
          WHERE module_id = ? AND is_active = true
          ORDER BY \`order\` ASC
        `, [module.id]) as any[];

        module.lessons = lessons.map(lesson => ({
          id: lesson.id,
          moduleId: lesson.module_id,
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          type: lesson.type,
          order: lesson.order,
          estimatedDuration: lesson.estimated_duration,
          isActive: lesson.is_active,
          createdAt: lesson.created_at,
          updatedAt: lesson.updated_at
        }));

        // Get quiz for module
        const [quizzes] = await connection.query(`
          SELECT 
            id, module_id, title, description, type, status, time_limit, 
            passing_score, max_attempts, is_active, created_at, updated_at
          FROM quizzes 
          WHERE module_id = ? AND is_active = true
          LIMIT 1
        `, [module.id]) as any[];

        if (quizzes.length > 0) {
          const quiz = quizzes[0];
          
          // Get questions for quiz
          const [questions] = await connection.query(`
            SELECT 
              id, quiz_id, text, type, answers, explanation, points, 
              \`order\`, is_active, created_at, updated_at
            FROM questions 
            WHERE quiz_id = ? AND is_active = true
            ORDER BY \`order\` ASC
          `, [quiz.id]) as any[];

          module.quiz = {
            id: quiz.id,
            moduleId: quiz.module_id,
            title: quiz.title,
            description: quiz.description,
            type: quiz.type,
            status: quiz.status,
            timeLimit: quiz.time_limit,
            passingScore: quiz.passing_score,
            maxAttempts: quiz.max_attempts,
            isActive: quiz.is_active,
            createdAt: quiz.created_at,
            updatedAt: quiz.updated_at,
            questions: questions.map(question => ({
              id: question.id,
              quizId: question.quiz_id,
              text: question.text,
              type: question.type,
              answers: JSON.parse(question.answers || '[]'),
              explanation: question.explanation,
              points: question.points,
              order: question.order,
              isActive: question.is_active,
              createdAt: question.created_at,
              updatedAt: question.updated_at
            }))
          };
        }
      }

      const formattedCourse = {
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        status: course.status,
        estimatedDuration: course.estimated_duration,
        learningObjectives: JSON.parse(course.learning_objectives || '[]'),
        tags: JSON.parse(course.tags || '[]'),
        isActive: course.is_active,
        createdBy: course.created_by,
        createdAt: course.created_at,
        updatedAt: course.updated_at,
        modules: modules.map(module => ({
          id: module.id,
          courseId: module.course_id,
          title: module.title,
          description: module.description,
          order: module.order,
          estimatedDuration: module.estimated_duration,
          isActive: module.is_active,
          createdAt: module.created_at,
          updatedAt: module.updated_at,
          lessons: module.lessons,
          quiz: module.quiz
        }))
      };

      await connection.end();
      
      res.json({
        success: true,
        course: formattedCourse
      });
    } catch (error) {
      console.error('Error fetching course:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch course'
      });
    }
  }
}
