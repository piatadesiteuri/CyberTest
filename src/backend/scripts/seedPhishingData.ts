import mysql from 'mysql2/promise'
import { databaseConfig } from '../../config/database'
const { v4: uuidv4 } = require('uuid')

async function seedPhishingData() {
  const connection = await mysql.createConnection(databaseConfig)

  try {
    console.log('🌱 Seeding phishing simulation data...')

    // Get admin user ID
    const [users] = await connection.execute('SELECT id FROM users WHERE role = "admin" LIMIT 1')
    const adminId = (users as any[])[0]?.id

    if (!adminId) {
      console.error('❌ No admin user found. Please create an admin first.')
      return
    }

    // 1. Create Phishing Campaign
    const campaignId = uuidv4()
    await connection.execute(`
      INSERT INTO phishing_campaigns (id, title, description, type, status, target_groups, start_date, end_date, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      campaignId,
      'Q4 Security Awareness Campaign',
      'Comprehensive phishing simulation to test employee awareness of common attack vectors',
      'phishing',
      'active',
      JSON.stringify(['employee', 'manager']),
      new Date(),
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      adminId
    ])

    // 2. Create Phishing Templates
    const templates = [
      {
        id: uuidv4(),
        subject: 'Urgent: Verify Your Account - Action Required',
        content: `
          <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #dc3545; margin: 0;">⚠️ Security Alert</h2>
              </div>
              
              <p>Dear Valued Employee,</p>
              
              <p>We have detected unusual activity on your account. For your security, please verify your information immediately.</p>
              
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0; color: #856404;"><strong>Action Required:</strong> Click the button below to verify your account within 24 hours, or it will be suspended.</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/simulations/phishing/landing/verify-account" 
                   style="background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  VERIFY ACCOUNT NOW
                </a>
              </div>
              
              <p>If you did not request this verification, please contact IT support immediately.</p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #666;">
                This email was sent by the IT Security Team<br>
                Company Name | 123 Business St | City, State 12345
              </p>
            </div>
          </body>
          </html>
        `,
        senderName: 'IT Security Team',
        senderEmail: 'security@company.com',
        landingPageUrl: 'http://localhost:3000/simulations/phishing/landing/verify-account'
      },
      {
        id: uuidv4(),
        subject: 'Your Package Delivery Update - Track #12345',
        content: `
          <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1976d2; margin: 0;">📦 Package Delivery Update</h2>
              </div>
              
              <p>Hello,</p>
              
              <p>Your package with tracking number <strong>#12345</strong> is ready for delivery.</p>
              
              <div style="background: #f3e5f5; border-left: 4px solid #9c27b0; padding: 15px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Delivery Details:</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Estimated delivery: Today by 6:00 PM</li>
                  <li>Delivery address: [Your Address]</li>
                  <li>Package weight: 2.3 lbs</li>
                </ul>
              </div>
              
              <p>To ensure successful delivery, please confirm your delivery preferences:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/simulations/phishing/landing/delivery-confirm" 
                   style="background: #4caf50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  CONFIRM DELIVERY
                </a>
              </div>
              
              <p>If you have any questions, please contact our customer service team.</p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #666;">
                This email was sent by Delivery Service<br>
                Track your package: <a href="#">delivery-service.com</a>
              </p>
            </div>
          </body>
          </html>
        `,
        senderName: 'Delivery Service',
        senderEmail: 'noreply@delivery-service.com',
        landingPageUrl: 'http://localhost:3000/simulations/phishing/landing/delivery-confirm'
      },
      {
        id: uuidv4(),
        subject: 'Microsoft Teams: New Message from John Smith',
        content: `
          <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #0078d4; margin: 0;">💬 Microsoft Teams Notification</h2>
              </div>
              
              <p>You have a new message in Microsoft Teams</p>
              
              <div style="background: white; border: 1px solid #e1e5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                  <div style="width: 40px; height: 40px; background: #0078d4; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin-right: 15px;">
                    JS
                  </div>
                  <div>
                    <strong>John Smith</strong><br>
                    <span style="color: #666; font-size: 14px;">2 minutes ago</span>
                  </div>
                </div>
                <p style="margin: 0; font-style: italic;">"Hey! Can you check this document? I think there might be an issue with the budget numbers. Click here to review: <a href="http://localhost:3000/simulations/phishing/landing/teams-document" style="color: #0078d4;">View Document</a>"</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/simulations/phishing/landing/teams-document" 
                   style="background: #0078d4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  OPEN IN TEAMS
                </a>
              </div>
              
              <p>This message was sent to you via Microsoft Teams. If you don't recognize this sender, please report it.</p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #666;">
                Microsoft Teams | Microsoft Corporation
              </p>
            </div>
          </body>
          </html>
        `,
        senderName: 'Microsoft Teams',
        senderEmail: 'noreply@teams.microsoft.com',
        landingPageUrl: 'http://localhost:3000/simulations/phishing/landing/teams-document'
      }
    ]

    for (const template of templates) {
      await connection.execute(`
        INSERT INTO phishing_templates (id, campaign_id, subject, content, sender_name, sender_email, landing_page_url, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        template.id,
        campaignId,
        template.subject,
        template.content,
        template.senderName,
        template.senderEmail,
        template.landingPageUrl,
        true
      ])
    }

    // 3. Create Smishing Campaign
    const smishingCampaignId = uuidv4()
    await connection.execute(`
      INSERT INTO phishing_campaigns (id, title, description, type, status, target_groups, start_date, end_date, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      smishingCampaignId,
      'SMS Security Test Campaign',
      'Test employee awareness of SMS-based attacks and social engineering',
      'smishing',
      'active',
      JSON.stringify(['employee']),
      new Date(),
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      adminId
    ])

    // 4. Create Vishing Campaign
    const vishingCampaignId = uuidv4()
    await connection.execute(`
      INSERT INTO phishing_campaigns (id, title, description, type, status, target_groups, start_date, end_date, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      vishingCampaignId,
      'Voice Phishing Awareness Test',
      'Simulate phone-based social engineering attacks to test employee response',
      'vishing',
      'draft',
      JSON.stringify(['manager', 'it_security_admin']),
      new Date(),
      new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      adminId
    ])

    console.log('✅ Phishing simulation data seeded successfully!')
    console.log(`📧 Created ${templates.length} phishing templates`)
    console.log('📱 Created smishing campaign')
    console.log('📞 Created vishing campaign')

  } catch (error) {
    console.error('❌ Error seeding phishing data:', error)
    throw error
  } finally {
    await connection.end()
  }
}

// Run if called directly
if (require.main === module) {
  seedPhishingData()
    .then(() => {
      console.log('🎉 Phishing data seeding completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error)
      process.exit(1)
    })
}

export { seedPhishingData }
