import { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export class CourseController {
  private async getConnection() {
    return await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'cyber',
    });
  }

  private parseJsonField(field: any): any[] {
    console.log('🔍 parseJsonField input:', field, 'type:', typeof field);
    if (!field) {
      console.log('❌ Field is empty, returning empty array');
      return [];
    }
    
    // Handle already parsed objects from MySQL2
    if (typeof field === 'object' && field !== null) {
      console.log('📦 Field is already an object');
      // If it's an object with options and correct, convert to array format
      if (field.options && Array.isArray(field.options)) {
        const convertedAnswers = field.options.map((option: string, index: number) => ({
          text: option,
          isCorrect: index === field.correct
        }));
        console.log('🔄 Converted to answer format:', convertedAnswers);
        return convertedAnswers;
      }
      // Handle True/False questions with only correct boolean
      if (typeof field.correct === 'boolean' && !field.options) {
        const convertedAnswers = [
          { text: 'True', isCorrect: field.correct === true },
          { text: 'False', isCorrect: field.correct === false }
        ];
        console.log('🔄 Converted True/False to answer format:', convertedAnswers);
        return convertedAnswers;
      }
      // Handle fill_in_blank questions with string correct answer
      if (typeof field.correct === 'string' && !field.options) {
        const convertedAnswers = [
          { text: field.correct, isCorrect: true }
        ];
        console.log('🔄 Converted fill_in_blank to answer format:', convertedAnswers);
        return convertedAnswers;
      }
      // If it's already an array, return it
      if (Array.isArray(field)) {
        console.log('📦 Field is already an array');
        return field;
      }
    }
    
    // Handle string JSON
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        console.log('✅ Parsed JSON:', parsed);
        // If it's an object with options and correct, convert to array format
        if (parsed && typeof parsed === 'object' && parsed.options && Array.isArray(parsed.options)) {
          const convertedAnswers = parsed.options.map((option: string, index: number) => ({
            text: option,
            isCorrect: index === parsed.correct
          }));
          console.log('🔄 Converted to answer format:', convertedAnswers);
          return convertedAnswers;
        }
        return parsed;
      } catch (e) {
        console.log('❌ JSON parse error:', e);
        // If it's not valid JSON, treat as plain text and split by commas
        return field.split(',').map((item: string) => item.trim()).filter((item: string) => item);
      }
    }
    
    console.log('📦 Field is not string or object, returning empty array');
    return [];
  }

  async getCourses(req: Request, res: Response): Promise<void> {
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

      const formattedCourses = courses.map((course: any) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        status: course.status,
        estimatedDuration: course.estimated_duration,
        learningObjectives: this.parseJsonField(course.learning_objectives),
        tags: this.parseJsonField(course.tags),
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

  async getCourseById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log('🎯 Getting course by ID:', id);
      const connection = await this.getConnection();
      
      // Get course
      const [courses] = await connection.query(`
        SELECT 
          id, title, description, level, status, estimated_duration, 
          learning_objectives, tags, is_active, created_by, created_at, updated_at
        FROM courses 
        WHERE id = ? AND is_active = true
      `, [id]) as [any[], any];

      if (courses.length === 0) {
        console.log('❌ Course not found:', id);
        await connection.end();
        res.status(404).json({
          success: false,
          message: 'Course not found'
        });
        return;
      }

      console.log('✅ Course found:', courses[0].title);

      const course = courses[0];

      // Get modules
      const [modules] = await connection.query(`
        SELECT 
          id, course_id, title, description, \`order\`, estimated_duration, 
          is_active, created_at, updated_at
        FROM modules 
        WHERE course_id = ? AND is_active = true
        ORDER BY \`order\` ASC
      `, [id]) as [any[], any];

      console.log('🔍 Modules found:', modules.length);
      if (modules.length > 0) {
        console.log('📋 Module titles:', modules.map((m: any) => m.title));
      }

      // Get lessons for each module
      for (const module of modules) {
        const [lessons] = await connection.query(`
          SELECT 
            id, module_id, title, description, content, type, \`order\`, 
            estimated_duration, is_active, created_at, updated_at
          FROM lessons 
          WHERE module_id = ? AND is_active = true
          ORDER BY \`order\` ASC
        `, [module.id]) as [any[], any];

        module.lessons = lessons.map((lesson: any) => ({
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

        // Get quiz for module (get the most recent one)
        const [quizzes] = await connection.query(`
          SELECT 
            id, module_id, title, description, type, status, time_limit, 
            passing_score, max_attempts, is_active, created_at, updated_at
          FROM quizzes 
          WHERE module_id = ? AND is_active = true
          ORDER BY created_at DESC
          LIMIT 1
        `, [module.id]) as [any[], any];

        console.log(`🔍 Quiz for module ${module.id} (${module.title}):`, quizzes.length);
        if (quizzes.length > 0) {
          console.log(`📝 Quiz title: "${quizzes[0].title}"`);
          console.log(`📝 Quiz ID: ${quizzes[0].id}`);
        }

        if (quizzes.length > 0) {
          // Process all quizzes for this module
          const moduleQuizzes: any[] = [];
          
          for (const quiz of quizzes) {
            // Get questions for each quiz
            const [questions] = await connection.query(`
              SELECT 
                id, quiz_id, text, type, answers, explanation, points, 
                \`order\`, is_active, created_at, updated_at
              FROM questions 
              WHERE quiz_id = ? AND is_active = true
              ORDER BY \`order\` ASC
            `, [quiz.id]) as [any[], any];

            console.log(`❓ Questions for quiz ${quiz.id} (${quiz.title}):`, questions.length);
            if (questions.length > 0) {
              console.log(`📝 First question: "${questions[0].text.substring(0, 50)}..."`);
            }

            const processedQuiz = {
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
              questions: questions.map((question: any) => ({
                id: question.id,
                quizId: question.quiz_id,
                text: question.text,
                type: question.type,
                answers: this.parseJsonField(question.answers),
                explanation: question.explanation,
                points: question.points,
                order: question.order,
                isActive: question.is_active,
                createdAt: question.created_at,
                updatedAt: question.updated_at
              }))
            };
            
            moduleQuizzes.push(processedQuiz);
          }
          
          // Set the first quiz as the main quiz for backward compatibility
          module.quiz = moduleQuizzes[0];
          
          // Add all quizzes to the module
          module.quizzes = moduleQuizzes;
        }
      }

      const formattedCourse = {
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        status: course.status,
        estimatedDuration: course.estimated_duration,
        learningObjectives: this.parseJsonField(course.learning_objectives),
        tags: this.parseJsonField(course.tags),
        isActive: course.is_active,
        createdBy: course.created_by,
        createdAt: course.created_at,
        updatedAt: course.updated_at,
        modules: modules.map((module: any) => ({
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
      
      console.log('🎉 Final course data:');
      console.log('📊 Modules:', formattedCourse.modules.length);
      console.log('📊 Quizzes:', formattedCourse.modules.filter((m: any) => m.quiz).length);
      
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
