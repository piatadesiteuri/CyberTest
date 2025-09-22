import mysql from 'mysql2/promise';
const { v4: uuidv4 } = require('uuid');
import { databaseConfig } from '../../config/database';

const createAdvancedLearningContent = async () => {
  try {
    // Connect to MySQL
    const connection = await mysql.createConnection({
      host: databaseConfig.host,
      port: databaseConfig.port,
      user: databaseConfig.user,
      password: databaseConfig.password,
      database: databaseConfig.database,
    });

    console.log('🚀 Creating advanced learning content...');

    // Get the Cybersecurity Fundamentals course
    const [courseRows] = await connection.execute(
      'SELECT id FROM courses WHERE title = ?',
      ['Cybersecurity Fundamentals']
    );

    if ((courseRows as any[]).length === 0) {
      throw new Error('Cybersecurity Fundamentals course not found');
    }

    const courseId = (courseRows as any[])[0].id;
    console.log('📚 Found course:', courseId);

    // Get modules for this course
    const [moduleRows] = await connection.execute(
      'SELECT id, title FROM modules WHERE course_id = ? ORDER BY `order`',
      [courseId]
    );

    const modules = moduleRows as any[];
    console.log('📖 Found modules:', modules.length);

    // Create advanced quizzes for each module
    for (let i = 0; i < modules.length; i++) {
      const module = modules[i];
      console.log(`\n🎯 Creating quizzes for module: ${module.title}`);

      // Create module quiz (unlocked after completing all lessons in module)
      const moduleQuizId = uuidv4();
      await connection.execute(
        `INSERT INTO quizzes (id, module_id, title, description, type, status, time_limit, passing_score, max_attempts, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          moduleQuizId,
          module.id,
          `${module.title} - Module Assessment`,
          `Comprehensive assessment for ${module.title}. This quiz tests your understanding of all concepts covered in this module through practical scenarios and real-world applications.`,
          'post_assessment',
          'published',
          30, // 30 minutes
          75, // 75% to pass
          3,  // 3 attempts max
          true
        ]
      );

      // Create questions for module quiz
      await createModuleQuizQuestions(connection, moduleQuizId, module.title);

      // Create practice quiz (unlocked after completing module quiz)
      const practiceQuizId = uuidv4();
      await connection.execute(
        `INSERT INTO quizzes (id, module_id, title, description, type, status, time_limit, passing_score, max_attempts, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          practiceQuizId,
          module.id,
          `${module.title} - Practice Quiz`,
          `Practice quiz for ${module.title}. Test your knowledge with additional scenarios and reinforce your learning.`,
          'practice',
          'published',
          20, // 20 minutes
          70, // 70% to pass
          5,  // 5 attempts max
          true
        ]
      );

      // Create questions for practice quiz
      await createPracticeQuizQuestions(connection, practiceQuizId, module.title);
    }

    // Create final comprehensive exam (unlocked only at 100% course progress)
    const finalExamId = uuidv4();
    await connection.execute(
      `INSERT INTO quizzes (id, module_id, title, description, type, status, time_limit, passing_score, max_attempts, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        finalExamId,
        modules[0].id, // Use first module as parent
        'Cybersecurity Fundamentals - Final Comprehensive Exam',
        'Final comprehensive examination covering all aspects of cybersecurity fundamentals. This advanced test includes complex scenarios, case studies, and practical problem-solving questions. Only available after completing 100% of the course content.',
        'final_exam',
        'published',
        120, // 2 hours
        80,  // 80% to pass
        2,   // 2 attempts max
        true
      ]
    );

    // Create comprehensive final exam questions
    await createFinalExamQuestions(connection, finalExamId);

    console.log('\n✅ Advanced learning content created successfully!');
    console.log('📊 Created:');
    console.log(`   - ${modules.length} module assessment quizzes`);
    console.log(`   - ${modules.length} practice quizzes`);
    console.log('   - 1 comprehensive final exam');
    console.log('   - Multiple advanced questions per quiz');

    await connection.end();
  } catch (error) {
    console.error('❌ Error creating advanced learning content:', error);
    throw error;
  }
};

const createModuleQuizQuestions = async (connection: mysql.Connection, quizId: string, moduleTitle: string) => {
  const questions = [
    {
      text: `In the context of ${moduleTitle}, which of the following represents the most critical security principle?`,
      type: 'multiple_choice',
      answers: {
        options: [
          'Confidentiality, Integrity, and Availability (CIA Triad)',
          'Defense in depth strategy',
          'Least privilege access control',
          'All of the above are equally critical'
        ],
        correct: 3
      },
      explanation: 'All three principles (CIA Triad, Defense in depth, and Least privilege) are fundamental security concepts that work together to create a comprehensive security framework.',
      points: 2
    },
    {
      text: `A company's ${moduleTitle} program should include which of the following components?`,
      type: 'multiple_choice',
      answers: {
        options: [
          'Regular security awareness training',
          'Incident response procedures',
          'Risk assessment and management',
          'All of the above'
        ],
        correct: 3
      },
      explanation: 'A comprehensive security program must include training, incident response, and risk management to be effective.',
      points: 2
    },
    {
      text: `Which statement best describes the relationship between ${moduleTitle} and organizational risk management?`,
      type: 'multiple_choice',
      answers: {
        options: [
          'Security is a subset of risk management',
          'Risk management is a subset of security',
          'They are completely separate disciplines',
          'They are identical concepts'
        ],
        correct: 0
      },
      explanation: 'Security is one component of a broader risk management strategy that addresses various types of organizational risks.',
      points: 3
    },
    {
      text: `In a real-world scenario involving ${moduleTitle}, what should be the first step when a security incident is detected?`,
      type: 'multiple_choice',
      answers: {
        options: [
          'Immediately contain the threat',
          'Document everything for legal purposes',
          'Notify senior management',
          'Assess the scope and impact'
        ],
        correct: 0
      },
      explanation: 'Containing the threat is the immediate priority to prevent further damage, followed by assessment and documentation.',
      points: 3
    },
    {
      text: `True or False: ${moduleTitle} policies should be reviewed and updated annually regardless of changes in the threat landscape.`,
      type: 'true_false',
      answers: {
        correct: false
      },
      explanation: 'Security policies should be reviewed more frequently, especially when there are significant changes in the threat landscape, technology, or business operations.',
      points: 1
    }
  ];

  for (const question of questions) {
    const questionId = uuidv4();
    await connection.execute(
      `INSERT INTO questions (id, quiz_id, text, type, answers, explanation, points, \`order\`, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        questionId,
        quizId,
        question.text,
        question.type,
        JSON.stringify(question.answers),
        question.explanation,
        question.points,
        questions.indexOf(question) + 1,
        true
      ]
    );
  }
};

const createPracticeQuizQuestions = async (connection: mysql.Connection, quizId: string, moduleTitle: string) => {
  const questions = [
    {
      text: `Which of the following is NOT a common attack vector in ${moduleTitle}?`,
      type: 'multiple_choice',
      answers: {
        options: [
          'Social engineering',
          'Malware infections',
          'Physical security breaches',
          'Gravitational waves'
        ],
        correct: 3
      },
      explanation: 'Gravitational waves are a physics phenomenon and not related to cybersecurity attack vectors.',
      points: 1
    },
    {
      text: `What percentage of security breaches are estimated to involve human error in ${moduleTitle}?`,
      type: 'multiple_choice',
      answers: {
        options: [
          '25-30%',
          '45-50%',
          '70-80%',
          '90-95%'
        ],
        correct: 2
      },
      explanation: 'Studies consistently show that 70-80% of security breaches involve human error, making awareness training crucial.',
      points: 2
    },
    {
      text: `In ${moduleTitle}, what does the term "zero-day" refer to?`,
      type: 'multiple_choice',
      answers: {
        options: [
          'A vulnerability with no known fix',
          'A day with no security incidents',
          'A new security protocol',
          'A type of encryption'
        ],
        correct: 0
      },
      explanation: 'A zero-day vulnerability is a security flaw that is unknown to the vendor and has no available patch.',
      points: 2
    }
  ];

  for (const question of questions) {
    const questionId = uuidv4();
    await connection.execute(
      `INSERT INTO questions (id, quiz_id, text, type, answers, explanation, points, \`order\`, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        questionId,
        quizId,
        question.text,
        question.type,
        JSON.stringify(question.answers),
        question.explanation,
        question.points,
        questions.indexOf(question) + 1,
        true
      ]
    );
  }
};

const createFinalExamQuestions = async (connection: mysql.Connection, quizId: string) => {
  const questions = [
    {
      text: 'You are the CISO of a mid-size company. A security breach has been detected involving unauthorized access to customer data. The breach appears to have been ongoing for 3 weeks. What is your immediate priority?',
      type: 'multiple_choice',
      answers: {
        options: [
          'Notify law enforcement immediately',
          'Contain the breach and assess the damage',
          'Prepare a public statement',
          'Conduct a full security audit'
        ],
        correct: 1
      },
      explanation: 'The immediate priority is to contain the breach to prevent further damage, then assess the scope and impact before taking other actions.',
      points: 5
    },
    {
      text: 'A company is implementing a new cloud-based system. Which security considerations are MOST critical during the planning phase?',
      type: 'multiple_choice',
      answers: {
        options: [
          'Data encryption and access controls',
          'Network segmentation and monitoring',
          'Compliance requirements and data residency',
          'All of the above are equally critical'
        ],
        correct: 3
      },
      explanation: 'All aspects (encryption, access controls, network security, compliance) must be considered together for a comprehensive security strategy.',
      points: 4
    },
    {
      text: 'True or False: A strong password policy alone is sufficient to protect against most cyber attacks.',
      type: 'true_false',
      answers: {
        correct: false
      },
      explanation: 'While strong passwords are important, they are just one layer of security. A comprehensive approach including MFA, monitoring, and user training is necessary.',
      points: 2
    },
    {
      text: 'In a phishing simulation, 40% of employees clicked on a suspicious link. What should be the next step?',
      type: 'multiple_choice',
      answers: {
        options: [
          'Discipline the employees who failed',
          'Increase security awareness training',
          'Implement additional technical controls',
          'Both B and C'
        ],
        correct: 3
      },
      explanation: 'Both increased training and technical controls (like email filtering) are needed to address the high failure rate.',
      points: 4
    },
    {
      text: 'A ransomware attack has encrypted critical business files. The attackers are demanding payment. What should be the response?',
      type: 'multiple_choice',
      answers: {
        options: [
          'Pay the ransom immediately to restore operations',
          'Never pay the ransom under any circumstances',
          'Assess the situation and consider all options',
          'Ignore the attack and hope it resolves itself'
        ],
        correct: 2
      },
      explanation: 'Each situation is unique. Consider factors like backup availability, business impact, and legal implications before deciding.',
      points: 5
    },
    {
      text: 'Which of the following represents the BEST approach to cybersecurity risk management?',
      type: 'multiple_choice',
      answers: {
        options: [
          'Implement the most advanced security technologies available',
          'Focus primarily on compliance requirements',
          'Adopt a risk-based approach with continuous monitoring',
          'Deploy multiple layers of identical security controls'
        ],
        correct: 2
      },
      explanation: 'A risk-based approach that continuously monitors and adapts to changing threats is most effective for long-term security.',
      points: 4
    },
    {
      text: 'An employee reports receiving a suspicious email that appears to be from the IT department asking for login credentials. What should they do?',
      type: 'multiple_choice',
      answers: {
        options: [
          'Reply with their credentials to verify authenticity',
          'Forward the email to IT security and delete it',
          'Click on any links to see what happens',
          'Ignore the email completely'
        ],
        correct: 1
      },
      explanation: 'Suspicious emails should be reported to IT security immediately and then deleted to prevent accidental interaction.',
      points: 3
    },
    {
      text: 'True or False: Small businesses are less likely to be targeted by cybercriminals because they have less valuable data.',
      type: 'true_false',
      answers: {
        correct: false
      },
      explanation: 'Small businesses are often targeted because they typically have weaker security measures and can serve as entry points to larger networks.',
      points: 2
    },
    {
      text: 'What is the PRIMARY purpose of a Security Operations Center (SOC)?',
      type: 'multiple_choice',
      answers: {
        options: [
          'To develop security policies and procedures',
          'To monitor, detect, and respond to security incidents',
          'To conduct security awareness training',
          'To manage user access and permissions'
        ],
        correct: 1
      },
      explanation: 'A SOC is primarily responsible for continuous monitoring and incident response, not policy development or training.',
      points: 3
    },
    {
      text: 'In the context of incident response, what does "containment" mean?',
      type: 'multiple_choice',
      answers: {
        options: [
          'Preventing the incident from spreading or causing more damage',
          'Documenting all evidence for legal proceedings',
          'Notifying all stakeholders about the incident',
          'Restoring all systems to their previous state'
        ],
        correct: 0
      },
      explanation: 'Containment is the immediate step to isolate and prevent the incident from spreading to other systems or networks.',
      points: 3
    }
  ];

  for (const question of questions) {
    const questionId = uuidv4();
    await connection.execute(
      `INSERT INTO questions (id, quiz_id, text, type, answers, explanation, points, \`order\`, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        questionId,
        quizId,
        question.text,
        question.type,
        JSON.stringify(question.answers),
        question.explanation,
        question.points,
        questions.indexOf(question) + 1,
        true
      ]
    );
  }
};

// Run the script if called directly
if (require.main === module) {
  createAdvancedLearningContent()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

export default createAdvancedLearningContent;
