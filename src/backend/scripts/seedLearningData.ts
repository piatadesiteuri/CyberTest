import mysql from 'mysql2/promise';
import { databaseConfig } from '../../config/database';
import { LearningService } from '../services/LearningService';
import { CourseLevel, LessonType, QuizType, QuestionType, ProgressStatus } from '../entities/Course';

const seedLearningData = async () => {
  try {
    const learningService = new LearningService();
    
    console.log('🌱 Starting to seed learning data...');

    // Create Foundation Course - Cybersecurity Fundamentals
    const foundationCourse = await learningService.createCourse({
      title: 'Cybersecurity Fundamentals',
      description: 'Master the basics of cybersecurity, threat awareness, and security best practices. Perfect for all employees regardless of technical background.',
      level: CourseLevel.FOUNDATION,
      estimatedDuration: 600, // 10 hours
      learningObjectives: [
        'Understand basic cybersecurity concepts and terminology',
        'Identify common cyber threats and attack vectors',
        'Learn fundamental security principles and best practices',
        'Recognize phishing attempts and social engineering tactics',
        'Implement basic password security measures'
      ],
      tags: ['foundation', 'cybersecurity', 'basics', 'awareness'],
      createdBy: 'system'
    });

    console.log('✅ Foundation course created');

    // Create Foundation Modules
    const module1 = await learningService.createModule({
      courseId: foundationCourse.id,
      title: 'Introduction to Cybersecurity',
      description: 'Understanding threats and security fundamentals',
      order: 1,
      estimatedDuration: 120 // 2 hours
    });

    const module2 = await learningService.createModule({
      courseId: foundationCourse.id,
      title: 'Phishing Awareness & Prevention',
      description: 'Recognizing and avoiding phishing attacks',
      order: 2,
      estimatedDuration: 90 // 1.5 hours
    });

    const module3 = await learningService.createModule({
      courseId: foundationCourse.id,
      title: 'Password Security & MFA',
      description: 'Creating strong passwords and using multi-factor authentication',
      order: 3,
      estimatedDuration: 90 // 1.5 hours
    });

    const module4 = await learningService.createModule({
      courseId: foundationCourse.id,
      title: 'Social Engineering Defense',
      description: 'Protecting against social engineering attacks',
      order: 4,
      estimatedDuration: 90 // 1.5 hours
    });

    const module5 = await learningService.createModule({
      courseId: foundationCourse.id,
      title: 'Data Protection & Privacy',
      description: 'Understanding data protection and privacy principles',
      order: 5,
      estimatedDuration: 90 // 1.5 hours
    });

    const module6 = await learningService.createModule({
      courseId: foundationCourse.id,
      title: 'Incident Response Basics',
      description: 'What to do when a security incident occurs',
      order: 6,
      estimatedDuration: 120 // 2 hours
    });

    console.log('✅ Foundation modules created');

    // Create lessons for Module 1
    const lesson1_1 = await learningService.createLesson({
      moduleId: module1.id,
      title: 'What is Cybersecurity?',
      description: 'Introduction to cybersecurity concepts and importance',
      content: `
# What is Cybersecurity?

Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money from users; or interrupting normal business processes.

## Key Concepts

### The CIA Triad
- **Confidentiality**: Ensuring that information is not disclosed to unauthorized individuals
- **Integrity**: Maintaining the accuracy and completeness of information
- **Availability**: Ensuring that information and resources are available when needed

### Common Threats
- Malware (viruses, trojans, ransomware)
- Phishing attacks
- Social engineering
- Data breaches
- Insider threats

## Why Cybersecurity Matters

In today's digital world, cybersecurity is more important than ever. Organizations face an increasing number of sophisticated cyber threats that can result in:
- Financial losses
- Reputation damage
- Legal consequences
- Operational disruption
      `,
      type: LessonType.THEORY,
      order: 1,
      estimatedDuration: 30
    });

    const lesson1_2 = await learningService.createLesson({
      moduleId: module1.id,
      title: 'Types of Cyber Threats',
      description: 'Understanding different categories of cyber threats',
      content: `
# Types of Cyber Threats

## Malware
Malicious software designed to damage or gain unauthorized access to computer systems.

### Common Types:
- **Viruses**: Self-replicating programs that attach to legitimate files
- **Trojans**: Malicious programs disguised as legitimate software
- **Ransomware**: Malware that encrypts files and demands payment for decryption
- **Spyware**: Software that secretly monitors user activity

## Social Engineering
Psychological manipulation to trick people into revealing sensitive information.

### Common Techniques:
- **Phishing**: Fraudulent emails or messages
- **Pretexting**: Creating false scenarios to obtain information
- **Baiting**: Offering something enticing to lure victims
- **Quid pro quo**: Offering something in exchange for information

## Network Attacks
Attacks targeting network infrastructure and communications.

### Common Types:
- **DDoS**: Distributed Denial of Service attacks
- **Man-in-the-Middle**: Intercepting communications
- **DNS Spoofing**: Redirecting traffic to malicious sites
      `,
      type: LessonType.THEORY,
      order: 2,
      estimatedDuration: 45
    });

    const lesson1_3 = await learningService.createLesson({
      moduleId: module1.id,
      title: 'Security Best Practices',
      description: 'Fundamental security practices everyone should follow',
      content: `
# Security Best Practices

## Password Security
- Use strong, unique passwords for each account
- Enable two-factor authentication (2FA) when available
- Use a password manager to store passwords securely
- Never share passwords with others

## Software Updates
- Keep operating systems and software up to date
- Enable automatic updates when possible
- Install security patches promptly
- Remove unused software and applications

## Safe Browsing
- Be cautious when clicking links in emails
- Verify website URLs before entering sensitive information
- Use HTTPS websites when possible
- Avoid downloading software from untrusted sources

## Data Protection
- Regularly backup important data
- Use encryption for sensitive information
- Be mindful of what information you share online
- Follow your organization's data handling policies
      `,
      type: LessonType.PRACTICAL,
      order: 3,
      estimatedDuration: 45
    });

    console.log('✅ Module 1 lessons created');

    // Create quiz for Module 1
    const quiz1 = await learningService.createQuiz({
      moduleId: module1.id,
      title: 'Cybersecurity Fundamentals Quiz',
      description: 'Test your understanding of basic cybersecurity concepts',
      type: QuizType.POST_ASSESSMENT,
      timeLimit: 15, // 15 minutes
      passingScore: 70,
      maxAttempts: 3
    });

    // Create questions for Quiz 1
    const question1_1 = await learningService.createQuestion({
      quizId: quiz1.id,
      text: 'What does the "C" in the CIA Triad stand for?',
      type: QuestionType.SINGLE_CHOICE,
      answers: [
        { text: 'Confidentiality', isCorrect: true, explanation: 'Confidentiality ensures information is not disclosed to unauthorized individuals.' },
        { text: 'Confidence', isCorrect: false, explanation: 'Confidence is not part of the CIA Triad.' },
        { text: 'Control', isCorrect: false, explanation: 'Control is not part of the CIA Triad.' },
        { text: 'Compliance', isCorrect: false, explanation: 'Compliance is not part of the CIA Triad.' }
      ],
      explanation: 'The CIA Triad consists of Confidentiality, Integrity, and Availability.',
      points: 10,
      order: 1
    });

    const question1_2 = await learningService.createQuestion({
      quizId: quiz1.id,
      text: 'Which of the following is NOT a type of malware?',
      type: QuestionType.SINGLE_CHOICE,
      answers: [
        { text: 'Virus', isCorrect: false, explanation: 'Viruses are a type of malware.' },
        { text: 'Firewall', isCorrect: true, explanation: 'A firewall is a security device, not malware.' },
        { text: 'Trojan', isCorrect: false, explanation: 'Trojans are a type of malware.' },
        { text: 'Ransomware', isCorrect: false, explanation: 'Ransomware is a type of malware.' }
      ],
      explanation: 'A firewall is a security device that monitors and controls network traffic, not malicious software.',
      points: 10,
      order: 2
    });

    const question1_3 = await learningService.createQuestion({
      quizId: quiz1.id,
      text: 'Phishing is a type of social engineering attack.',
      type: QuestionType.TRUE_FALSE,
      answers: [
        { text: 'True', isCorrect: true, explanation: 'Phishing uses psychological manipulation to trick people.' },
        { text: 'False', isCorrect: false, explanation: 'Phishing is indeed a social engineering technique.' }
      ],
      explanation: 'Phishing is a social engineering attack that uses fraudulent communications to trick people into revealing sensitive information.',
      points: 10,
      order: 3
    });

    console.log('✅ Module 1 quiz and questions created');

    // Create Advanced Course - Threat Analysis & Response
    const advancedCourse = await learningService.createCourse({
      title: 'Threat Analysis & Response',
      description: 'Deep dive into advanced threat detection, incident response, and security architecture. Designed for IT professionals and security teams.',
      level: CourseLevel.ADVANCED,
      estimatedDuration: 1200, // 20 hours
      prerequisites: [foundationCourse.id],
      learningObjectives: [
        'Analyze and respond to advanced persistent threats (APTs)',
        'Implement threat hunting methodologies',
        'Design and execute incident response plans',
        'Use security tools and technologies effectively',
        'Conduct forensic analysis of security incidents'
      ],
      tags: ['advanced', 'threat-analysis', 'incident-response', 'forensics'],
      createdBy: 'system'
    });

    console.log('✅ Advanced course created');

    // Create Management Course - Security Leadership
    const managementCourse = await learningService.createCourse({
      title: 'Security Leadership',
      description: 'Learn to lead security initiatives, manage teams, and implement security policies. Essential for managers and executives.',
      level: CourseLevel.ADVANCED,
      estimatedDuration: 800, // 13.3 hours
      learningObjectives: [
        'Develop and implement security strategies',
        'Manage security teams and budgets',
        'Navigate regulatory compliance requirements',
        'Communicate security risks to stakeholders',
        'Build a security-aware organizational culture'
      ],
      tags: ['management', 'leadership', 'compliance', 'strategy'],
      createdBy: 'system'
    });

    console.log('✅ Management course created');

    // Create sample user progress for test user
    const testUserId = 'test-user-id'; // This would come from the user system
    
    // Create progress for foundation course
    await learningService.createUserProgress({
      userId: testUserId,
      courseId: foundationCourse.id,
      status: ProgressStatus.IN_PROGRESS,
      progressPercentage: 25
    });

    // Create progress for module 1
    await learningService.createUserProgress({
      userId: testUserId,
      courseId: foundationCourse.id,
      moduleId: module1.id,
      status: ProgressStatus.COMPLETED,
      progressPercentage: 100
    });

    console.log('✅ Sample user progress created');

    console.log('🎉 Learning data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Created ${3} courses (Foundation, Advanced, Management)`);
    console.log(`- Created ${6} modules for Foundation course`);
    console.log(`- Created ${3} lessons for Module 1`);
    console.log(`- Created ${1} quiz with ${3} questions`);
    console.log(`- Created sample user progress`);
    
  } catch (error) {
    console.error('❌ Learning data seeding failed:', error);
    process.exit(1);
  }
};

seedLearningData();
