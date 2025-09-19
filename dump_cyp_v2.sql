-- MySQL dump 10.13  Distrib 8.0.42, for macos15 (arm64)
--
-- Host: 127.0.0.1    Database: cyber
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` enum('foundation','intermediate','advanced','expert') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'foundation',
  `status` enum('draft','published','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `estimated_duration` int NOT NULL DEFAULT '0',
  `prerequisites` json DEFAULT NULL,
  `learning_objectives` json DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_by` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_level` (`level`),
  KEY `idx_status` (`status`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_created_by` (`created_by`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES ('2411dc8e-ee27-40b5-92e6-cfef2bb96910','Threat Analysis & Response','Advanced threat detection and incident response for IT professionals.','advanced','published',1200,NULL,'[\"Analyze APTs\", \"Implement threat hunting\", \"Design incident response\"]','[\"advanced\", \"threat-analysis\", \"incident-response\"]',1,'3539203c-9459-11f0-9fe8-902a222c76cd','2025-09-18 09:25:20','2025-09-18 09:25:20'),('cb39846d-f16d-4a5c-a53c-0e1553e0e54c','Security Leadership','Lead security initiatives and manage teams for managers and executives.','advanced','published',800,NULL,'[\"Develop security strategies\", \"Manage teams\", \"Navigate compliance\"]','[\"management\", \"leadership\", \"compliance\"]',1,'3539203c-9459-11f0-9fe8-902a222c76cd','2025-09-18 09:25:20','2025-09-18 09:25:20'),('d02a8098-3672-407e-a668-741262b33842','Cybersecurity Fundamentals','Master the basics of cybersecurity, threat awareness, and security best practices.','foundation','published',600,NULL,'[\"Understand cybersecurity basics\", \"Identify threats\", \"Learn best practices\"]','[\"foundation\", \"cybersecurity\", \"basics\"]',1,'3539203c-9459-11f0-9fe8-902a222c76cd','2025-09-18 09:25:20','2025-09-18 09:25:20');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_verification_tokens`
--

DROP TABLE IF EXISTS `email_verification_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_verification_tokens` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `used` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_token` (`token`),
  KEY `idx_expires_at` (`expires_at`),
  CONSTRAINT `email_verification_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_verification_tokens`
--

LOCK TABLES `email_verification_tokens` WRITE;
/*!40000 ALTER TABLE `email_verification_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_verification_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lessons` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('theory','practical','video','interactive','documentation') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'theory',
  `order` int NOT NULL DEFAULT '0',
  `estimated_duration` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_module_id` (`module_id`),
  KEY `idx_order` (`module_id`,`order`),
  KEY `idx_type` (`type`),
  KEY `idx_is_active` (`is_active`),
  CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessons`
--

LOCK TABLES `lessons` WRITE;
/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
INSERT INTO `lessons` VALUES ('00b8d4c3-1dbb-4f9f-ae1e-8c8374ff90a7','cb5fa29a-3b33-42c4-b07d-92f3f530aa41','Types of Cyber Threats','Understanding different categories of cyber threats','# Types of Cyber Threats\n\n## Malware\nMalicious software designed to damage or gain unauthorized access to computer systems.\n\n### Common Types:\n- **Viruses**: Self-replicating programs that attach to legitimate files\n- **Trojans**: Malicious programs disguised as legitimate software\n- **Ransomware**: Malware that encrypts files and demands payment for decryption\n- **Spyware**: Software that secretly monitors user activity\n\n## Social Engineering\nPsychological manipulation to trick people into revealing sensitive information.\n\n### Common Techniques:\n- **Phishing**: Fraudulent emails or messages\n- **Pretexting**: Creating false scenarios to obtain information\n- **Baiting**: Offering something enticing to lure victims\n- **Quid pro quo**: Offering something in exchange for information\n\n## Network Attacks\nAttacks targeting network infrastructure and communications.\n\n### Common Types:\n- **DDoS**: Distributed Denial of Service attacks\n- **Man-in-the-Middle**: Intercepting communications\n- **DNS Spoofing**: Redirecting traffic to malicious sites','theory',2,45,1,'2025-09-18 09:43:31','2025-09-18 09:43:31'),('13a4e7f3-204d-4b80-88b5-22f695131ad9','0137cddf-622d-4453-b8ad-741fcae56c05','Reporting Suspicious Activity','What to do when you encounter phishing attempts','# Reporting Suspicious Activity\n\nWhen you encounter phishing attempts or other suspicious activity, it\'s important to report it promptly and correctly.\n\n## What to Report\n\n### Phishing Emails\n- Suspicious sender addresses\n- Requests for personal information\n- Malicious links or attachments\n- Urgent or threatening language\n\n### Suspicious Websites\n- Fake login pages\n- Sites asking for sensitive information\n- Redirects to unexpected locations\n- Missing security certificates\n\n## How to Report\n\n### Internal Reporting\n1. **Forward the email** to your IT security team\n2. **Include headers** if possible\n3. **Don\'t click any links** in the suspicious email\n4. **Delete the email** after reporting\n\n### External Reporting\n- Report to the legitimate organization being impersonated\n- Use official reporting channels\n- Provide as much detail as possible\n- Keep records of your report\n\n## Prevention Tips\n- Enable email filtering\n- Keep security software updated\n- Be cautious with personal information\n- Verify requests through official channels\n\n## Response Time\n- Report immediately when discovered\n- Don\'t wait to \"see what happens\"\n- Quick reporting helps protect others\n- IT teams can take action faster','theory',3,30,1,'2025-09-18 09:43:31','2025-09-18 09:43:31'),('25e49fd9-99e8-4d49-852e-1f1e5a382a7d','0137cddf-622d-4453-b8ad-741fcae56c05','Recognizing Phishing Emails','How to identify suspicious emails and messages','# Recognizing Phishing Emails\n\nPhishing emails are designed to trick you into revealing sensitive information or clicking malicious links. Here\'s how to spot them:\n\n## Common Red Flags\n\n### Suspicious Sender\n- Email address doesn\'t match the company name\n- Generic greetings like \"Dear Customer\" instead of your name\n- Urgent or threatening language\n\n### Suspicious Content\n- Requests for personal information\n- Poor grammar and spelling\n- Suspicious links or attachments\n- Offers that seem too good to be true\n\n## How to Verify\n\n### Check the Sender\n- Hover over links to see the actual URL\n- Verify the sender\'s email address\n- Contact the company directly if unsure\n\n### Look for Security Indicators\n- Check for HTTPS in URLs\n- Look for security certificates\n- Verify the website\'s authenticity\n\n## Best Practices\n- Never click suspicious links\n- Don\'t download unexpected attachments\n- Verify requests through official channels\n- Report suspicious emails to IT security','interactive',1,30,1,'2025-09-18 09:43:31','2025-09-18 09:43:31'),('26cc13fb-3b88-4fc1-8a14-a191505f4ab0','6d832ee6-fc51-495b-b608-b780b692fbe9','Creating Strong Passwords','Best practices for password creation and management','# Creating Strong Passwords\n\nStrong passwords are your first line of defense against unauthorized access to your accounts.\n\n## Password Requirements\n\n### Length\n- **Minimum 12 characters** (preferably 16+)\n- Longer passwords are exponentially harder to crack\n- Use passphrases instead of single words\n\n### Complexity\n- Mix of uppercase and lowercase letters\n- Include numbers and special characters\n- Avoid common patterns and sequences\n- Don\'t use personal information\n\n## Best Practices\n\n### Unique Passwords\n- Use a different password for each account\n- Don\'t reuse passwords across sites\n- Change passwords regularly\n- Use a password manager\n\n### Avoid Common Mistakes\n- Don\'t use \"password\" or \"123456\"\n- Avoid keyboard patterns like \"qwerty\"\n- Don\'t use personal information\n- Don\'t share passwords with others\n\n## Password Manager Benefits\n- Generate strong, unique passwords\n- Store passwords securely\n- Auto-fill login forms\n- Sync across devices\n- Alert you to compromised passwords\n\n## Creating Memorable Passwords\n- Use passphrases: \"Coffee@Morning#2024!\"\n- Combine unrelated words: \"Elephant$Rainbow&42\"\n- Use song lyrics or quotes: \"ToBeOrNotToBe@2024\"\n- Include personal elements: \"MyDog$Max#2024\"','theory',1,30,1,'2025-09-18 09:43:31','2025-09-18 09:43:31'),('4e77048b-f90a-4a1a-9e44-082ca0105fee','cb5fa29a-3b33-42c4-b07d-92f3f530aa41','Security Best Practices','Fundamental security practices everyone should follow','# Security Best Practices\n\n## Password Security\n- Use strong, unique passwords for each account\n- Enable two-factor authentication (2FA) when available\n- Use a password manager to store passwords securely\n- Never share passwords with others\n\n## Software Updates\n- Keep operating systems and software up to date\n- Enable automatic updates when possible\n- Install security patches promptly\n- Remove unused software and applications\n\n## Safe Browsing\n- Be cautious when clicking links in emails\n- Verify website URLs before entering sensitive information\n- Use HTTPS websites when possible\n- Avoid downloading software from untrusted sources\n\n## Data Protection\n- Regularly backup important data\n- Use encryption for sensitive information\n- Be mindful of what information you share online\n- Follow your organization\'s data handling policies','practical',3,45,1,'2025-09-18 09:43:31','2025-09-18 09:43:31'),('5347ae73-d703-4418-8b98-76bfd1afc6b6','0137cddf-622d-4453-b8ad-741fcae56c05','Phishing Simulation Exercise','Practice identifying phishing attempts','# Phishing Simulation Exercise\n\nThis interactive exercise will help you practice identifying phishing attempts.\n\n## Exercise Instructions\n\n### Scenario 1: Suspicious Email\nYou receive an email claiming to be from your bank asking you to verify your account information. The email contains several red flags.\n\n**What would you do?**\n1. Click the link to verify your account\n2. Call the bank using the number from their official website\n3. Reply to the email with your information\n\n### Scenario 2: Urgent Request\nAn email from your \"IT department\" says your password will expire in 24 hours and you must click a link to reset it.\n\n**What would you do?**\n1. Click the link immediately\n2. Ignore the email\n3. Contact IT through official channels\n\n### Scenario 3: Prize Notification\nYou receive an email saying you\'ve won a prize and need to provide personal information to claim it.\n\n**What would you do?**\n1. Provide the requested information\n2. Delete the email\n3. Forward it to friends\n\n## Learning Objectives\n- Practice identifying phishing red flags\n- Develop critical thinking skills\n- Learn to verify suspicious communications\n- Understand the importance of official channels','practical',2,30,1,'2025-09-18 09:43:31','2025-09-18 09:43:31'),('74055e84-bf5b-431e-a53f-fc0ee92cd460','6d832ee6-fc51-495b-b608-b780b692fbe9','Password Managers','Using password managers effectively','# Password Managers\n\nPassword managers are essential tools for maintaining strong, unique passwords across all your accounts.\n\n## What is a Password Manager?\n\nA password manager is a secure application that stores and manages your passwords. It encrypts your passwords and requires only one master password to access them.\n\n## Popular Password Managers\n\n### Free Options\n- **Bitwarden**: Open-source, feature-rich\n- **LastPass**: User-friendly, good free tier\n- **1Password**: Excellent security, paid service\n- **Dashlane**: User-friendly interface\n\n### Enterprise Solutions\n- **Microsoft Authenticator**\n- **Google Password Manager**\n- **Okta**\n- **CyberArk**\n\n## Setting Up a Password Manager\n\n### Step 1: Choose and Install\n- Research different options\n- Download from official sources\n- Install on all your devices\n\n### Step 2: Create Master Password\n- Use a strong, memorable passphrase\n- Write it down and store securely\n- Never share your master password\n\n### Step 3: Import Existing Passwords\n- Export passwords from browsers\n- Import into password manager\n- Update weak passwords\n\n## Best Practices\n\n### Security\n- Use two-factor authentication\n- Keep software updated\n- Use biometric authentication when available\n- Regularly backup your vault\n\n### Organization\n- Use descriptive names for accounts\n- Add notes and tags\n- Organize by categories\n- Regularly audit your passwords\n\n## Advanced Features\n- Password sharing (secure)\n- Emergency access\n- Password strength analysis\n- Breach monitoring\n- Secure notes storage','practical',2,30,1,'2025-09-18 09:43:31','2025-09-18 09:43:31'),('7bac7401-9790-43e9-8f0a-deaf3be7e14e','e48afbb8-ea27-4dc9-a3d9-46bf32089df8','What is Cybersecurity?','Introduction to cybersecurity concepts','# What is Cybersecurity?\n\nCybersecurity is the practice of protecting systems, networks, and programs from digital attacks.\n\n## Key Concepts\n- **Confidentiality**: Information not disclosed to unauthorized individuals\n- **Integrity**: Maintaining accuracy and completeness of information\n- **Availability**: Ensuring information is available when needed','theory',1,30,1,'2025-09-18 09:25:20','2025-09-18 09:25:20'),('d3bc4381-545d-4275-b003-4159f7828c96','cb5fa29a-3b33-42c4-b07d-92f3f530aa41','What is Cybersecurity?','Introduction to cybersecurity concepts and importance','# What is Cybersecurity?\n\nCybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money from users; or interrupting normal business processes.\n\n## Key Concepts\n\n### The CIA Triad\n- **Confidentiality**: Ensuring that information is not disclosed to unauthorized individuals\n- **Integrity**: Maintaining the accuracy and completeness of information\n- **Availability**: Ensuring that information and resources are available when needed\n\n### Common Threats\n- Malware (viruses, trojans, ransomware)\n- Phishing attacks\n- Social engineering\n- Data breaches\n- Insider threats\n\n## Why Cybersecurity Matters\n\nIn today\'s digital world, cybersecurity is more important than ever. Organizations face an increasing number of sophisticated cyber threats that can result in:\n- Financial losses\n- Reputation damage\n- Legal consequences\n- Operational disruption','theory',1,30,1,'2025-09-18 09:43:31','2025-09-18 09:43:31'),('d91000e3-f49b-4a6b-94f4-c54d08ff6e92','6d832ee6-fc51-495b-b608-b780b692fbe9','Multi-Factor Authentication','Setting up and using MFA for better security','# Multi-Factor Authentication (MFA)\n\nMulti-factor authentication adds an extra layer of security by requiring two or more verification methods.\n\n## What is MFA?\n\nMFA requires users to provide two or more verification factors:\n1. **Something you know** (password)\n2. **Something you have** (phone, token)\n3. **Something you are** (fingerprint, face)\n\n## Types of MFA\n\n### SMS/Text Messages\n- **Pros**: Easy to set up, widely supported\n- **Cons**: Can be intercepted, phone dependency\n- **Use for**: Low-risk accounts\n\n### Authenticator Apps\n- **Pros**: More secure, works offline\n- **Cons**: Requires smartphone\n- **Use for**: High-risk accounts\n\n### Hardware Tokens\n- **Pros**: Most secure, physical device\n- **Cons**: Cost, can be lost\n- **Use for**: Critical accounts\n\n### Biometric Authentication\n- **Pros**: Convenient, unique to user\n- **Cons**: Privacy concerns, can be spoofed\n- **Use for**: Personal devices\n\n## Setting Up MFA\n\n### Step 1: Choose Your Method\n- Consider security vs. convenience\n- Use multiple methods when possible\n- Have backup options\n\n### Step 2: Enable on Important Accounts\n- Banking and financial accounts\n- Email accounts\n- Social media accounts\n- Work accounts\n\n### Step 3: Test Your Setup\n- Verify MFA works correctly\n- Test backup methods\n- Update recovery information\n\n## Best Practices\n\n### Security\n- Use authenticator apps over SMS\n- Keep backup codes safe\n- Don\'t share MFA codes\n- Use different methods for different accounts\n\n### Convenience\n- Set up on multiple devices\n- Use biometric authentication when available\n- Keep backup methods ready\n- Test regularly\n\n## Common MFA Apps\n- **Google Authenticator**\n- **Microsoft Authenticator**\n- **Authy**\n- **1Password Authenticator**\n- **LastPass Authenticator**','practical',3,30,1,'2025-09-18 09:43:31','2025-09-18 09:43:31');
/*!40000 ALTER TABLE `lessons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modules` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `estimated_duration` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_course_id` (`course_id`),
  KEY `idx_order` (`course_id`,`order`),
  KEY `idx_is_active` (`is_active`),
  CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modules`
--

LOCK TABLES `modules` WRITE;
/*!40000 ALTER TABLE `modules` DISABLE KEYS */;
INSERT INTO `modules` VALUES ('0137cddf-622d-4453-b8ad-741fcae56c05','d02a8098-3672-407e-a668-741262b33842','Phishing Awareness & Prevention','Recognizing and avoiding phishing attacks',2,90,1,'2025-09-18 09:43:31','2025-09-18 09:43:31'),('6d832ee6-fc51-495b-b608-b780b692fbe9','d02a8098-3672-407e-a668-741262b33842','Password Security & MFA','Creating strong passwords and using multi-factor authentication',3,90,1,'2025-09-18 09:43:31','2025-09-18 09:43:31'),('cb5fa29a-3b33-42c4-b07d-92f3f530aa41','d02a8098-3672-407e-a668-741262b33842','Introduction to Cybersecurity','Understanding threats and security fundamentals',1,120,1,'2025-09-18 09:43:31','2025-09-18 09:43:31'),('e48afbb8-ea27-4dc9-a3d9-46bf32089df8','d02a8098-3672-407e-a668-741262b33842','Introduction to Cybersecurity','Understanding threats and security fundamentals',1,120,1,'2025-09-18 09:25:20','2025-09-18 09:25:20');
/*!40000 ALTER TABLE `modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `used` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_token` (`token`),
  KEY `idx_expires_at` (`expires_at`),
  CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phishing_campaigns`
--

DROP TABLE IF EXISTS `phishing_campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phishing_campaigns` (
  `id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `type` enum('phishing','smishing','vishing') NOT NULL,
  `status` enum('draft','active','paused','completed') DEFAULT 'draft',
  `target_groups` json DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `created_by` varchar(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phishing_campaigns`
--

LOCK TABLES `phishing_campaigns` WRITE;
/*!40000 ALTER TABLE `phishing_campaigns` DISABLE KEYS */;
INSERT INTO `phishing_campaigns` VALUES ('0794073e-2b15-41e2-b4dc-3f6f05ef70a9','Q4 Security Awareness Campaign','Comprehensive phishing simulation to test employee awareness of common attack vectors','phishing','active','[\"employee\", \"manager\"]','2025-09-18 13:55:00','2025-10-18 13:55:00','352b6aae-945a-11f0-9fe8-902a222c76cd','2025-09-18 10:55:00','2025-09-18 10:55:00'),('4004ce77-6d48-44a5-9b2f-8a5ecc2cf030','SMS Security Test Campaign','Test employee awareness of SMS-based attacks and social engineering','smishing','active','[\"employee\"]','2025-09-18 13:55:00','2025-10-02 13:55:00','352b6aae-945a-11f0-9fe8-902a222c76cd','2025-09-18 10:55:00','2025-09-18 10:55:00'),('a907d4eb-4edf-4e5c-a08b-37d6e635e893','Voice Phishing Awareness Test','Simulate phone-based social engineering attacks to test employee response','vishing','draft','[\"manager\", \"it_security_admin\"]','2025-09-18 13:55:00','2025-10-09 13:55:00','352b6aae-945a-11f0-9fe8-902a222c76cd','2025-09-18 10:55:00','2025-09-18 10:55:00');
/*!40000 ALTER TABLE `phishing_campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phishing_reports`
--

DROP TABLE IF EXISTS `phishing_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phishing_reports` (
  `id` varchar(36) NOT NULL,
  `campaign_id` varchar(36) NOT NULL,
  `total_sent` int DEFAULT '0',
  `total_opened` int DEFAULT '0',
  `total_clicked` int DEFAULT '0',
  `total_reported` int DEFAULT '0',
  `vulnerability_score` decimal(5,2) DEFAULT '0.00',
  `generated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phishing_reports`
--

LOCK TABLES `phishing_reports` WRITE;
/*!40000 ALTER TABLE `phishing_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `phishing_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phishing_results`
--

DROP TABLE IF EXISTS `phishing_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phishing_results` (
  `id` varchar(36) NOT NULL,
  `campaign_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `template_id` varchar(36) NOT NULL,
  `action` enum('email_opened','link_clicked','attachment_downloaded','form_submitted','reported') NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `additional_data` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phishing_results`
--

LOCK TABLES `phishing_results` WRITE;
/*!40000 ALTER TABLE `phishing_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `phishing_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phishing_templates`
--

DROP TABLE IF EXISTS `phishing_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phishing_templates` (
  `id` varchar(36) NOT NULL,
  `campaign_id` varchar(36) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `sender_name` varchar(255) NOT NULL,
  `sender_email` varchar(255) NOT NULL,
  `landing_page_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phishing_templates`
--

LOCK TABLES `phishing_templates` WRITE;
/*!40000 ALTER TABLE `phishing_templates` DISABLE KEYS */;
INSERT INTO `phishing_templates` VALUES ('4e0c2cf7-baba-4070-97da-65e40d3952a3','0794073e-2b15-41e2-b4dc-3f6f05ef70a9','Urgent: Verify Your Account - Action Required','\n          <html>\n          <body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">\n            <div style=\"max-width: 600px; margin: 0 auto; padding: 20px;\">\n              <div style=\"background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;\">\n                <h2 style=\"color: #dc3545; margin: 0;\">⚠️ Security Alert</h2>\n              </div>\n              \n              <p>Dear Valued Employee,</p>\n              \n              <p>We have detected unusual activity on your account. For your security, please verify your information immediately.</p>\n              \n              <div style=\"background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;\">\n                <p style=\"margin: 0; color: #856404;\"><strong>Action Required:</strong> Click the button below to verify your account within 24 hours, or it will be suspended.</p>\n              </div>\n              \n              <div style=\"text-align: center; margin: 30px 0;\">\n                <a href=\"http://localhost:3000/simulations/phishing/landing/verify-account\" \n                   style=\"background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;\">\n                  VERIFY ACCOUNT NOW\n                </a>\n              </div>\n              \n              <p>If you did not request this verification, please contact IT support immediately.</p>\n              \n              <hr style=\"margin: 30px 0; border: none; border-top: 1px solid #eee;\">\n              <p style=\"font-size: 12px; color: #666;\">\n                This email was sent by the IT Security Team<br>\n                Company Name | 123 Business St | City, State 12345\n              </p>\n            </div>\n          </body>\n          </html>\n        ','IT Security Team','security@company.com','http://localhost:3000/simulations/phishing/landing/verify-account',1,'2025-09-18 10:55:00'),('92ed00b2-e686-44f2-abff-7833d6990d1c','0794073e-2b15-41e2-b4dc-3f6f05ef70a9','Your Package Delivery Update - Track #12345','\n          <html>\n          <body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">\n            <div style=\"max-width: 600px; margin: 0 auto; padding: 20px;\">\n              <div style=\"background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;\">\n                <h2 style=\"color: #1976d2; margin: 0;\">? Package Delivery Update</h2>\n              </div>\n              \n              <p>Hello,</p>\n              \n              <p>Your package with tracking number <strong>#12345</strong> is ready for delivery.</p>\n              \n              <div style=\"background: #f3e5f5; border-left: 4px solid #9c27b0; padding: 15px; margin: 20px 0;\">\n                <p style=\"margin: 0;\"><strong>Delivery Details:</strong></p>\n                <ul style=\"margin: 10px 0; padding-left: 20px;\">\n                  <li>Estimated delivery: Today by 6:00 PM</li>\n                  <li>Delivery address: [Your Address]</li>\n                  <li>Package weight: 2.3 lbs</li>\n                </ul>\n              </div>\n              \n              <p>To ensure successful delivery, please confirm your delivery preferences:</p>\n              \n              <div style=\"text-align: center; margin: 30px 0;\">\n                <a href=\"http://localhost:3000/simulations/phishing/landing/delivery-confirm\" \n                   style=\"background: #4caf50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;\">\n                  CONFIRM DELIVERY\n                </a>\n              </div>\n              \n              <p>If you have any questions, please contact our customer service team.</p>\n              \n              <hr style=\"margin: 30px 0; border: none; border-top: 1px solid #eee;\">\n              <p style=\"font-size: 12px; color: #666;\">\n                This email was sent by Delivery Service<br>\n                Track your package: <a href=\"#\">delivery-service.com</a>\n              </p>\n            </div>\n          </body>\n          </html>\n        ','Delivery Service','noreply@delivery-service.com','http://localhost:3000/simulations/phishing/landing/delivery-confirm',1,'2025-09-18 10:55:00'),('b967aee0-7288-42c7-8ecc-dfefbffde2db','0794073e-2b15-41e2-b4dc-3f6f05ef70a9','Microsoft Teams: New Message from John Smith','\n          <html>\n          <body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">\n            <div style=\"max-width: 600px; margin: 0 auto; padding: 20px;\">\n              <div style=\"background: #f0f8ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;\">\n                <h2 style=\"color: #0078d4; margin: 0;\">? Microsoft Teams Notification</h2>\n              </div>\n              \n              <p>You have a new message in Microsoft Teams</p>\n              \n              <div style=\"background: white; border: 1px solid #e1e5e9; padding: 20px; border-radius: 8px; margin: 20px 0;\">\n                <div style=\"display: flex; align-items: center; margin-bottom: 15px;\">\n                  <div style=\"width: 40px; height: 40px; background: #0078d4; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin-right: 15px;\">\n                    JS\n                  </div>\n                  <div>\n                    <strong>John Smith</strong><br>\n                    <span style=\"color: #666; font-size: 14px;\">2 minutes ago</span>\n                  </div>\n                </div>\n                <p style=\"margin: 0; font-style: italic;\">\"Hey! Can you check this document? I think there might be an issue with the budget numbers. Click here to review: <a href=\"http://localhost:3000/simulations/phishing/landing/teams-document\" style=\"color: #0078d4;\">View Document</a>\"</p>\n              </div>\n              \n              <div style=\"text-align: center; margin: 30px 0;\">\n                <a href=\"http://localhost:3000/simulations/phishing/landing/teams-document\" \n                   style=\"background: #0078d4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;\">\n                  OPEN IN TEAMS\n                </a>\n              </div>\n              \n              <p>This message was sent to you via Microsoft Teams. If you don\'t recognize this sender, please report it.</p>\n              \n              <hr style=\"margin: 30px 0; border: none; border-top: 1px solid #eee;\">\n              <p style=\"font-size: 12px; color: #666;\">\n                Microsoft Teams | Microsoft Corporation\n              </p>\n            </div>\n          </body>\n          </html>\n        ','Microsoft Teams','noreply@teams.microsoft.com','http://localhost:3000/simulations/phishing/landing/teams-document',1,'2025-09-18 10:55:00');
/*!40000 ALTER TABLE `phishing_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quiz_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('multiple_choice','true_false','single_choice','fill_in_blank','essay') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'multiple_choice',
  `answers` json NOT NULL,
  `explanation` text COLLATE utf8mb4_unicode_ci,
  `points` int NOT NULL DEFAULT '1',
  `order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_quiz_id` (`quiz_id`),
  KEY `idx_order` (`quiz_id`,`order`),
  KEY `idx_type` (`type`),
  KEY `idx_is_active` (`is_active`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES ('1df837fd-43d0-49c6-84d8-24a1d89a771c','572dfe8b-3d41-4633-a8dd-4b7f9382e296','What does the \"C\" in the CIA Triad stand for?','single_choice','[{\"text\": \"Confidentiality\", \"isCorrect\": true}, {\"text\": \"Confidence\", \"isCorrect\": false}, {\"text\": \"Control\", \"isCorrect\": false}, {\"text\": \"Compliance\", \"isCorrect\": false}]','The CIA Triad consists of Confidentiality, Integrity, and Availability.',10,1,1,'2025-09-18 09:43:31','2025-09-18 09:43:31'),('68538988-f0ce-49a6-98c0-2fcb71d9dbff','572dfe8b-3d41-4633-a8dd-4b7f9382e296','Phishing is a type of social engineering attack.','true_false','[{\"text\": \"True\", \"isCorrect\": true}, {\"text\": \"False\", \"isCorrect\": false}]','Phishing uses psychological manipulation to trick people.',10,3,1,'2025-09-18 09:43:31','2025-09-18 09:43:31'),('94ab4b4c-db9a-48c1-9da8-ace4c6d37cf7','572dfe8b-3d41-4633-a8dd-4b7f9382e296','Which of the following is NOT a type of malware?','single_choice','[{\"text\": \"Virus\", \"isCorrect\": false}, {\"text\": \"Firewall\", \"isCorrect\": true}, {\"text\": \"Trojan\", \"isCorrect\": false}, {\"text\": \"Ransomware\", \"isCorrect\": false}]','A firewall is a security device, not malware.',10,2,1,'2025-09-18 09:43:31','2025-09-18 09:43:31'),('a8ed9ae1-95ae-46be-80ed-fc56cdaad093','d1b9e9b5-6f19-4963-a1a1-000d8dd4fd06','What does the \"C\" in the CIA Triad stand for?','single_choice','[{\"text\": \"Confidentiality\", \"isCorrect\": true}, {\"text\": \"Confidence\", \"isCorrect\": false}, {\"text\": \"Control\", \"isCorrect\": false}, {\"text\": \"Compliance\", \"isCorrect\": false}]','The CIA Triad consists of Confidentiality, Integrity, and Availability.',10,1,1,'2025-09-18 09:25:20','2025-09-18 09:25:20');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_attempts`
--

DROP TABLE IF EXISTS `quiz_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_attempts` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quiz_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answers` json NOT NULL,
  `score` int NOT NULL DEFAULT '0',
  `total_questions` int NOT NULL DEFAULT '0',
  `correct_answers` int NOT NULL DEFAULT '0',
  `time_spent` int NOT NULL DEFAULT '0',
  `started_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `passed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_quiz_id` (`quiz_id`),
  KEY `idx_user_quiz` (`user_id`,`quiz_id`),
  KEY `idx_completed_at` (`completed_at`),
  CONSTRAINT `quiz_attempts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quiz_attempts_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_attempts`
--

LOCK TABLES `quiz_attempts` WRITE;
/*!40000 ALTER TABLE `quiz_attempts` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quizzes`
--

DROP TABLE IF EXISTS `quizzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quizzes` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('pre_assessment','post_assessment','practice','final_exam') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'practice',
  `status` enum('draft','published','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `time_limit` int NOT NULL DEFAULT '0',
  `passing_score` int NOT NULL DEFAULT '70',
  `max_attempts` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_module_id` (`module_id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_is_active` (`is_active`),
  CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quizzes`
--

LOCK TABLES `quizzes` WRITE;
/*!40000 ALTER TABLE `quizzes` DISABLE KEYS */;
INSERT INTO `quizzes` VALUES ('572dfe8b-3d41-4633-a8dd-4b7f9382e296','cb5fa29a-3b33-42c4-b07d-92f3f530aa41','Cybersecurity Fundamentals Quiz','Test your understanding of basic cybersecurity concepts','post_assessment','published',15,70,3,1,'2025-09-18 09:43:31','2025-09-18 09:43:31'),('d1b9e9b5-6f19-4963-a1a1-000d8dd4fd06','e48afbb8-ea27-4dc9-a3d9-46bf32089df8','Cybersecurity Fundamentals Quiz','Test your understanding of basic cybersecurity concepts','post_assessment','published',15,70,3,1,'2025-09-18 09:25:20','2025-09-18 09:25:20');
/*!40000 ALTER TABLE `quizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_revoked` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_token` (`token`),
  KEY `idx_expires_at` (`expires_at`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_progress`
--

DROP TABLE IF EXISTS `user_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_progress` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lesson_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quiz_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('not_started','in_progress','completed','locked') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'not_started',
  `progress_percentage` int NOT NULL DEFAULT '0',
  `score` int DEFAULT NULL,
  `time_spent` int NOT NULL DEFAULT '0',
  `last_accessed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_course_id` (`course_id`),
  KEY `idx_module_id` (`module_id`),
  KEY `idx_lesson_id` (`lesson_id`),
  KEY `idx_quiz_id` (`quiz_id`),
  KEY `idx_status` (`status`),
  KEY `idx_user_course` (`user_id`,`course_id`),
  CONSTRAINT `user_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_progress_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_progress_ibfk_3` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_progress_ibfk_4` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_progress_ibfk_5` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_progress`
--

LOCK TABLES `user_progress` WRITE;
/*!40000 ALTER TABLE `user_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('employee','manager','admin','it_security_admin','ciso') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'employee',
  `is_active` tinyint(1) DEFAULT '1',
  `email_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_department` (`department`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('352b6aae-945a-11f0-9fe8-902a222c76cd','admin@gmail.com','$2b$12$P.98D6s9dUgbELq6sfifX.DO6mnXRg0UgGuJZFNpydCcQtAO3XTuq','Admin','User','IT Security','admin',1,1,'2025-09-18 06:39:20','2025-09-18 08:29:31','2025-09-18 08:29:31'),('3539203c-9459-11f0-9fe8-902a222c76cd','test@gmail.com','$2b$12$nnz.rNQ.RA7QDt0Q2H2jEuLcNU3EwaPkhp3lQOcbrX/LFAdf2Hpw6','test','test','Finance','employee',1,1,'2025-09-18 06:32:11','2025-09-18 11:11:01','2025-09-18 11:11:01'),('401f9efc-945b-11f0-9fe8-902a222c76cd','admin@cybertest.com','$2b$12$nnI8plkLwt69q5qLR5YEzeaR5zTFhXEOi3SQ0JaRhotntrtLv3cju','Admin','User','IT Security','admin',1,1,'2025-09-18 06:46:48','2025-09-18 06:46:52','2025-09-18 06:46:52'),('444772e8-945b-11f0-9fe8-902a222c76cd','user@example.com','$2b$12$gCFdKsMFlWInidVs8h5qeOdgnY.O7rqaFFpwJ8qgFN3wkKrxHjtCq','John','Doe','IT','employee',1,0,'2025-09-18 06:46:55','2025-09-18 06:46:58','2025-09-18 06:46:58');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-18 14:28:50
