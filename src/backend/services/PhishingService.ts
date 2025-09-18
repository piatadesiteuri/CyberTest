import mysql from 'mysql2/promise'
import { databaseConfig } from '../../config/database'
import { PhishingCampaign, PhishingTemplate, PhishingResult, PhishingReport } from '../entities/PhishingCampaign'
import { v4 as uuidv4 } from 'uuid'

export class PhishingService {
  private connection: mysql.Connection

  constructor() {
    this.connection = null as any
  }

  async connect() {
    if (!this.connection) {
      this.connection = await mysql.createConnection(databaseConfig)
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end()
      this.connection = null as any
    }
  }

  private parseJsonField(field: any): any {
    if (!field) return []
    if (typeof field === 'string') {
      try {
        return JSON.parse(field)
      } catch {
        // If it's not valid JSON, try to split by comma
        return field.split(',').map((item: string) => item.trim())
      }
    }
    return Array.isArray(field) ? field : field || []
  }

  // Campaign Management
  async createCampaign(campaign: Omit<PhishingCampaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<PhishingCampaign> {
    await this.connect()
    
    const id = uuidv4()
    const now = new Date()
    
    await this.connection.execute(`
      INSERT INTO phishing_campaigns (id, title, description, type, status, target_groups, start_date, end_date, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      campaign.title,
      campaign.description,
      campaign.type,
      campaign.status,
      JSON.stringify(campaign.targetGroups),
      campaign.startDate,
      campaign.endDate,
      campaign.createdBy,
      now,
      now
    ])

    return {
      ...campaign,
      id,
      createdAt: now,
      updatedAt: now
    }
  }

  async getCampaigns(): Promise<PhishingCampaign[]> {
    await this.connect()
    
    const [rows] = await this.connection.execute(`
      SELECT * FROM phishing_campaigns ORDER BY created_at DESC
    `)

    return (rows as any[]).map(row => ({
      ...row,
      targetGroups: this.parseJsonField(row.target_groups),
      startDate: new Date(row.start_date),
      endDate: new Date(row.end_date),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }))
  }

  async getCampaignById(id: string): Promise<PhishingCampaign | null> {
    await this.connect()
    
    const [rows] = await this.connection.execute(`
      SELECT * FROM phishing_campaigns WHERE id = ?
    `, [id])

    const row = (rows as any[])[0]
    if (!row) return null

    return {
      ...row,
      targetGroups: this.parseJsonField(row.target_groups),
      startDate: new Date(row.start_date),
      endDate: new Date(row.end_date),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }
  }

  // Template Management
  async createTemplate(template: Omit<PhishingTemplate, 'id' | 'createdAt'>): Promise<PhishingTemplate> {
    await this.connect()
    
    const id = uuidv4()
    const now = new Date()
    
    await this.connection.execute(`
      INSERT INTO phishing_templates (id, campaign_id, subject, content, sender_name, sender_email, landing_page_url, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      template.campaignId,
      template.subject,
      template.content,
      template.senderName,
      template.senderEmail,
      template.landingPageUrl,
      template.isActive,
      now
    ])

    return {
      ...template,
      id,
      createdAt: now
    }
  }

  async getTemplatesByCampaign(campaignId: string): Promise<PhishingTemplate[]> {
    await this.connect()
    
    const [rows] = await this.connection.execute(`
      SELECT * FROM phishing_templates WHERE campaign_id = ? ORDER BY created_at DESC
    `, [campaignId])

    return (rows as any[]).map(row => ({
      ...row,
      createdAt: new Date(row.created_at)
    }))
  }

  // Result Tracking
  async recordResult(result: Omit<PhishingResult, 'id' | 'timestamp'>): Promise<PhishingResult> {
    await this.connect()
    
    const id = uuidv4()
    const now = new Date()
    
    await this.connection.execute(`
      INSERT INTO phishing_results (id, campaign_id, user_id, template_id, action, timestamp, ip_address, user_agent, additional_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      result.campaignId,
      result.userId,
      result.templateId,
      result.action,
      now,
      result.ipAddress,
      result.userAgent,
      JSON.stringify(result.additionalData || {})
    ])

    return {
      ...result,
      id,
      timestamp: now
    }
  }

  async getResultsByCampaign(campaignId: string): Promise<PhishingResult[]> {
    await this.connect()
    
    const [rows] = await this.connection.execute(`
      SELECT * FROM phishing_results WHERE campaign_id = ? ORDER BY timestamp DESC
    `, [campaignId])

    return (rows as any[]).map(row => ({
      ...row,
      timestamp: new Date(row.timestamp),
      additionalData: this.parseJsonField(row.additional_data) || {}
    }))
  }

  // Reporting
  async generateReport(campaignId: string): Promise<PhishingReport> {
    await this.connect()
    
    // Get campaign results
    const results = await this.getResultsByCampaign(campaignId)
    
    // Calculate metrics
    const totalSent = results.length
    const totalOpened = results.filter(r => r.action === 'email_opened').length
    const totalClicked = results.filter(r => r.action === 'link_clicked').length
    const totalReported = results.filter(r => r.action === 'reported').length
    
    // Calculate vulnerability score (higher = more vulnerable)
    const vulnerabilityScore = totalSent > 0 ? 
      ((totalOpened + totalClicked) / totalSent) * 100 : 0

    const reportId = uuidv4()
    const now = new Date()
    
    await this.connection.execute(`
      INSERT INTO phishing_reports (id, campaign_id, total_sent, total_opened, total_clicked, total_reported, vulnerability_score, generated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      reportId,
      campaignId,
      totalSent,
      totalOpened,
      totalClicked,
      totalReported,
      vulnerabilityScore,
      now
    ])

    return {
      id: reportId,
      campaignId,
      totalSent,
      totalOpened,
      totalClicked,
      totalReported,
      vulnerabilityScore,
      generatedAt: now
    }
  }

  // Simulation Engine
  async sendPhishingEmail(templateId: string, userId: string, userEmail: string): Promise<boolean> {
    try {
      // In a real implementation, this would:
      // 1. Get template from database
      // 2. Personalize content
      // 3. Send via email service (SendGrid, AWS SES, etc.)
      // 4. Track delivery
      
      console.log(`📧 Sending phishing email to ${userEmail} using template ${templateId}`)
      
      // For now, just simulate sending
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return true
    } catch (error) {
      console.error('❌ Error sending phishing email:', error)
      return false
    }
  }

  async trackEmailOpen(templateId: string, userId: string, ipAddress: string, userAgent: string): Promise<void> {
    await this.recordResult({
      campaignId: '', // Would need to get from template
      userId,
      templateId,
      action: 'email_opened',
      ipAddress,
      userAgent
    })
  }

  async trackLinkClick(templateId: string, userId: string, ipAddress: string, userAgent: string): Promise<void> {
    await this.recordResult({
      campaignId: '', // Would need to get from template
      userId,
      templateId,
      action: 'link_clicked',
      ipAddress,
      userAgent
    })
  }
}
