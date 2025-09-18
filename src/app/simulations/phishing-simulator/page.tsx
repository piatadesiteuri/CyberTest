'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, AlertTriangle, CheckCircle, XCircle, Eye, MousePointer, Download, Shield, Clock } from 'lucide-react'

interface PhishingEmail {
  id: string
  subject: string
  sender: string
  senderEmail: string
  content: string
  attachments?: string[]
  links: {
    text: string
    url: string
    isMalicious: boolean
  }[]
  redFlags: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}

const phishingEmails: PhishingEmail[] = [
  {
    id: 'paypal-urgent',
    subject: 'URGENT: Verifică contul în 24 ore sau va fi suspendat!',
    sender: 'PayPal Security Team',
    senderEmail: 'security@paypal-verification.com',
    content: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #dc3545; margin: 0;">⚠️ Security Alert</h2>
        </div>
        
        <p>Dear Valued Customer,</p>
        
        <p>We have detected unusual activity on your PayPal account. For your security, please verify your information immediately.</p>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; color: #856404;"><strong>Action Required:</strong> Click the button below to verify your account within 24 hours, or it will be suspended.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000/simulations/phishing-simulator/landing/paypal-verify" 
             style="background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            VERIFY ACCOUNT NOW
          </a>
        </div>
        
        <p>If you did not request this verification, please contact our support team immediately.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          This email was sent by the PayPal Security Team<br>
          PayPal Inc. | 2211 North First Street | San Jose, CA 95131
        </p>
      </div>
    `,
    attachments: ['paypal_security_update.pdf'],
    links: [
      { text: 'VERIFY ACCOUNT NOW', url: 'http://localhost:3000/simulations/phishing-simulator/landing/paypal-verify', isMalicious: true },
      { text: 'PayPal Official Website', url: 'https://www.paypal.com', isMalicious: false }
    ],
    redFlags: [
      'Urgență excesivă (24 ore)',
      'Sender email suspect (paypal-verification.com)',
      'Cerere de verificare urgentă',
      'Link către site fals'
    ],
    difficulty: 'easy'
  },
  {
    id: 'microsoft-teams',
    subject: 'New Message in Microsoft Teams',
    sender: 'Microsoft Teams',
    senderEmail: 'noreply@teams.microsoft.com',
    content: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
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
          <p style="margin: 0; font-style: italic;">"Hey! Can you check this document? I think there might be an issue with the budget numbers. Click here to review: <a href="http://localhost:3000/simulations/phishing-simulator/landing/teams-document" style="color: #0078d4;">View Document</a>"</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000/simulations/phishing-simulator/landing/teams-document" 
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
    `,
    attachments: ['budget_report.xlsx'],
    links: [
      { text: 'View Document', url: 'http://localhost:3000/simulations/phishing-simulator/landing/teams-document', isMalicious: true },
      { text: 'OPEN IN TEAMS', url: 'http://localhost:3000/simulations/phishing-simulator/landing/teams-document', isMalicious: true }
    ],
    redFlags: [
      'Link suspect în mesaj',
      'Cerere de verificare document',
      'Sender pare legitim dar link-ul este fals'
    ],
    difficulty: 'medium'
  },
  {
    id: 'bank-security',
    subject: 'Important: Security Update Required',
    sender: 'Raiffeisen Bank',
    senderEmail: 'security@raiffeisen-bank.ro',
    content: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #28a745; margin: 0;">🏦 Raiffeisen Bank Security Update</h2>
        </div>
        
        <p>Dear Customer,</p>
        
        <p>We are implementing new security measures to protect your account. Please complete the verification process to ensure uninterrupted access to your banking services.</p>
        
        <div style="background: #d1ecf1; border-left: 4px solid #17a2b8; padding: 15px; margin: 20px 0;">
          <p style="margin: 0;"><strong>What you need to do:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Verify your personal information</li>
            <li>Update your security questions</li>
            <li>Confirm your contact details</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000/simulations/phishing-simulator/landing/bank-verify" 
             style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            COMPLETE VERIFICATION
          </a>
        </div>
        
        <p>This verification is mandatory and must be completed within 48 hours.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          Raiffeisen Bank Romania | Calea Victoriei 15-17 | Bucharest, Romania
        </p>
      </div>
    `,
    attachments: ['security_update.pdf', 'verification_form.pdf'],
    links: [
      { text: 'COMPLETE VERIFICATION', url: 'http://localhost:3000/simulations/phishing-simulator/landing/bank-verify', isMalicious: true },
      { text: 'Raiffeisen Bank Official', url: 'https://www.raiffeisen.ro', isMalicious: false }
    ],
    redFlags: [
      'Cerere de informații personale',
      'Urgență (48 ore)',
      'Link către site fals',
      'Atașamente suspecte'
    ],
    difficulty: 'hard'
  }
]

export default function PhishingSimulatorPage() {
  const router = useRouter()
  const [currentEmail, setCurrentEmail] = useState(0)
  const [userActions, setUserActions] = useState<{
    emailOpened: boolean
    linksClicked: string[]
    attachmentsDownloaded: string[]
    formSubmitted: boolean
    reported: boolean
  }>({
    emailOpened: false,
    linksClicked: [],
    attachmentsDownloaded: [],
    formSubmitted: false,
    reported: false
  })
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)

  const email = phishingEmails[currentEmail]

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1)
    }, 1000)

    // Add event listener for link clicks
    const handleLinkClickEvent = (event: CustomEvent) => {
      const { url, isMalicious } = event.detail
      handleLinkClick(url, isMalicious)
    }

    window.addEventListener('linkClick', handleLinkClickEvent as EventListener)

    return () => {
      clearInterval(timer)
      window.removeEventListener('linkClick', handleLinkClickEvent as EventListener)
    }
  }, [])

  const handleLinkClick = (linkUrl: string, isMalicious: boolean) => {
    console.log('Link clicked:', linkUrl, 'Malicious:', isMalicious)
    
    setUserActions(prev => ({
      ...prev,
      linksClicked: [...prev.linksClicked, linkUrl]
    }))
    
    // Always show analysis after clicking a link
    setTimeout(() => {
      setShowAnalysis(true)
    }, 1000)
  }

  const handleAttachmentDownload = (filename: string) => {
    console.log('Attachment downloaded:', filename)
    
    setUserActions(prev => ({
      ...prev,
      attachmentsDownloaded: [...prev.attachmentsDownloaded, filename]
    }))
    
    // Always show analysis after downloading
    setTimeout(() => {
      setShowAnalysis(true)
    }, 1000)
  }

  const handleFormSubmit = () => {
    console.log('Form submitted')
    
    setUserActions(prev => ({
      ...prev,
      formSubmitted: true
    }))
    
    setTimeout(() => {
      setShowAnalysis(true)
    }, 1000)
  }

  const handleReport = () => {
    console.log('Phishing reported')
    
    setUserActions(prev => ({
      ...prev,
      reported: true
    }))
    
    setTimeout(() => {
      setShowAnalysis(true)
    }, 1000)
  }

  const getVulnerabilityScore = () => {
    let score = 0
    if (userActions.linksClicked.length > 0) score += 30
    if (userActions.attachmentsDownloaded.length > 0) score += 40
    if (userActions.formSubmitted) score += 30
    if (userActions.reported) score -= 50
    return Math.max(0, score)
  }

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: 'HIGH', color: 'text-red-600', bg: 'bg-red-100' }
    if (score >= 40) return { level: 'MEDIUM', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { level: 'LOW', color: 'text-green-600', bg: 'bg-green-100' }
  }

  if (showAnalysis) {
    const vulnerabilityScore = getVulnerabilityScore()
    const riskLevel = getRiskLevel(vulnerabilityScore)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-red-600 text-white px-6 py-4">
              <h1 className="text-2xl font-bold">🔍 Analiza Comportamentului Tău</h1>
              <p className="text-red-100">Simularea s-a încheiat - iată ce ai făcut</p>
            </div>
            
            <div className="p-8">
              <div className="text-center mb-8">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${riskLevel.bg}`}>
                  <Shield className={`w-12 h-12 ${riskLevel.color}`} />
                </div>
                <h2 className={`text-3xl font-bold mb-2 ${riskLevel.color}`}>
                  Nivel de Risc: {riskLevel.level}
                </h2>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  Scor Vulnerabilitate: {vulnerabilityScore}%
                </p>
                <p className="text-gray-600 mb-4">
                  Timp petrecut: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
                </p>
                
                {/* Clear explanation */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Ce înseamnă acest scor?</h3>
                  <div className="text-sm text-blue-700 space-y-1">
                    {vulnerabilityScore === 0 && (
                      <p>✅ <strong>Excelent!</strong> Nu ai făcut nicio greșeală. Ai identificat corect că este phishing!</p>
                    )}
                    {vulnerabilityScore > 0 && vulnerabilityScore < 50 && (
                      <p>⚠️ <strong>Bun, dar poți mai bine!</strong> Ai făcut câteva greșeli, dar ai evitat cele mai periculoase.</p>
                    )}
                    {vulnerabilityScore >= 50 && (
                      <p>❌ <strong>Periculos!</strong> Ai făcut multe greșeli care te-ar fi pus în pericol în realitate.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Acțiuni Tale:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Email deschis</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Link-uri clickate: {userActions.linksClicked.length}</span>
                      {userActions.linksClicked.length > 0 ? (
                        <div className="flex items-center">
                          <XCircle className="w-5 h-5 text-red-500 mr-2" />
                          <span className="text-sm text-red-600">GREȘEALĂ!</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-sm text-green-600">CORECT!</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Atașamente descărcate: {userActions.attachmentsDownloaded.length}</span>
                      {userActions.attachmentsDownloaded.length > 0 ? (
                        <div className="flex items-center">
                          <XCircle className="w-5 h-5 text-red-500 mr-2" />
                          <span className="text-sm text-red-600">GREȘEALĂ!</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-sm text-green-600">CORECT!</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Formular completat</span>
                      {userActions.formSubmitted ? (
                        <div className="flex items-center">
                          <XCircle className="w-5 h-5 text-red-500 mr-2" />
                          <span className="text-sm text-red-600">GREȘEALĂ!</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-sm text-green-600">CORECT!</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Raportat ca phishing</span>
                      {userActions.reported ? (
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-sm text-green-600">CORECT!</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <XCircle className="w-5 h-5 text-red-500 mr-2" />
                          <span className="text-sm text-red-600">GREȘEALĂ!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Semne de Avertizare:</h3>
                  <div className="space-y-2">
                    {email.redFlags.map((flag, index) => (
                      <div key={index} className="flex items-center text-sm text-red-600">
                        <XCircle className="w-4 h-4 mr-2" />
                        {flag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Lecții Învățate:</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• <strong>Verifică sender-ul:</strong> Email-ul pare de la PayPal, dar adresa este "paypal-verification.com" - FALS!</li>
                  <li>• <strong>Nu da click pe link-uri:</strong> Link-urile te duc pe site-uri false care fură datele tale</li>
                  <li>• <strong>Nu descărca atașamente:</strong> Atașamentele pot conține viruși sau malware</li>
                  <li>• <strong>Raportează phishing-ul:</strong> Când ești în dubii, raportează email-ul ca phishing</li>
                  <li>• <strong>Verifică URL-ul:</strong> Hover peste link-uri și vezi dacă URL-ul pare suspect</li>
                </ul>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setCurrentEmail((currentEmail + 1) % phishingEmails.length)
                    setUserActions({
                      emailOpened: false,
                      linksClicked: [],
                      attachmentsDownloaded: [],
                      formSubmitted: false,
                      reported: false
                    })
                    setShowAnalysis(false)
                    setTimeSpent(0)
                  }}
                  className="bg-warm-copper text-white px-6 py-3 rounded-lg font-medium hover:bg-warm-bronze transition-colors"
                >
                  Următorul Email
                </button>
                
                <button
                  onClick={() => router.push('/simulations')}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Înapoi la Tutorial-uri
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/simulations')}
              className="flex items-center text-gray-600 hover:text-warm-copper transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Tutorials</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Email {currentEmail + 1} of {phishingEmails.length}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Email Simulator */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {/* Email Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{email.subject}</h2>
                <p className="text-sm text-gray-600">From: {email.sender} &lt;{email.senderEmail}&gt;</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  email.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  email.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {email.difficulty.toUpperCase()}
                </span>
                <button
                  onClick={handleReport}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Report Phishing
                </button>
              </div>
            </div>
          </div>

          {/* Email Content */}
          <div className="p-6">
            <div 
              className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ 
                __html: email.content.replace(
                  /href="([^"]*)"/g, 
                  (match, url) => {
                    const link = email.links.find(l => l.url === url)
                    return `href="javascript:void(0)" onclick="window.handleLinkClick('${url}', ${link?.isMalicious || false})"`
                  }
                )
              }}
            />
          </div>

          {/* Attachments */}
          {email.attachments && email.attachments.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Attachments</h3>
              <div className="space-y-2">
                {email.attachments.map((filename, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center">
                      <Download className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">{filename}</span>
                    </div>
                    <button
                      onClick={() => handleAttachmentDownload(filename)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Instrucțiuni pentru Simulare</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Interacționează cu acest email ca și cum ar fi real. Analizează-l cu atenție și decide ce acțiuni să iei.
                Simularea se va încheia când vei face o acțiune (click pe link, download, completare formular).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add JavaScript for link handling */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.handleLinkClick = function(url, isMalicious) {
              console.log('Link clicked:', url, 'Malicious:', isMalicious);
              // Trigger React event
              const event = new CustomEvent('linkClick', { 
                detail: { url, isMalicious } 
              });
              window.dispatchEvent(event);
            };
          `
        }}
      />
    </div>
  )
}
