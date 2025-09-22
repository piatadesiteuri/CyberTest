import { Request, Response } from 'express';
import { PhishingSimulationService } from '../services/PhishingSimulationService';

export class PhishingSimulationController {
  private phishingSimulationService: PhishingSimulationService;

  constructor() {
    this.phishingSimulationService = new PhishingSimulationService();
  }

  async startSimulation(req: Request, res: Response): Promise<void> {
    try {
      const { userId, campaignId, templateId } = req.body;
      
      if (!userId || !campaignId || !templateId) {
        res.status(400).json({ 
          success: false, 
          message: 'Missing required fields: userId, campaignId, templateId' 
        });
        return;
      }

      const session = await this.phishingSimulationService.createSimulationSession(userId, campaignId, templateId);
      
      res.status(201).json({ 
        success: true, 
        data: session 
      });
    } catch (error) {
      console.error('Error starting phishing simulation:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to start phishing simulation' 
      });
    }
  }

  async updateSimulation(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const updates = req.body;
      
      const updatedSession = await this.phishingSimulationService.updateSimulationSession(sessionId, updates);
      
      if (updatedSession) {
        res.status(200).json({ 
          success: true, 
          data: updatedSession 
        });
      } else {
        res.status(404).json({ 
          success: false, 
          message: 'Simulation session not found' 
        });
      }
    } catch (error) {
      console.error('Error updating phishing simulation:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update phishing simulation' 
      });
    }
  }

  async getSimulation(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      
      const session = await this.phishingSimulationService.getSimulationSession(sessionId);
      
      if (session) {
        res.status(200).json({ 
          success: true, 
          data: session 
        });
      } else {
        res.status(404).json({ 
          success: false, 
          message: 'Simulation session not found' 
        });
      }
    } catch (error) {
      console.error('Error getting phishing simulation:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get phishing simulation' 
      });
    }
  }

  async getActiveCampaigns(req: Request, res: Response): Promise<void> {
    try {
      const campaigns = await this.phishingSimulationService.getActiveCampaigns();
      
      res.status(200).json({ 
        success: true, 
        data: campaigns 
      });
    } catch (error) {
      console.error('Error getting active campaigns:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get active campaigns' 
      });
    }
  }

  async getTemplatesByCampaign(req: Request, res: Response): Promise<void> {
    try {
      const { campaignId } = req.params;
      
      const templates = await this.phishingSimulationService.getTemplatesByCampaign(campaignId);
      
      res.status(200).json({ 
        success: true, 
        data: templates 
      });
    } catch (error) {
      console.error('Error getting templates by campaign:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get templates by campaign' 
      });
    }
  }

  async trackAction(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const { actionType, ipAddress, userAgent, additionalData } = req.body;
      
      if (!actionType) {
        res.status(400).json({ 
          success: false, 
          message: 'Missing required field: actionType' 
        });
        return;
      }

      const action = {
        type: actionType,
        timestamp: new Date(),
        ipAddress,
        userAgent,
        additionalData
      };

      await this.phishingSimulationService.addActionToSession(sessionId, action);
      
      res.status(200).json({ 
        success: true, 
        message: 'Action tracked successfully' 
      });
    } catch (error) {
      console.error('Error tracking action:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to track action' 
      });
    }
  }
}