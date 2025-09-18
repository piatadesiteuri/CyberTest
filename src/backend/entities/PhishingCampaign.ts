export interface PhishingCampaign {
  id: string
  title: string
  description: string
  type: 'phishing' | 'smishing' | 'vishing'
  status: 'draft' | 'active' | 'paused' | 'completed'
  targetGroups: string[] // department IDs or user roles
  startDate: Date
  endDate: Date
  templates: PhishingTemplate[]
  results: PhishingResult[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface PhishingTemplate {
  id: string
  campaignId: string
  subject: string
  content: string
  senderName: string
  senderEmail: string
  landingPageUrl?: string
  attachments?: PhishingAttachment[]
  isActive: boolean
  createdAt: Date
}

export interface PhishingAttachment {
  id: string
  templateId: string
  filename: string
  filePath: string
  fileType: string
  isMalicious: boolean
  createdAt: Date
}

export interface PhishingResult {
  id: string
  campaignId: string
  userId: string
  templateId: string
  action: 'email_opened' | 'link_clicked' | 'attachment_downloaded' | 'form_submitted' | 'reported'
  timestamp: Date
  ipAddress: string
  userAgent: string
  additionalData?: any
}

export interface PhishingReport {
  id: string
  campaignId: string
  totalSent: number
  totalOpened: number
  totalClicked: number
  totalReported: number
  vulnerabilityScore: number
  generatedAt: Date
}
