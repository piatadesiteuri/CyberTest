import { Request, Response } from 'express'
import { PhishingService } from '../services/PhishingService'

export class PhishingController {
  private phishingService: PhishingService

  constructor() {
    this.phishingService = new PhishingService()
  }

  // Campaign Management
  async createCampaign(req: Request, res: Response): Promise<void> {
    try {
      const campaign = await this.phishingService.createCampaign(req.body)
      res.status(201).json({
        success: true,
        data: campaign
      })
    } catch (error) {
      console.error('Error creating campaign:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create campaign'
      })
    }
  }

  async getCampaigns(req: Request, res: Response): Promise<void> {
    try {
      const campaigns = await this.phishingService.getCampaigns()
      res.status(200).json({
        success: true,
        data: campaigns
      })
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch campaigns'
      })
    }
  }

  async getCampaignById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const campaign = await this.phishingService.getCampaignById(id)
      
      if (!campaign) {
        res.status(404).json({
          success: false,
          message: 'Campaign not found'
        })
        return
      }

      res.status(200).json({
        success: true,
        data: campaign
      })
    } catch (error) {
      console.error('Error fetching campaign:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch campaign'
      })
    }
  }

  // Template Management
  async createTemplate(req: Request, res: Response): Promise<void> {
    try {
      const template = await this.phishingService.createTemplate(req.body)
      res.status(201).json({
        success: true,
        data: template
      })
    } catch (error) {
      console.error('Error creating template:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create template'
      })
    }
  }

  async getTemplatesByCampaign(req: Request, res: Response): Promise<void> {
    try {
      const { campaignId } = req.params
      const templates = await this.phishingService.getTemplatesByCampaign(campaignId)
      
      res.status(200).json({
        success: true,
        data: templates
      })
    } catch (error) {
      console.error('Error fetching templates:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch templates'
      })
    }
  }

  // Simulation Engine
  async sendPhishingEmail(req: Request, res: Response): Promise<void> {
    try {
      const { templateId, userId, userEmail } = req.body
      
      if (!templateId || !userId || !userEmail) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields: templateId, userId, userEmail'
        })
        return
      }

      const success = await this.phishingService.sendPhishingEmail(templateId, userId, userEmail)
      
      res.status(200).json({
        success,
        message: success ? 'Email sent successfully' : 'Failed to send email'
      })
    } catch (error) {
      console.error('Error sending phishing email:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to send phishing email'
      })
    }
  }

  // Tracking
  async trackEmailOpen(req: Request, res: Response): Promise<void> {
    try {
      const { templateId, userId } = req.body
      const ipAddress = req.ip || req.connection.remoteAddress || ''
      const userAgent = req.get('User-Agent') || ''

      await this.phishingService.trackEmailOpen(templateId, userId, ipAddress, userAgent)
      
      res.status(200).json({
        success: true,
        message: 'Email open tracked'
      })
    } catch (error) {
      console.error('Error tracking email open:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to track email open'
      })
    }
  }

  async trackLinkClick(req: Request, res: Response): Promise<void> {
    try {
      const { templateId, userId } = req.body
      const ipAddress = req.ip || req.connection.remoteAddress || ''
      const userAgent = req.get('User-Agent') || ''

      await this.phishingService.trackLinkClick(templateId, userId, ipAddress, userAgent)
      
      res.status(200).json({
        success: true,
        message: 'Link click tracked'
      })
    } catch (error) {
      console.error('Error tracking link click:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to track link click'
      })
    }
  }

  // Reporting
  async generateReport(req: Request, res: Response): Promise<void> {
    try {
      const { campaignId } = req.params
      const report = await this.phishingService.generateReport(campaignId)
      
      res.status(200).json({
        success: true,
        data: report
      })
    } catch (error) {
      console.error('Error generating report:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to generate report'
      })
    }
  }

  async getResultsByCampaign(req: Request, res: Response): Promise<void> {
    try {
      const { campaignId } = req.params
      const results = await this.phishingService.getResultsByCampaign(campaignId)
      
      res.status(200).json({
        success: true,
        data: results
      })
    } catch (error) {
      console.error('Error fetching results:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch results'
      })
    }
  }
}
