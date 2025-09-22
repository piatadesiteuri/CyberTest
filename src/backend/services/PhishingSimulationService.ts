import DatabaseConnection from '../utils/DatabaseConnection';
const { v4: uuidv4 } = require('uuid');

export interface PhishingSimulationSession {
  id: string;
  userId: string;
  campaignId: string;
  templateId: string;
  status: 'started' | 'in_progress' | 'completed' | 'abandoned';
  startTime: Date;
  endTime: Date | null;
  actions: PhishingAction[];
  vulnerabilityScore: number;
  completed: boolean;
  feedback?: string;
}

export interface PhishingAction {
  type: 'email_opened' | 'link_clicked' | 'attachment_downloaded' | 'form_submitted' | 'reported';
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  additionalData?: any;
}

export interface PhishingCampaign {
  id: string;
  title: string;
  description: string;
  type: 'phishing' | 'smishing' | 'vishing';
  status: 'draft' | 'active' | 'paused' | 'completed';
  targetGroups: string[];
  startDate: Date;
  endDate: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PhishingTemplate {
  id: string;
  campaignId: string;
  subject: string;
  content: string;
  senderName: string;
  senderEmail: string;
  landingPageUrl: string;
  isActive: boolean;
  createdAt: Date;
}

export class PhishingSimulationService {
  private db = DatabaseConnection.getInstance();

