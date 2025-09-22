import mysql from 'mysql2/promise';
import { databaseConfig } from '../../config/database';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const setupCompleteDatabase = async () => {
  try {
    console.log('🚀 Setting up complete database with all content...');

    // Connect to MySQL
    const connection = await mysql.createConnection({
      host: databaseConfig.host,
      port: databaseConfig.port,
      user: databaseConfig.user,
      password: databaseConfig.password,
      database: databaseConfig.database,
    });

    console.log('🔌 Connected to MySQL database');

    // 1. Create all tables
    console.log('\n📋 Creating all tables...');
    
    // Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        department VARCHAR(100) NOT NULL,
        role ENUM('employee', 'manager', 'admin', 'it_security_admin', 'ciso') NOT NULL DEFAULT 'employee',
        is_active BOOLEAN DEFAULT TRUE,
        email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login_at TIMESTAMP NULL,
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_department (department),
        INDEX idx_is_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Courses table
    await connection.execute(`
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
        INDEX idx_created_by (created_by)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Modules table
    await connection.execute(`
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
        INDEX idx_is_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Lessons table
    await connection.execute(`
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
        INDEX idx_is_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Quizzes table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id VARCHAR(36) PRIMARY KEY,
        module_id VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        type ENUM('pre_assessment', 'post_assessment', 'practice', 'final_exam') NOT NULL DEFAULT 'post_assessment',
        status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
        time_limit INT NOT NULL DEFAULT 30,
        passing_score INT NOT NULL DEFAULT 70,
        max_attempts INT NOT NULL DEFAULT 3,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_module_id (module_id),
        INDEX idx_type (type),
        INDEX idx_status (status),
        INDEX idx_is_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Questions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS questions (
        id VARCHAR(36) PRIMARY KEY,
        quiz_id VARCHAR(36) NOT NULL,
        text TEXT NOT NULL,
        type ENUM('multiple_choice', 'true_false', 'fill_blank', 'essay') NOT NULL DEFAULT 'multiple_choice',
        answers JSON NOT NULL,
        explanation TEXT,
        points INT NOT NULL DEFAULT 1,
        \`order\` INT NOT NULL DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_quiz_id (quiz_id),
        INDEX idx_order (quiz_id, \`order\`),
        INDEX idx_is_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // User progress table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        course_id VARCHAR(36) NOT NULL,
        module_id VARCHAR(36),
        lesson_id VARCHAR(36),
        quiz_id VARCHAR(36),
        progress_type ENUM('course', 'module', 'lesson', 'quiz') NOT NULL,
        status ENUM('not_started', 'in_progress', 'completed', 'failed') NOT NULL DEFAULT 'not_started',
        score INT DEFAULT NULL,
        time_spent INT DEFAULT 0,
        completed_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_course_id (course_id),
        INDEX idx_module_id (module_id),
        INDEX idx_lesson_id (lesson_id),
        INDEX idx_quiz_id (quiz_id),
        INDEX idx_progress_type (progress_type),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ All tables created');

    // 2. Create admin user
    console.log('\n👤 Creating admin user...');
    const adminId = uuidv4();
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await connection.execute(`
      INSERT IGNORE INTO users (id, email, password, first_name, last_name, department, role, is_active, email_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [adminId, 'admin@cybertest.com', hashedPassword, 'Admin', 'User', 'IT Security', 'admin', true, true]);

    console.log('✅ Admin user created');

    // 3. Create sample course
    console.log('\n📚 Creating sample course...');
    const courseId = uuidv4();
    
    await connection.execute(`
      INSERT IGNORE INTO courses (id, title, description, level, status, estimated_duration, learning_objectives, tags, is_active, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      courseId,
      'Cybersecurity Fundamentals',
      'A comprehensive introduction to cybersecurity concepts, threats, and best practices for all employees.',
      'foundation',
      'published',
      120, // 2 hours
      JSON.stringify([
        'Understand basic cybersecurity concepts',
        'Identify common cyber threats',
        'Apply security best practices',
        'Recognize phishing attempts'
      ]),
      JSON.stringify(['cybersecurity', 'fundamentals', 'security-awareness', 'phishing']),
      true,
      adminId
    ]);

    console.log('✅ Course created');

    // 4. Create modules
    console.log('\n📋 Creating modules...');
    const modules = [
      {
        id: uuidv4(),
        title: 'Introduction to Cybersecurity',
        description: 'Understanding the basics of cybersecurity and why it matters',
        order: 1,
        duration: 30
      },
      {
        id: uuidv4(),
        title: 'Common Cyber Threats',
        description: 'Learning about phishing, malware, and other common attacks',
        order: 2,
        duration: 45
      },
      {
        id: uuidv4(),
        title: 'Security Best Practices',
        description: 'Implementing strong passwords, secure browsing, and data protection',
        order: 3,
        duration: 45
      }
    ];

    for (const module of modules) {
      await connection.execute(`
        INSERT IGNORE INTO modules (id, course_id, title, description, \`order\`, estimated_duration, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [module.id, courseId, module.title, module.description, module.order, module.duration, true]);
    }

    console.log('✅ Modules created');

    // 5. Create lessons
    console.log('\n📖 Creating lessons...');
    const lessons = [
      // Module 1 lessons
      {
        id: uuidv4(),
        module_id: modules[0].id,
        title: 'What is Cybersecurity?',
        description: 'Understanding the importance of cybersecurity in today\'s digital world',
        content: 'Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks...',
        type: 'theory',
        order: 1,
        duration: 15
      },
      {
        id: uuidv4(),
        module_id: modules[0].id,
        title: 'The CIA Triad',
        description: 'Confidentiality, Integrity, and Availability - the three pillars of cybersecurity',
        content: 'The CIA Triad forms the foundation of cybersecurity...',
        type: 'theory',
        order: 2,
        duration: 15
      },
      // Module 2 lessons
      {
        id: uuidv4(),
        module_id: modules[1].id,
        title: 'Understanding Phishing',
        description: 'How to identify and avoid phishing attacks',
        content: 'Phishing is a type of social engineering attack...',
        type: 'practical',
        order: 1,
        duration: 20
      },
      {
        id: uuidv4(),
        module_id: modules[1].id,
        title: 'Malware and Ransomware',
        description: 'Types of malicious software and how to protect against them',
        content: 'Malware is any software intentionally designed to cause damage...',
        type: 'theory',
        order: 2,
        duration: 25
      },
      // Module 3 lessons
      {
        id: uuidv4(),
        module_id: modules[2].id,
        title: 'Strong Password Management',
        description: 'Creating and managing secure passwords',
        content: 'Strong passwords are your first line of defense...',
        type: 'practical',
        order: 1,
        duration: 20
      },
      {
        id: uuidv4(),
        module_id: modules[2].id,
        title: 'Safe Browsing Practices',
        description: 'How to browse the internet safely and avoid malicious websites',
        content: 'Safe browsing involves being cautious about the websites you visit...',
        type: 'practical',
        order: 2,
        duration: 25
      }
    ];

    for (const lesson of lessons) {
      await connection.execute(`
        INSERT IGNORE INTO lessons (id, module_id, title, description, content, type, \`order\`, estimated_duration, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [lesson.id, lesson.module_id, lesson.title, lesson.description, lesson.content, lesson.type, lesson.order, lesson.duration, true]);
    }

    console.log('✅ Lessons created');

    // 6. Create quizzes
    console.log('\n🎯 Creating quizzes...');
    const quizzes = [
      {
        id: uuidv4(),
        module_id: modules[0].id,
        title: 'Module 1 Assessment',
        description: 'Test your understanding of cybersecurity fundamentals',
        type: 'post_assessment',
        time_limit: 15,
        passing_score: 70,
        max_attempts: 3
      },
      {
        id: uuidv4(),
        module_id: modules[1].id,
        title: 'Module 2 Assessment',
        description: 'Test your knowledge of common cyber threats',
        type: 'post_assessment',
        time_limit: 20,
        passing_score: 75,
        max_attempts: 3
      },
      {
        id: uuidv4(),
        module_id: modules[2].id,
        title: 'Module 3 Assessment',
        description: 'Test your understanding of security best practices',
        type: 'post_assessment',
        time_limit: 20,
        passing_score: 80,
        max_attempts: 3
      }
    ];

    for (const quiz of quizzes) {
      await connection.execute(`
        INSERT IGNORE INTO quizzes (id, module_id, title, description, type, status, time_limit, passing_score, max_attempts, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [quiz.id, quiz.module_id, quiz.title, quiz.description, quiz.type, 'published', quiz.time_limit, quiz.passing_score, quiz.max_attempts, true]);
    }

    console.log('✅ Quizzes created');

    // 7. Create questions for first quiz
    console.log('\n❓ Creating quiz questions...');
    const questions = [
      {
        id: uuidv4(),
        quiz_id: quizzes[0].id,
        text: 'What does CIA stand for in cybersecurity?',
        type: 'multiple_choice',
        answers: JSON.stringify({
          options: [
            'Central Intelligence Agency',
            'Confidentiality, Integrity, Availability',
            'Computer Information Analysis',
            'Cyber Intelligence Assessment'
          ],
          correct: 1
        }),
        explanation: 'CIA in cybersecurity stands for Confidentiality, Integrity, and Availability - the three core principles of information security.',
        points: 1,
        order: 1
      },
      {
        id: uuidv4(),
        quiz_id: quizzes[0].id,
        text: 'Which of the following is NOT a common cyber threat?',
        type: 'multiple_choice',
        answers: JSON.stringify({
          options: [
            'Phishing',
            'Malware',
            'Good weather',
            'Ransomware'
          ],
          correct: 2
        }),
        explanation: 'Good weather is not a cyber threat. Phishing, malware, and ransomware are all common cyber threats.',
        points: 1,
        order: 2
      },
      {
        id: uuidv4(),
        quiz_id: quizzes[0].id,
        text: 'Cybersecurity is only important for large companies.',
        type: 'true_false',
        answers: JSON.stringify({
          correct: false
        }),
        explanation: 'Cybersecurity is important for organizations of all sizes, as well as individuals.',
        points: 1,
        order: 3
      }
    ];

    for (const question of questions) {
      await connection.execute(`
        INSERT IGNORE INTO questions (id, quiz_id, text, type, answers, explanation, points, \`order\`, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [question.id, question.quiz_id, question.text, question.type, question.answers, question.explanation, question.points, question.order, true]);
    }

    console.log('✅ Questions created');

    await connection.end();
    console.log('\n🎉 Complete database setup finished successfully!');
    console.log('📊 Summary:');
    console.log('   - 1 course created');
    console.log('   - 3 modules created');
    console.log('   - 6 lessons created');
    console.log('   - 3 quizzes created');
    console.log('   - 3 questions created');
    console.log('   - Admin user: admin@cybertest.com / admin123');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  setupCompleteDatabase()
    .then(() => {
      console.log('🎉 Setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Setup failed:', error);
      process.exit(1);
    });
}

export { setupCompleteDatabase };
