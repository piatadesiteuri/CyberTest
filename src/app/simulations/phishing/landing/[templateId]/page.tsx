'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Shield, AlertTriangle, CheckCircle, XCircle, ArrowLeft, Eye, MousePointer, Download, FileText } from 'lucide-react'

interface PhishingTemplate {
  id: string
  subject: string
  content: string
  senderName: string
  senderEmail: string
  landingPageUrl: string
}

interface SimulationResult {
  action: string
  timestamp: string
  userAgent: string
  ipAddress: string
}

export default function PhishingLandingPage() {
  const { templateId } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const [template, setTemplate] = useState<PhishingTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [showResult, setShowResult] = useState(false)
  const [userAction, setUserAction] = useState<string>('')
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    // Track page visit
    trackAction('email_opened')
  }, [])

  const trackAction = async (action: string) => {
    try {
      await fetch('http://localhost:3001/api/phishing/track/open', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: templateId,
          userId: user?.id || 'anonymous'
        })
      })
    } catch (error) {
      console.error('Error tracking action:', error)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Track form submission
    await trackAction('form_submitted')
    
    setUserAction('form_submitted')
    setShowResult(true)
  }

  const handleLinkClick = async () => {
    await trackAction('link_clicked')
    setUserAction('link_clicked')
    setShowResult(true)
  }

  const handleAttachmentDownload = async () => {
    await trackAction('attachment_downloaded')
    setUserAction('attachment_downloaded')
    setShowResult(true)
  }

  const handleReportPhishing = async () => {
    await trackAction('reported')
    setUserAction('reported')
    setShowResult(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading simulation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {!showResult ? (
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Fake Website Header */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <div className="bg-red-600 text-white px-6 py-4">
              <h1 className="text-2xl font-bold">⚠️ PHISHING SIMULATION ACTIVE</h1>
              <p className="text-red-100">This is a test page to evaluate your security awareness</p>
            </div>
            
            <div className="p-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Security Training Notice</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      This is a simulated phishing attack designed to test your security awareness. 
                      No real data will be collected or stored.
                    </p>
                  </div>
                </div>
              </div>

              {/* Fake Login Form */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Verification Required</h2>
                <p className="text-gray-600 mb-6">
                  Please verify your account information to continue. This helps us protect your account from unauthorized access.
                </p>
                
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username or Email
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter your username or email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter your password"
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Account
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleReportPhishing}
                      className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Report Phishing
                    </button>
                  </div>
                </form>
              </div>

              {/* Fake Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={handleLinkClick}
                  className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <MousePointer className="w-5 h-5 mr-2" />
                  Click to View Document
                </button>
                
                <button
                  onClick={handleAttachmentDownload}
                  className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Attachment
                </button>
              </div>

              {/* Fake Attachments */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Attachments</h3>
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900">budget_report.xlsx</p>
                    <p className="text-sm text-gray-500">2.3 MB • Excel Spreadsheet</p>
                  </div>
                  <button
                    onClick={handleAttachmentDownload}
                    className="ml-auto bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-green-600 text-white px-6 py-4">
              <h1 className="text-2xl font-bold">🎉 Simulation Complete!</h1>
              <p className="text-green-100">Thank you for participating in our security awareness training</p>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Awareness Test Results</h2>
                <p className="text-gray-600">
                  Your response has been recorded for training purposes.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What You Did:</h3>
                <div className="flex items-center space-x-3">
                  {userAction === 'form_submitted' && (
                    <>
                      <CheckCircle className="w-6 h-6 text-red-500" />
                      <span className="text-gray-700">You submitted a form with fake credentials</span>
                    </>
                  )}
                  {userAction === 'link_clicked' && (
                    <>
                      <MousePointer className="w-6 h-6 text-orange-500" />
                      <span className="text-gray-700">You clicked on a suspicious link</span>
                    </>
                  )}
                  {userAction === 'attachment_downloaded' && (
                    <>
                      <Download className="w-6 h-6 text-yellow-500" />
                      <span className="text-gray-700">You downloaded a suspicious attachment</span>
                    </>
                  )}
                  {userAction === 'reported' && (
                    <>
                      <Shield className="w-6 h-6 text-green-500" />
                      <span className="text-gray-700">You correctly identified and reported the phishing attempt</span>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Learning Points:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Always verify the sender's email address before clicking links</li>
                  <li>• Never enter credentials on suspicious websites</li>
                  <li>• Be cautious of urgent or threatening language in emails</li>
                  <li>• When in doubt, contact IT support or report suspicious emails</li>
                </ul>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/simulations')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Simulations
                </button>
                
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
