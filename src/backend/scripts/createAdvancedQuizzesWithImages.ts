import { createConnection } from 'mysql2/promise';

interface AdvancedQuestion {
  text: string;
  type: 'multiple_choice' | 'true_false' | 'single_choice' | 'fill_in_blank' | 'essay';
  answers: {
    correct: number | boolean;
    options: string[];
  };
  explanation: string;
  points: number;
  imageUrl?: string;
  scenario?: string;
}

interface AdvancedQuiz {
  title: string;
  description: string;
  type: 'pre_assessment' | 'post_assessment' | 'practice' | 'final_exam';
  timeLimit: number;
  passingScore: number;
  maxAttempts: number;
  questions: AdvancedQuestion[];
}

const advancedQuizzes: AdvancedQuiz[] = [
  {
    title: "Advanced Network Security Analysis",
    description: "Complex scenarios involving network security analysis, incident response, and threat detection",
    type: "post_assessment",
    timeLimit: 45,
    passingScore: 80,
    maxAttempts: 3,
    questions: [
      {
        text: "You are analyzing a network diagram showing a corporate infrastructure. Based on the network topology, which security control would be MOST effective at preventing lateral movement after an initial breach?",
        type: "multiple_choice",
        answers: {
          correct: 2,
          options: [
            "Implementing a single firewall at the perimeter",
            "Using only endpoint antivirus software",
            "Implementing network segmentation with micro-segmentation",
            "Relying solely on user training and awareness"
          ]
        },
        explanation: "Network segmentation with micro-segmentation is the most effective control as it limits the blast radius of a breach by creating isolated network segments, preventing attackers from moving laterally across the network.",
        points: 3,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
        scenario: "Corporate network with multiple VLANs, DMZ, and internal segments"
      },
      {
        text: "Looking at this log analysis screenshot, what type of attack pattern is most likely occurring based on the failed login attempts and timing?",
        type: "multiple_choice",
        answers: {
          correct: 1,
          options: [
            "SQL Injection attack",
            "Brute force attack with credential stuffing",
            "Cross-site scripting (XSS)",
            "Man-in-the-middle attack"
          ]
        },
        explanation: "The pattern shows multiple failed login attempts with different usernames and common passwords, indicating a brute force attack combined with credential stuffing techniques.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Security log showing 50+ failed login attempts in 2 minutes"
      },
      {
        text: "In this incident response scenario, you discover a compromised server. The attacker has established persistence through a scheduled task. What is the FIRST step you should take?",
        type: "single_choice",
        answers: {
          correct: 0,
          options: [
            "Isolate the compromised system from the network",
            "Immediately terminate the malicious process",
            "Start forensic analysis on the system",
            "Notify all users about the security incident"
          ]
        },
        explanation: "Isolating the compromised system is the first priority to prevent further spread of the attack and contain the incident before conducting detailed analysis.",
        points: 3,
        imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
        scenario: "Incident response team discovering a server with suspicious scheduled tasks"
      },
      {
        text: "Analyzing this packet capture, identify the suspicious network traffic pattern that indicates a potential data exfiltration attempt.",
        type: "multiple_choice",
        answers: {
          correct: 3,
          options: [
            "High volume of HTTP requests to legitimate websites",
            "Normal DNS queries to company DNS servers",
            "Encrypted traffic to known cloud services",
            "Large amounts of data being sent to an unknown external IP during off-hours"
          ]
        },
        explanation: "Data exfiltration typically involves large amounts of data being sent to external, often unknown IP addresses, especially during off-hours when monitoring might be reduced.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
        scenario: "Network traffic analysis showing unusual data patterns"
      },
      {
        text: "Based on this vulnerability assessment report, which vulnerability should be prioritized for immediate patching?",
        type: "multiple_choice",
        answers: {
          correct: 1,
          options: [
            "Low-severity information disclosure in a non-critical system",
            "Critical remote code execution vulnerability in a public-facing web server",
            "Medium-severity privilege escalation in an internal application",
            "High-severity denial of service in a development environment"
          ]
        },
        explanation: "Critical remote code execution vulnerabilities in public-facing systems pose the highest risk as they can be exploited by external attackers to gain full control of the system.",
        points: 3,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Vulnerability scan results showing various severity levels"
      },
      {
        text: "In this phishing email analysis, what is the most sophisticated social engineering technique being used?",
        type: "multiple_choice",
        answers: {
          correct: 2,
          options: [
            "Using generic greetings like 'Dear Customer'",
            "Including obvious spelling errors",
            "Spoofing a legitimate company's email domain and using urgency tactics",
            "Sending from a clearly suspicious email address"
          ]
        },
        explanation: "Domain spoofing combined with urgency tactics is highly sophisticated as it makes the email appear legitimate while creating pressure to act quickly without thinking.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
        scenario: "Phishing email that appears to be from a legitimate bank with urgent action required"
      },
      {
        text: "Looking at this SIEM dashboard, which alert pattern indicates a potential advanced persistent threat (APT) campaign?",
        type: "multiple_choice",
        answers: {
          correct: 0,
          options: [
            "Low and slow activity over several weeks with lateral movement",
            "Single high-volume attack lasting one hour",
            "Multiple failed login attempts in one day",
            "Suspicious file downloads from known malicious sites"
          ]
        },
        explanation: "APT campaigns are characterized by low and slow activity over extended periods, with attackers taking time to move laterally and establish persistence.",
        points: 5,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "SIEM dashboard showing activity patterns over 30 days"
      },
      {
        text: "In this cloud security configuration review, which misconfiguration poses the greatest risk?",
        type: "multiple_choice",
        answers: {
          correct: 1,
          options: [
            "S3 bucket with public read access to non-sensitive data",
            "IAM role with excessive permissions attached to multiple resources",
            "CloudTrail logging disabled for a single region",
            "Security group allowing SSH from a specific IP range"
          ]
        },
        explanation: "IAM roles with excessive permissions can lead to privilege escalation and lateral movement, making it the highest risk among the options listed.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
        scenario: "AWS IAM configuration showing role permissions"
      },
      {
        text: "Based on this malware analysis report, what is the primary persistence mechanism used by this threat?",
        type: "single_choice",
        answers: {
          correct: 2,
          options: [
            "Registry key modification",
            "Scheduled task creation",
            "Service installation with system privileges",
            "Browser extension installation"
          ]
        },
        explanation: "Service installation with system privileges is the most persistent mechanism as it runs with high privileges and survives reboots.",
        points: 3,
        imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
        scenario: "Malware analysis showing various persistence techniques"
      },
      {
        text: "In this incident timeline, what phase of the cyber kill chain is represented by the attacker's actions?",
        type: "multiple_choice",
        answers: {
          correct: 3,
          options: [
            "Reconnaissance and weaponization",
            "Delivery and exploitation",
            "Installation and command & control",
            "Actions on objectives and data exfiltration"
          ]
        },
        explanation: "The timeline shows the attacker has moved beyond initial access and is now focused on achieving their ultimate goals, which represents the final phases of the kill chain.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Incident timeline showing progression from initial access to data theft"
      }
    ]
  },
  {
    title: "Advanced Penetration Testing Scenarios",
    description: "Real-world penetration testing scenarios with complex attack vectors and defense mechanisms",
    type: "practice",
    timeLimit: 60,
    passingScore: 85,
    maxAttempts: 2,
    questions: [
      {
        text: "You are conducting a penetration test on a web application. The application uses JWT tokens for authentication. Looking at this network capture, what vulnerability can you exploit?",
        type: "multiple_choice",
        answers: {
          correct: 1,
          options: [
            "SQL injection in the login form",
            "JWT token manipulation to escalate privileges",
            "Cross-site scripting in the search functionality",
            "Directory traversal in file upload feature"
          ]
        },
        explanation: "JWT tokens can be vulnerable to manipulation if not properly validated, allowing attackers to modify claims and escalate privileges.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Web application penetration test showing JWT token in request headers"
      },
      {
        text: "During a wireless penetration test, you discover this network configuration. What attack technique would be most effective?",
        type: "multiple_choice",
        answers: {
          correct: 2,
          options: [
            "WEP key cracking",
            "WPA2-PSK dictionary attack",
            "Evil twin attack with captive portal",
            "WPS PIN brute force attack"
          ]
        },
        explanation: "An evil twin attack with a captive portal is effective against WPA2-Enterprise networks as it can capture credentials when users connect to the fake access point.",
        points: 5,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
        scenario: "Wireless network scan showing WPA2-Enterprise configuration"
      },
      {
        text: "In this social engineering assessment, you need to gain physical access to the building. Which approach would be most effective?",
        type: "multiple_choice",
        answers: {
          correct: 0,
          options: [
            "Tailgating behind an employee with a fake ID badge",
            "Calling the receptionist and claiming to be from IT",
            "Sending a phishing email to employees",
            "Attempting to brute force the door access system"
          ]
        },
        explanation: "Tailgating is often the most effective physical social engineering technique as it exploits human nature and security fatigue.",
        points: 3,
        imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
        scenario: "Physical security assessment at corporate headquarters"
      },
      {
        text: "You've gained initial access to a Windows domain. Looking at this Active Directory enumeration output, what is your next step for privilege escalation?",
        type: "multiple_choice",
        answers: {
          correct: 3,
          options: [
            "Attempt to crack the domain administrator password",
            "Look for unpatched vulnerabilities on the domain controller",
            "Search for credentials in memory dumps",
            "Exploit misconfigured service accounts with excessive privileges"
          ]
        },
        explanation: "Service accounts with excessive privileges are common in Active Directory environments and often provide a path to domain escalation.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Active Directory enumeration showing service account permissions"
      },
      {
        text: "During a mobile application security assessment, you discover this API endpoint. What security issue should you report?",
        type: "multiple_choice",
        answers: {
          correct: 1,
          options: [
            "Missing HTTPS encryption",
            "Insecure direct object reference allowing access to other users' data",
            "Weak password requirements",
            "Insufficient session timeout"
          ]
        },
        explanation: "Insecure direct object references allow attackers to access data belonging to other users by manipulating object identifiers in requests.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
        scenario: "Mobile app API testing showing user data access patterns"
      },
      {
        text: "In this cloud penetration test, you've compromised an EC2 instance. What technique would help you maintain persistence?",
        type: "multiple_choice",
        answers: {
          correct: 2,
          options: [
            "Installing a rootkit on the instance",
            "Modifying the instance's security groups",
            "Creating a new IAM role with elevated permissions",
            "Changing the instance's public IP address"
          ]
        },
        explanation: "Creating a new IAM role with elevated permissions allows for persistent access even if the original instance is terminated.",
        points: 5,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "AWS EC2 instance compromise during cloud penetration test"
      },
      {
        text: "You're testing a web application's file upload functionality. Based on this request, what attack vector should you attempt?",
        type: "multiple_choice",
        answers: {
          correct: 0,
          options: [
            "Upload a malicious file with double extensions to bypass filters",
            "Attempt SQL injection through the filename parameter",
            "Use directory traversal in the upload path",
            "Try to upload an extremely large file to cause DoS"
          ]
        },
        explanation: "Double extensions (like .php.jpg) are a common technique to bypass file upload filters and execute malicious code.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
        scenario: "Web application file upload testing interface"
      },
      {
        text: "During a network penetration test, you discover this router configuration. What vulnerability can you exploit?",
        type: "multiple_choice",
        answers: {
          correct: 3,
          options: [
            "Default SNMP community strings",
            "Weak WPA2 encryption",
            "Open telnet port",
            "Unpatched firmware with known RCE vulnerability"
          ]
        },
        explanation: "Unpatched firmware with known remote code execution vulnerabilities is the most critical finding as it can lead to complete network compromise.",
        points: 5,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
        scenario: "Router configuration analysis showing firmware version and open ports"
      },
      {
        text: "In this API security assessment, you're testing for authentication bypasses. What technique would be most effective?",
        type: "multiple_choice",
        answers: {
          correct: 1,
          options: [
            "Brute force the API key",
            "Manipulate JWT token claims to bypass authorization",
            "Use SQL injection in the authentication endpoint",
            "Attempt to replay captured authentication requests"
          ]
        },
        explanation: "JWT token manipulation is often more effective than brute force as it exploits the application's logic rather than trying to guess credentials.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "API authentication testing with JWT tokens"
      },
      {
        text: "You're conducting a physical security assessment. Based on this building layout, what is the most vulnerable entry point?",
        type: "multiple_choice",
        answers: {
          correct: 2,
          options: [
            "Main entrance with security guard",
            "Employee parking garage with badge access",
            "Loading dock with minimal monitoring",
            "Emergency exit with alarm system"
          ]
        },
        explanation: "Loading docks often have minimal security monitoring and are used by various personnel, making them attractive entry points for attackers.",
        points: 3,
        imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
        scenario: "Building security assessment showing various entry points"
      }
    ]
  },
  {
    title: "Cybersecurity Fundamentals - Final Comprehensive Exam",
    description: "Comprehensive final exam covering all aspects of cybersecurity with real-world scenarios and complex problem-solving",
    type: "final_exam",
    timeLimit: 90,
    passingScore: 90,
    maxAttempts: 1,
    questions: [
      {
        text: "You are the CISO of a mid-size company that has just experienced a data breach. The breach involved 50,000 customer records including PII and financial data. Based on this incident response timeline, what is the MOST critical action you should take within the first 24 hours?",
        type: "multiple_choice",
        answers: {
          correct: 1,
          options: [
            "Notify all customers immediately about the breach",
            "Contain the breach and preserve evidence for forensic analysis",
            "Contact law enforcement and regulatory authorities",
            "Begin implementing additional security controls"
          ]
        },
        explanation: "Containing the breach and preserving evidence is the most critical first step to prevent further damage and ensure proper investigation can be conducted.",
        points: 5,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Data breach incident response timeline showing 24-hour critical actions"
      },
      {
        text: "Looking at this network architecture diagram, identify the security control that would be MOST effective at preventing the spread of ransomware across the network.",
        type: "multiple_choice",
        answers: {
          correct: 2,
          options: [
            "Installing antivirus on all endpoints",
            "Implementing a single firewall at the perimeter",
            "Network segmentation with micro-segmentation and zero-trust architecture",
            "Regular security awareness training for all employees"
          ]
        },
        explanation: "Network segmentation with micro-segmentation and zero-trust architecture is the most effective defense against ransomware as it limits lateral movement and enforces strict access controls.",
        points: 5,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
        scenario: "Corporate network architecture showing various security controls"
      },
      {
        text: "In this risk assessment matrix, which risk should be prioritized for immediate mitigation based on the likelihood and impact scores?",
        type: "multiple_choice",
        answers: {
          correct: 0,
          options: [
            "High likelihood, High impact: Unpatched critical vulnerability in public-facing web server",
            "Medium likelihood, High impact: Insider threat from disgruntled employee",
            "High likelihood, Medium impact: Phishing attacks targeting employees",
            "Low likelihood, High impact: Natural disaster affecting data center"
          ]
        },
        explanation: "High likelihood and high impact risks should always be prioritized first, especially unpatched vulnerabilities in public-facing systems that can be easily exploited.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Risk assessment matrix showing various cybersecurity risks"
      },
      {
        text: "Based on this compliance audit report, which control deficiency poses the GREATEST risk to the organization's compliance posture?",
        type: "multiple_choice",
        answers: {
          correct: 3,
          options: [
            "Missing documentation for security procedures",
            "Insufficient logging of user activities",
            "Outdated security policies",
            "Lack of encryption for sensitive data at rest and in transit"
          ]
        },
        explanation: "Lack of encryption for sensitive data is the most critical deficiency as it directly impacts data protection requirements and can result in significant regulatory penalties.",
        points: 5,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
        scenario: "Compliance audit report showing various control deficiencies"
      },
      {
        text: "You are designing a security awareness program for a 500-employee organization. Based on this threat landscape analysis, which training topic should be given the HIGHEST priority?",
        type: "multiple_choice",
        answers: {
          correct: 1,
          options: [
            "Password security and multi-factor authentication",
            "Phishing recognition and social engineering awareness",
            "Physical security and clean desk policies",
            "Incident reporting and escalation procedures"
          ]
        },
        explanation: "Phishing and social engineering are the most common attack vectors and should be prioritized in security awareness training as they target the human element.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
        scenario: "Threat landscape analysis showing attack vector frequency"
      },
      {
        text: "In this vulnerability management program, which approach would be MOST effective for prioritizing patch deployment?",
        type: "multiple_choice",
        answers: {
          correct: 2,
          options: [
            "Patch all systems on a monthly schedule regardless of severity",
            "Patch only critical vulnerabilities within 30 days",
            "Use a risk-based approach considering exploitability, impact, and asset criticality",
            "Patch vulnerabilities in order of discovery date"
          ]
        },
        explanation: "A risk-based approach that considers exploitability, impact, and asset criticality provides the most effective prioritization for patch management.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Vulnerability management dashboard showing various patch priorities"
      },
      {
        text: "Looking at this incident response playbook, what is the PRIMARY goal of the containment phase?",
        type: "multiple_choice",
        answers: {
          correct: 0,
          options: [
            "Prevent further damage and limit the scope of the incident",
            "Identify the root cause of the security incident",
            "Notify all stakeholders about the incident",
            "Begin the recovery and restoration process"
          ]
        },
        explanation: "The primary goal of containment is to prevent further damage and limit the scope of the incident to minimize business impact.",
        points: 3,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Incident response playbook showing containment phase procedures"
      },
      {
        text: "In this cloud security assessment, which misconfiguration represents the HIGHEST risk to data confidentiality?",
        type: "multiple_choice",
        answers: {
          correct: 1,
          options: [
            "S3 bucket with public read access to marketing materials",
            "Database with encryption disabled and public access allowed",
            "IAM user with read-only permissions to non-sensitive resources",
            "CloudTrail logging disabled for a single region"
          ]
        },
        explanation: "A database with encryption disabled and public access represents the highest risk as it exposes sensitive data to potential unauthorized access.",
        points: 5,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
        scenario: "Cloud security configuration review showing various misconfigurations"
      },
      {
        text: "Based on this threat intelligence report, which indicator of compromise (IoC) should trigger the HIGHEST priority alert?",
        type: "multiple_choice",
        answers: {
          correct: 3,
          options: [
            "Suspicious IP address from a known threat actor",
            "Malicious file hash associated with ransomware",
            "Suspicious domain name in DNS queries",
            "Command and control (C2) communication pattern matching known APT group"
          ]
        },
        explanation: "C2 communication patterns matching known APT groups indicate active, sophisticated threats that require immediate response due to their persistence and potential for significant damage.",
        points: 5,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Threat intelligence dashboard showing various IoCs and their severity"
      },
      {
        text: "You are implementing a zero-trust security model. Based on this network diagram, which component should be implemented FIRST?",
        type: "multiple_choice",
        answers: {
          correct: 2,
          options: [
            "Deploy network segmentation tools",
            "Implement identity and access management (IAM) solutions",
            "Establish identity verification and authentication for all users and devices",
            "Install network monitoring and analytics tools"
          ]
        },
        explanation: "Identity verification and authentication is the foundation of zero-trust, as it ensures that only verified users and devices can access resources before implementing other controls.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
        scenario: "Zero-trust architecture implementation roadmap"
      },
      {
        text: "In this business continuity plan, which recovery time objective (RTO) is MOST appropriate for critical business systems?",
        type: "multiple_choice",
        answers: {
          correct: 0,
          options: [
            "4 hours or less for critical systems",
            "24-48 hours for critical systems",
            "1 week for critical systems",
            "1 month for critical systems"
          ]
        },
        explanation: "Critical business systems typically require RTOs of 4 hours or less to minimize business impact and maintain operational continuity.",
        points: 3,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Business continuity plan showing RTO requirements for different system tiers"
      },
      {
        text: "Looking at this security metrics dashboard, which key performance indicator (KPI) is MOST important for measuring the effectiveness of the security program?",
        type: "multiple_choice",
        answers: {
          correct: 1,
          options: [
            "Number of security incidents reported per month",
            "Mean time to detect (MTTD) and mean time to respond (MTTR)",
            "Percentage of employees who completed security training",
            "Number of vulnerabilities identified during scans"
          ]
        },
        explanation: "MTTD and MTTR are critical KPIs as they measure how quickly the organization can detect and respond to security incidents, directly impacting the effectiveness of the security program.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Security metrics dashboard showing various KPIs and their trends"
      }
    ]
  }
];

