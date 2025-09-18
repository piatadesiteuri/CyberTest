import mysql from 'mysql2/promise'
import { databaseConfig } from '../../config/database'

async function createPhishingTables() {
  const connection = await mysql.createConnection(databaseConfig)

  try {
    console.log('🔧 Creating phishing simulation tables...')

    // Phishing Campaigns table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS phishing_campaigns (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type ENUM('phishing', 'smishing', 'vishing') NOT NULL,
        status ENUM('draft', 'active', 'paused', 'completed') DEFAULT 'draft',
        target_groups JSON,
        start_date DATETIME,
        end_date DATETIME,
        created_by VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Phishing Templates table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS phishing_templates (
        id VARCHAR(36) PRIMARY KEY,
        campaign_id VARCHAR(36) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        content LONGTEXT NOT NULL,
        sender_name VARCHAR(255) NOT NULL,
        sender_email VARCHAR(255) NOT NULL,
        landing_page_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (campaign_id) REFERENCES phishing_campaigns(id) ON DELETE CASCADE
      )
    `)

    // Phishing Attachments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS phishing_attachments (
        id VARCHAR(36) PRIMARY KEY,
        template_id VARCHAR(36) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(100) NOT NULL,
        is_malicious BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (template_id) REFERENCES phishing_templates(id) ON DELETE CASCADE
      )
    `)

    // Phishing Results table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS phishing_results (
        id VARCHAR(36) PRIMARY KEY,
        campaign_id VARCHAR(36) NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        template_id VARCHAR(36) NOT NULL,
        action ENUM('email_opened', 'link_clicked', 'attachment_downloaded', 'form_submitted', 'reported') NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT,
        additional_data JSON,
        FOREIGN KEY (campaign_id) REFERENCES phishing_campaigns(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (template_id) REFERENCES phishing_templates(id) ON DELETE CASCADE
      )
    `)

    // Phishing Reports table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS phishing_reports (
        id VARCHAR(36) PRIMARY KEY,
        campaign_id VARCHAR(36) NOT NULL,
        total_sent INT DEFAULT 0,
        total_opened INT DEFAULT 0,
        total_clicked INT DEFAULT 0,
        total_reported INT DEFAULT 0,
        vulnerability_score DECIMAL(5,2) DEFAULT 0.00,
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (campaign_id) REFERENCES phishing_campaigns(id) ON DELETE CASCADE
      )
    `)

    console.log('✅ Phishing simulation tables created successfully!')
  } catch (error) {
    console.error('❌ Error creating phishing tables:', error)
    throw error
  } finally {
    await connection.end()
  }
}

// Run if called directly
if (require.main === module) {
  createPhishingTables()
    .then(() => {
      console.log('🎉 Phishing tables setup completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Setup failed:', error)
      process.exit(1)
    })
}

export { createPhishingTables }