  async createSimulationSession(userId: string, campaignId: string, templateId: string): Promise<PhishingSimulationSession> {
    const sessionId = uuidv4();
    const session: PhishingSimulationSession = {
      id: sessionId,
      userId,
      campaignId,
      templateId,
      status: 'started',
      startTime: new Date(),
      endTime: null,
      actions: [],
      vulnerabilityScore: 0,
      completed: false,
    };

    try {
      await this.db.getPool().execute(
        `INSERT INTO simulation_sessions (id, user_id, campaign_id, template_id, start_time, actions, vulnerability_score, completed) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [sessionId, userId, campaignId, templateId, session.startTime, JSON.stringify([]), 0, false]
      );
      
      console.log('Created simulation session:', session);
      return session;
    } catch (error) {
      console.error('Error creating simulation session:', error);
      throw new Error('Failed to create simulation session');
    }
  }

  async updateSimulationSession(sessionId: string, updates: Partial<PhishingSimulationSession>): Promise<PhishingSimulationSession | null> {
    try {
      const updateFields = [];
      const updateValues = [];

      if (updates.status !== undefined) {
        updateFields.push('status = ?');
        updateValues.push(updates.status);
      }
      if (updates.endTime !== undefined) {
        updateFields.push('end_time = ?');
        updateValues.push(updates.endTime);
      }
      if (updates.actions !== undefined) {
        updateFields.push('actions = ?');
        updateValues.push(JSON.stringify(updates.actions));
      }
      if (updates.vulnerabilityScore !== undefined) {
        updateFields.push('vulnerability_score = ?');
        updateValues.push(updates.vulnerabilityScore);
      }
      if (updates.completed !== undefined) {
        updateFields.push('completed = ?');
        updateValues.push(updates.completed);
      }

      if (updateFields.length === 0) {
        return await this.getSimulationSession(sessionId);
      }

      updateValues.push(sessionId);
      await this.db.getPool().execute(
        `UPDATE simulation_sessions SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      return await this.getSimulationSession(sessionId);
    } catch (error) {
      console.error('Error updating simulation session:', error);
      throw new Error('Failed to update simulation session');
    }
  }

  async getSimulationSession(sessionId: string): Promise<PhishingSimulationSession | null> {
    try {
      const [rows] = await this.db.getPool().execute(
        `SELECT * FROM simulation_sessions WHERE id = ?`,
        [sessionId]
      );

      const sessions = rows as any[];
      if (sessions.length === 0) {
        return null;
      }

      const session = sessions[0];
      return {
        id: session.id,
        userId: session.user_id,
        campaignId: session.campaign_id,
        templateId: session.template_id,
        status: session.status,
        startTime: session.start_time,
        endTime: session.end_time,
        actions: session.actions ? JSON.parse(session.actions) : [],
        vulnerabilityScore: session.vulnerability_score,
        completed: session.completed,
      };
    } catch (error) {
      console.error('Error getting simulation session:', error);
      throw new Error('Failed to get simulation session');
    }
  }

  async getActiveCampaigns(): Promise<PhishingCampaign[]> {
    try {
      console.log('Fetching active campaigns...');
      const [rows] = await this.db.getPool().execute(
        `SELECT * FROM phishing_campaigns WHERE status = 'active' AND start_date <= NOW() AND end_date >= NOW()`
      );

      console.log('Raw campaigns data:', rows);
      const campaigns = rows as any[];
      const mappedCampaigns = campaigns.map(campaign => {
        // Handle target_groups - it might be stored as comma-separated string or JSON
        let targetGroups = [];
        try {
          if (campaign.target_groups) {
            if (typeof campaign.target_groups === 'string') {
              if (campaign.target_groups.startsWith('[')) {
                // It's JSON
                targetGroups = JSON.parse(campaign.target_groups);
              } else {
                // It's comma-separated string
                targetGroups = campaign.target_groups.split(',').map((group: string) => group.trim());
              }
            } else {
              targetGroups = campaign.target_groups;
            }
          }
        } catch (error) {
          console.warn('Error parsing target_groups:', error);
          targetGroups = [];
        }

        return {
          id: campaign.id,
          title: campaign.title,
          description: campaign.description,
          type: campaign.type,
          status: campaign.status,
          targetGroups,
          startDate: campaign.start_date,
          endDate: campaign.end_date,
          createdBy: campaign.created_by,
          createdAt: campaign.created_at,
          updatedAt: campaign.updated_at,
        };
      });
      
      console.log('Mapped campaigns:', mappedCampaigns);
      return mappedCampaigns;
    } catch (error) {
      console.error('Error getting active campaigns:', error);
      throw new Error('Failed to get active campaigns');
    }
  }

  async getTemplatesByCampaign(campaignId: string): Promise<PhishingTemplate[]> {
    try {
      const [rows] = await this.db.getPool().execute(
        `SELECT * FROM phishing_templates WHERE campaign_id = ? AND is_active = true`,
        [campaignId]
      );

      const templates = rows as any[];
      return templates.map(template => ({
        id: template.id,
        campaignId: template.campaign_id,
        subject: template.subject,
        content: template.content,
        senderName: template.sender_name,
        senderEmail: template.sender_email,
        landingPageUrl: template.landing_page_url,
        isActive: template.is_active,
        createdAt: template.created_at,
      }));
    } catch (error) {
      console.error('Error getting templates by campaign:', error);
      throw new Error('Failed to get templates by campaign');
    }
  }

  async addActionToSession(sessionId: string, action: PhishingAction): Promise<void> {
    try {
      const session = await this.getSimulationSession(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      const updatedActions = [...session.actions, action];
      const vulnerabilityScore = this.calculateVulnerabilityScore(updatedActions);

      await this.updateSimulationSession(sessionId, {
        actions: updatedActions,
        vulnerabilityScore,
      });

      // Also track in phishing_results table
      await this.db.getPool().execute(
        `INSERT INTO phishing_results (id, campaign_id, user_id, template_id, action, timestamp, ip_address, user_agent, additional_data) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [uuidv4(), session.campaignId, session.userId, session.templateId, action.type, action.timestamp, action.ipAddress, action.userAgent, JSON.stringify(action.additionalData)]
      );
    } catch (error) {
      console.error('Error adding action to session:', error);
      throw new Error('Failed to add action to session');
    }
  }

  private calculateVulnerabilityScore(actions: PhishingAction[]): number {
    let score = 0;
    
    // Base score for starting simulation
    if (actions.length > 0) {
      score += 10;
    }

    // Email opened
    if (actions.some(a => a.type === 'email_opened')) {
      score += 20;
    }

    // Link clicked
    if (actions.some(a => a.type === 'link_clicked')) {
      score += 30;
    }

    // Form submitted (high risk)
    if (actions.some(a => a.type === 'form_submitted')) {
      score += 40;
    }

    // Attachment downloaded (very high risk)
    if (actions.some(a => a.type === 'attachment_downloaded')) {
      score += 50;
    }

    // Reported (good behavior, reduces score)
    if (actions.some(a => a.type === 'reported')) {
      score = Math.max(0, score - 30);
    }

    return Math.min(100, score);
  }
}