async function createAdvancedQuizzes() {
  const connection = await createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cyber',
  });

  try {
    console.log('🚀 Starting creation of advanced quizzes with images...');

    // Get the course ID
    const [courses] = await connection.execute(
      'SELECT id FROM courses WHERE title = ?',
      ['Cybersecurity Fundamentals']
    ) as [any[], any];

    if (courses.length === 0) {
      throw new Error('Course not found');
    }

    const courseId = courses[0].id;
    console.log(`📚 Found course: ${courseId}`);

    // Get modules for the course
    const [modules] = await connection.execute(
      'SELECT id, title FROM modules WHERE course_id = ? ORDER BY `order` ASC',
      [courseId]
    ) as [any[], any];

    console.log(`📋 Found ${modules.length} modules`);

    for (const quiz of advancedQuizzes) {
      console.log(`\n🎯 Creating quiz: ${quiz.title}`);

      // Generate UUID for the quiz
      const quizId = require('crypto').randomUUID();
      
      // Create the quiz
      await connection.execute(
        `INSERT INTO quizzes (
          id, module_id, title, description, type, status, 
          time_limit, passing_score, max_attempts, is_active, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, 'published', ?, ?, ?, true, NOW(), NOW())`,
        [
          quizId,
          modules[0].id, // Use first module for all quizzes
          quiz.title,
          quiz.description,
          quiz.type,
          quiz.timeLimit,
          quiz.passingScore,
          quiz.maxAttempts
        ]
      );

      console.log(`✅ Created quiz with ID: ${quizId}`);

      // Create questions for the quiz
      for (let i = 0; i < quiz.questions.length; i++) {
        const question = quiz.questions[i];
        console.log(`  📝 Creating question ${i + 1}/${quiz.questions.length}: ${question.text.substring(0, 50)}...`);

        const questionId = require('crypto').randomUUID();
        await connection.execute(
          `INSERT INTO questions (
            id, quiz_id, text, type, answers, explanation, points, 
            \`order\`, is_active, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, true, NOW(), NOW())`,
          [
            questionId,
            quizId,
            question.text,
            question.type,
            JSON.stringify(question.answers),
            question.explanation,
            question.points,
            i + 1
          ]
        );
      }

      console.log(`✅ Created ${quiz.questions.length} questions for quiz: ${quiz.title}`);
    }

    console.log('\n🎉 Advanced quizzes with images created successfully!');
    console.log('📊 Summary:');
    console.log(`   - Total quizzes created: ${advancedQuizzes.length}`);
    console.log(`   - Total questions created: ${advancedQuizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0)}`);
    console.log(`   - Questions with images: ${advancedQuizzes.reduce((sum, quiz) => sum + quiz.questions.filter(q => q.imageUrl).length, 0)}`);

  } catch (error) {
    console.error('❌ Error creating advanced quizzes:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the script
createAdvancedQuizzes()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
