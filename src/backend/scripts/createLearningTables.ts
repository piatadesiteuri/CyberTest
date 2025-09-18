import mysql from 'mysql2/promise';
import { databaseConfig } from '../../config/database';

const createLearningTables = async () => {
  try {
    // Connect to MySQL
    const connection = await mysql.createConnection({
      host: databaseConfig.host,
      port: databaseConfig.port,
      user: databaseConfig.user,
      password: databaseConfig.password,
      database: databaseConfig.database
    });

    console.log('🔌 Connected to MySQL database');

    // Create courses table
    const createCoursesTable = `
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        level ENUM('foundation', 'intermediate', 'advanced', 'expert') NOT NULL DEFAULT 'foundation',
        status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
        estimated_duration INT NOT NULL DEFAULT 0,
        prerequisites JSON,
        learning_objectives JSON,
        tags JSON,
        is_active BOOLEAN DEFAULT TRUE,
        created_by VARCHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_level (level),
        INDEX idx_status (status),
        INDEX idx_is_active (is_active),
        INDEX idx_created_by (created_by),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.query(createCoursesTable);
    console.log('✅ Courses table created or already exists');

    // Create modules table
    const createModulesTable = `
      CREATE TABLE IF NOT EXISTS modules (
        id VARCHAR(36) PRIMARY KEY,
        course_id VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        \`order\` INT NOT NULL DEFAULT 0,
        estimated_duration INT NOT NULL DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_course_id (course_id),
        INDEX idx_order (course_id, \`order\`),
        INDEX idx_is_active (is_active),
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.query(createModulesTable);
    console.log('✅ Modules table created or already exists');

    // Create lessons table
    const createLessonsTable = `
      CREATE TABLE IF NOT EXISTS lessons (
        id VARCHAR(36) PRIMARY KEY,
        module_id VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        content LONGTEXT NOT NULL,
        type ENUM('theory', 'practical', 'video', 'interactive', 'documentation') NOT NULL DEFAULT 'theory',
        \`order\` INT NOT NULL DEFAULT 0,
        estimated_duration INT NOT NULL DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_module_id (module_id),
        INDEX idx_order (module_id, \`order\`),
        INDEX idx_type (type),
        INDEX idx_is_active (is_active),
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.query(createLessonsTable);
    console.log('✅ Lessons table created or already exists');

    // Create quizzes table
    const createQuizzesTable = `
      CREATE TABLE IF NOT EXISTS quizzes (
        id VARCHAR(36) PRIMARY KEY,
        module_id VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        type ENUM('pre_assessment', 'post_assessment', 'practice', 'final_exam') NOT NULL DEFAULT 'practice',
        status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
        time_limit INT NOT NULL DEFAULT 0,
        passing_score INT NOT NULL DEFAULT 70,
        max_attempts INT NOT NULL DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_module_id (module_id),
        INDEX idx_type (type),
        INDEX idx_status (status),
        INDEX idx_is_active (is_active),
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.query(createQuizzesTable);
    console.log('✅ Quizzes table created or already exists');

    // Create questions table
    const createQuestionsTable = `
      CREATE TABLE IF NOT EXISTS questions (
        id VARCHAR(36) PRIMARY KEY,
        quiz_id VARCHAR(36) NOT NULL,
        text TEXT NOT NULL,
        type ENUM('multiple_choice', 'true_false', 'single_choice', 'fill_in_blank', 'essay') NOT NULL DEFAULT 'multiple_choice',
        answers JSON NOT NULL,
        explanation TEXT,
        points INT NOT NULL DEFAULT 1,
        \`order\` INT NOT NULL DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_quiz_id (quiz_id),
        INDEX idx_order (quiz_id, \`order\`),
        INDEX idx_type (type),
        INDEX idx_is_active (is_active),
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.query(createQuestionsTable);
    console.log('✅ Questions table created or already exists');

    // Create user_progress table
    const createUserProgressTable = `
      CREATE TABLE IF NOT EXISTS user_progress (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        course_id VARCHAR(36) NOT NULL,
        module_id VARCHAR(36),
        lesson_id VARCHAR(36),
        quiz_id VARCHAR(36),
        status ENUM('not_started', 'in_progress', 'completed', 'locked') NOT NULL DEFAULT 'not_started',
        progress_percentage INT NOT NULL DEFAULT 0,
        score INT,
        time_spent INT NOT NULL DEFAULT 0,
        last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_course_id (course_id),
        INDEX idx_module_id (module_id),
        INDEX idx_lesson_id (lesson_id),
        INDEX idx_quiz_id (quiz_id),
        INDEX idx_status (status),
        INDEX idx_user_course (user_id, course_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
        FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.query(createUserProgressTable);
    console.log('✅ User progress table created or already exists');

    // Create quiz_attempts table
    const createQuizAttemptsTable = `
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        quiz_id VARCHAR(36) NOT NULL,
        answers JSON NOT NULL,
        score INT NOT NULL DEFAULT 0,
        total_questions INT NOT NULL DEFAULT 0,
        correct_answers INT NOT NULL DEFAULT 0,
        time_spent INT NOT NULL DEFAULT 0,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        passed BOOLEAN NOT NULL DEFAULT FALSE,
        INDEX idx_user_id (user_id),
        INDEX idx_quiz_id (quiz_id),
        INDEX idx_user_quiz (user_id, quiz_id),
        INDEX idx_completed_at (completed_at),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.query(createQuizAttemptsTable);
    console.log('✅ Quiz attempts table created or already exists');

    await connection.end();
    console.log('🎉 Learning tables setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Learning tables setup failed:', error);
    process.exit(1);
  }
};

createLearningTables();
