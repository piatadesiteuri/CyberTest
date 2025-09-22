import mysql from 'mysql2/promise';
import { databaseConfig } from '../../config/database';
const { v4: uuidv4 } = require('uuid');

const createAdvancedQuiz = async () => {
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

    // First, let's find the Cybersecurity Fundamentals course and its first module
    const [courses] = await connection.execute(
      'SELECT id FROM courses WHERE title = "Cybersecurity Fundamentals" AND level = "foundation"'
    );

    if ((courses as any[]).length === 0) {
      console.log('❌ Cybersecurity Fundamentals course not found');
      await connection.end();
      return;
    }

    const courseId = (courses as any[])[0].id;
    console.log('✅ Found course:', courseId);

    // Find the first module
    const [modules] = await connection.execute(
      'SELECT id FROM modules WHERE course_id = ? ORDER BY `order` LIMIT 1',
      [courseId]
    );

    if ((modules as any[]).length === 0) {
      console.log('❌ No modules found for course');
      await connection.end();
      return;
    }

    const moduleId = (modules as any[])[0].id;
    console.log('✅ Found module:', moduleId);

    // Create advanced quiz
    const quizId = uuidv4();
    await connection.execute(
      `INSERT INTO quizzes (id, module_id, title, description, type, status, time_limit, passing_score, max_attempts, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        quizId,
        moduleId,
        'Advanced Cybersecurity Fundamentals Assessment',
        'Comprehensive assessment covering real-world cybersecurity scenarios, threat analysis, and practical problem-solving. This quiz tests deep understanding through complex scenarios, case studies, and multi-part questions.',
        'post_assessment',
        'published',
        1800, // 30 minutes
        75,   // 75% to pass
        3,    // 3 attempts max
        true
      ]
    );

    console.log('✅ Created advanced quiz:', quizId);

    // Advanced Questions with real-world scenarios
    const advancedQuestions = [
      {
        id: uuidv4(),
        text: `**Scenario Analysis**: A medium-sized company (500 employees) recently suffered a data breach where attackers gained access to their customer database through a SQL injection vulnerability in their web application. The breach exposed 50,000 customer records including names, emails, and credit card information.

**Question**: Based on the CIA Triad principles, which aspect was most compromised in this scenario, and what would be the most critical immediate response?`,
        type: 'multiple_choice',
        answers: JSON.stringify([
          {
            id: 'a',
            text: 'Confidentiality - Implement immediate data encryption and access controls',
            isCorrect: true
          },
          {
            id: 'b', 
            text: 'Integrity - Restore data from backups and verify data accuracy',
            isCorrect: false
          },
          {
            id: 'c',
            text: 'Availability - Ensure systems remain operational during investigation',
            isCorrect: false
          },
          {
            id: 'd',
            text: 'All three equally - Implement comprehensive security measures across all areas',
            isCorrect: false
          }
        ]),
        explanation: `**Correct Answer: A - Confidentiality**

The primary compromise was **Confidentiality** because sensitive customer data (names, emails, credit cards) was exposed to unauthorized parties. The most critical immediate response is to:

1. **Immediate containment**: Patch the SQL injection vulnerability
2. **Access control**: Revoke compromised credentials and implement stronger authentication
3. **Data protection**: Encrypt remaining sensitive data
4. **Notification**: Inform affected customers per GDPR/CCPA requirements

While Integrity and Availability are important, the immediate threat is ongoing unauthorized access to confidential data.`,
        points: 3,
        order: 1
      },
      {
        id: uuidv4(),
        text: `**Multi-Part Scenario**: You're analyzing a network diagram showing a typical corporate network with the following components:
- DMZ with web servers
- Internal network with database servers
- Employee workstations
- WiFi access points
- Firewall between DMZ and internal network

**Part A**: If an attacker successfully compromises a web server in the DMZ, what is the most likely next step in their attack progression?

**Part B**: What single security control would be most effective at preventing lateral movement from the DMZ to the internal network?`,
        type: 'multiple_choice',
        answers: JSON.stringify([
          {
            id: 'a',
            text: 'A) Escalate privileges on the web server, then B) Network segmentation with internal firewalls',
            isCorrect: true
          },
          {
            id: 'b',
            text: 'A) Immediately pivot to database servers, then B) Strong password policies',
            isCorrect: false
          },
          {
            id: 'c',
            text: 'A) Plant backdoors for persistence, then B) Antivirus software on all systems',
            isCorrect: false
          },
          {
            id: 'd',
            text: 'A) Steal data and exfiltrate immediately, then B) Regular security awareness training',
            isCorrect: false
          }
        ]),
        explanation: `**Correct Answer: A**

**Part A**: After compromising a DMZ web server, attackers typically:
1. **Escalate privileges** to gain administrative access
2. **Reconnaissance** to map the internal network
3. **Lateral movement** to reach more valuable targets (databases, file servers)
4. **Persistence** to maintain access

**Part B**: **Network segmentation with internal firewalls** is most effective because:
- Creates additional security boundaries
- Limits blast radius of compromises
- Provides monitoring points for lateral movement
- Implements defense-in-depth strategy

Other controls are important but don't directly prevent lateral movement.`,
        points: 4,
        order: 2
      },
      {
        id: uuidv4(),
        text: `**Threat Modeling Exercise**: A healthcare organization is implementing a new patient portal system that will:
- Store PHI (Protected Health Information)
- Allow patients to schedule appointments
- Enable secure messaging with doctors
- Integrate with existing EMR systems

**Question**: Using the STRIDE threat modeling framework, which threat category poses the greatest risk to this system, and why?`,
        type: 'multiple_choice',
        answers: JSON.stringify([
          {
            id: 'a',
            text: 'Spoofing - Patient identity verification is critical for healthcare data integrity',
            isCorrect: false
          },
          {
            id: 'b',
            text: 'Tampering - Unauthorized modification of medical records could have life-threatening consequences',
            isCorrect: true
          },
          {
            id: 'c',
            text: 'Repudiation - Patients might deny scheduling appointments or sending messages',
            isCorrect: false
          },
          {
            id: 'd',
            text: 'Information Disclosure - PHI exposure violates HIPAA and could result in massive fines',
            isCorrect: false
          }
        ]),
        explanation: `**Correct Answer: B - Tampering**

While all STRIDE threats are serious in healthcare, **Tampering** poses the greatest risk because:

1. **Life-threatening consequences**: Modified medical records could lead to incorrect treatments
2. **Legal liability**: Healthcare providers are legally responsible for data accuracy
3. **Regulatory compliance**: HIPAA requires data integrity controls
4. **Cascade effects**: Tampered data affects multiple systems and decision-making processes

**Why other threats are less critical here:**
- **Spoofing**: Important but can be mitigated with strong authentication
- **Repudiation**: Serious but primarily affects business processes
- **Information Disclosure**: Critical but tampering can cause more direct harm

The healthcare context makes data integrity paramount.`,
        points: 4,
        order: 3
      },
      {
        id: uuidv4(),
        text: `**Incident Response Case Study**: At 2:30 AM, your SOC receives an alert about unusual network traffic from a workstation. Investigation reveals:

- 15GB of data transferred to external IP over 2 hours
- Multiple failed login attempts to admin accounts
- Suspicious processes running with elevated privileges
- Network connections to known malicious domains

**Question**: What is the most appropriate immediate action, and what critical information should be preserved for forensic analysis?`,
        type: 'multiple_choice',
        answers: JSON.stringify([
          {
            id: 'a',
            text: 'Immediately power down the workstation and create a forensic image of the hard drive',
            isCorrect: false
          },
          {
            id: 'b',
            text: 'Isolate the workstation from network, preserve memory dump and network logs, then investigate',
            isCorrect: true
          },
          {
            id: 'c',
            text: 'Continue monitoring to gather more evidence before taking any action',
            isCorrect: false
          },
          {
            id: 'd',
            text: 'Immediately change all admin passwords and update antivirus signatures',
            isCorrect: false
          }
        ]),
        explanation: `**Correct Answer: B**

**Immediate Actions:**
1. **Network isolation** - Prevent further data exfiltration
2. **Preserve evidence** - Memory dumps contain volatile data that disappears on reboot
3. **Document everything** - Timestamps, network logs, process lists
4. **Contain the threat** - Stop the attack without destroying evidence

**Critical Evidence to Preserve:**
- **Memory dump** - Running processes, network connections, encryption keys
- **Network logs** - Traffic patterns, external IPs, data volumes
- **System logs** - Failed logins, privilege escalations, process executions
- **Timeline** - Exact sequence of events for reconstruction

**Why other options are wrong:**
- **A**: Powering down destroys volatile memory evidence
- **C**: Delays containment, allows more damage
- **D**: Doesn't address the active threat or preserve evidence`,
        points: 5,
        order: 4
      },
      {
        id: uuidv4(),
        text: `**Cryptography Application**: A financial institution needs to implement end-to-end encryption for their mobile banking app. The app must:

- Encrypt sensitive data (account numbers, balances, transactions)
- Support 1 million+ concurrent users
- Work on devices with limited processing power
- Comply with PCI DSS requirements

**Question**: Which cryptographic approach best balances security, performance, and compliance requirements?`,
        type: 'multiple_choice',
        answers: JSON.stringify([
          {
            id: 'a',
            text: 'AES-256-GCM for data encryption + RSA-4096 for key exchange + SHA-256 for integrity',
            isCorrect: true
          },
          {
            id: 'b',
            text: 'AES-128-CBC for data encryption + ECDH for key exchange + MD5 for integrity',
            isCorrect: false
          },
          {
            id: 'c',
            text: 'Triple DES for data encryption + Diffie-Hellman for key exchange + SHA-1 for integrity',
            isCorrect: false
          },
          {
            id: 'd',
            text: 'Blowfish for data encryption + RSA-2048 for key exchange + CRC32 for integrity',
            isCorrect: false
          }
        ]),
        explanation: `**Correct Answer: A**

**AES-256-GCM + RSA-4096 + SHA-256** provides the best balance:

**AES-256-GCM:**
- ✅ **Security**: 256-bit key, authenticated encryption
- ✅ **Performance**: Hardware acceleration support
- ✅ **Compliance**: FIPS 140-2 approved, PCI DSS compliant

**RSA-4096:**
- ✅ **Security**: 4096-bit provides strong key exchange
- ✅ **Compliance**: Meets PCI DSS key management requirements
- ✅ **Scalability**: Efficient for 1M+ users

**SHA-256:**
- ✅ **Security**: Cryptographically secure hash
- ✅ **Performance**: Fast on mobile devices
- ✅ **Compliance**: FIPS approved, widely supported

**Why others fail:**
- **B**: MD5 is cryptographically broken, ECDH better than RSA for performance
- **C**: Triple DES deprecated, SHA-1 has collision vulnerabilities
- **D**: Blowfish not FIPS approved, CRC32 not cryptographically secure`,
        points: 4,
        order: 5
      },
      {
        id: uuidv4(),
        text: `**Risk Assessment Scenario**: Your organization is evaluating three security projects with limited budget:

**Project A**: Deploy advanced endpoint detection (EDR) - $50K, reduces malware incidents by 80%
**Project B**: Implement zero-trust network architecture - $200K, reduces lateral movement by 95%  
**Project C**: Deploy data loss prevention (DLP) - $75K, prevents 90% of data exfiltration

**Question**: Using quantitative risk analysis, which project provides the best ROI if a single malware incident costs $100K, lateral movement breach costs $500K, and data exfiltration costs $1M?`,
        type: 'multiple_choice',
        answers: JSON.stringify([
          {
            id: 'a',
            text: 'Project A - Highest risk reduction per dollar invested',
            isCorrect: false
          },
          {
            id: 'b',
            text: 'Project B - Prevents highest-cost incidents despite higher investment',
            isCorrect: true
          },
          {
            id: 'c',
            text: 'Project C - Data exfiltration has highest impact, best overall protection',
            isCorrect: false
          },
          {
            id: 'd',
            text: 'All three equally - Defense in depth requires all controls',
            isCorrect: false
          }
        ]),
        explanation: `**Correct Answer: B - Project B (Zero Trust)**

**ROI Calculation:**

**Project A (EDR):**
- Annual savings: 80% × $100K = $80K
- ROI: ($80K - $50K) / $50K = 60%

**Project B (Zero Trust):**
- Annual savings: 95% × $500K = $475K  
- ROI: ($475K - $200K) / $200K = 137.5%

**Project C (DLP):**
- Annual savings: 90% × $1M = $900K
- ROI: ($900K - $75K) / $75K = 1100%

**However, Project B is best because:**
- **Highest absolute savings**: $475K vs $80K vs $900K
- **Balanced ROI**: 137.5% is excellent while being achievable
- **Strategic value**: Zero trust enables other security improvements
- **Risk mitigation**: Prevents the most common attack vector (lateral movement)

**Note**: While Project C has highest ROI, it's unrealistic to prevent 90% of all data exfiltration. Project B provides more realistic and sustainable risk reduction.`,
        points: 5,
        order: 6
      },
      {
        id: uuidv4(),
        text: `**Social Engineering Defense**: Your organization receives a sophisticated phishing email that:

- Appears to come from the CEO's personal email
- References a real upcoming board meeting
- Contains a link to "review confidential financial documents"
- Uses the company's actual domain in the URL
- Arrives during business hours when the CEO is known to be traveling

**Question**: What combination of technical and human controls would be most effective at preventing this attack from succeeding?`,
        type: 'multiple_choice',
        answers: JSON.stringify([
          {
            id: 'a',
            text: 'Email authentication (SPF/DKIM/DMARC) + Security awareness training + URL filtering',
            isCorrect: true
          },
          {
            id: 'b',
            text: 'Strong password policies + Multi-factor authentication + Regular security audits',
            isCorrect: false
          },
          {
            id: 'c',
            text: 'Network segmentation + Intrusion detection systems + Incident response procedures',
            isCorrect: false
          },
          {
            id: 'd',
            text: 'Data encryption + Access controls + Regular penetration testing',
            isCorrect: false
          }
        ]),
        explanation: `**Correct Answer: A**

**Multi-layered Defense Against Sophisticated Phishing:**

**Technical Controls:**
1. **Email Authentication (SPF/DKIM/DMARC)**:
   - SPF prevents domain spoofing
   - DKIM ensures message integrity
   - DMARC provides policy enforcement
   - Would catch the CEO email spoofing

2. **URL Filtering**:
   - Blocks malicious links before they reach users
   - Real-time threat intelligence updates
   - Sandboxing of suspicious URLs

**Human Controls:**
3. **Security Awareness Training**:
   - Teaches users to verify sender authenticity
   - Encourages reporting of suspicious emails
   - Creates security-conscious culture

**Why other options are less effective:**
- **B**: Password/MFA don't prevent phishing, audits are reactive
- **C**: Network controls don't stop email-based attacks
- **D**: Encryption/access controls don't prevent initial compromise

**Additional Recommendations:**
- Implement email security gateway
- Regular phishing simulation exercises
- Clear reporting procedures for suspicious emails`,
        points: 4,
        order: 7
      },
      {
        id: uuidv4(),
        text: `**Compliance and Legal Scenario**: A multinational corporation operates in the EU, US, and Asia. They process personal data of customers, employees, and business partners across all regions.

**Question**: Which combination of privacy regulations must they comply with, and what is the most challenging aspect of maintaining compliance across all jurisdictions?`,
        type: 'multiple_choice',
        answers: JSON.stringify([
          {
            id: 'a',
            text: 'GDPR (EU) + CCPA (California) + PIPEDA (Canada) - Managing different data subject rights and consent requirements',
            isCorrect: true
          },
          {
            id: 'b',
            text: 'HIPAA (US) + SOX (US) + PCI DSS (Global) - Implementing different technical security controls',
            isCorrect: false
          },
          {
            id: 'c',
            text: 'FISMA (US) + ISO 27001 (Global) + NIST (US) - Aligning different security frameworks',
            isCorrect: false
          },
          {
            id: 'd',
            text: 'FERPA (US) + COPPA (US) + GLBA (US) - Managing different data retention requirements',
            isCorrect: false
          }
        ]),
        explanation: `**Correct Answer: A**

**Key Privacy Regulations:**
- **GDPR (EU)**: Comprehensive data protection, applies to EU residents globally
- **CCPA (California)**: Consumer privacy rights, applies to CA residents
- **PIPEDA (Canada)**: Personal information protection, applies to Canadian residents

**Most Challenging Aspect: Data Subject Rights and Consent**

**Different Rights Across Jurisdictions:**
- **GDPR**: Right to erasure, data portability, automated decision-making
- **CCPA**: Right to know, delete, opt-out, non-discrimination
- **PIPEDA**: Right to access, correction, withdrawal of consent

**Consent Complexity:**
- **GDPR**: Explicit, informed, freely given, specific consent
- **CCPA**: Opt-out model for most data, opt-in for sensitive data
- **PIPEDA**: Meaningful consent, can be implied in some cases

**Implementation Challenges:**
- Different consent mechanisms
- Varying data retention periods
- Conflicting requirements
- Cross-border data transfer restrictions
- Different enforcement mechanisms and penalties

**Why others are less comprehensive:**
- **B**: HIPAA/SOX/PCI focus on specific industries/data types
- **C**: Security frameworks, not privacy regulations
- **D**: US-only regulations, missing international scope`,
        points: 5,
        order: 8
      }
    ];

    // Insert advanced questions
    for (const question of advancedQuestions) {
      await connection.execute(
        `INSERT INTO questions (id, quiz_id, text, type, answers, explanation, points, \`order\`, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          question.id,
          quizId,
          question.text,
          question.type,
          question.answers,
          question.explanation,
          question.points,
          question.order,
          true
        ]
      );
    }

    console.log(`✅ Created ${advancedQuestions.length} advanced questions`);

    await connection.end();
    console.log('🎉 Advanced quiz creation completed successfully!');
    
  } catch (error) {
    console.error('❌ Advanced quiz creation failed:', error);
    process.exit(1);
  }
};

createAdvancedQuiz();
