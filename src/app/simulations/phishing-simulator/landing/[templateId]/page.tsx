'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Shield, AlertTriangle, CheckCircle, XCircle, ArrowLeft, Eye, MousePointer, Download, FileText, Lock } from 'lucide-react'

interface LandingPageData {
  id: string
  title: string
  description: string
  formFields: {
    label: string
    type: string
    required: boolean
    placeholder: string
  }[]
  attachments: {
    name: string
    size: string
    type: string
  }[]
  isMalicious: boolean
  redFlags: string[]
}

const landingPages: { [key: string]: LandingPageData } = {
  'paypal-verify': {
    id: 'paypal-verify',
    title: 'PayPal Account Verification',
    description: 'Please verify your account information to continue using PayPal services.',
    formFields: [
      { label: 'Email Address', type: 'email', required: true, placeholder: 'Enter your email' },
      { label: 'Password', type: 'password', required: true, placeholder: 'Enter your password' },
      { label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full name' },
      { label: 'Phone Number', type: 'tel', required: true, placeholder: 'Enter your phone number' }
    ],
    attachments: [
      { name: 'paypal_security_update.pdf', size: '2.3 MB', type: 'PDF Document' }
    ],
    isMalicious: true,
    redFlags: [
      'URL suspect (localhost în loc de paypal.com)',
      'Cerere de informații sensibile',
      'Design simplu și neprofesional',
      'Lipsă de certificat SSL valid'
    ]
  },
  'teams-document': {
    id: 'teams-document',
    title: 'Microsoft Teams Document Viewer',
    description: 'View and edit your shared document in Microsoft Teams.',
    formFields: [
      { label: 'Microsoft Account', type: 'email', required: true, placeholder: 'Enter your Microsoft account' },
      { label: 'Password', type: 'password', required: true, placeholder: 'Enter your password' }
    ],
    attachments: [
      { name: 'budget_report.xlsx', size: '1.8 MB', type: 'Excel Spreadsheet' }
    ],
    isMalicious: true,
    redFlags: [
      'URL fals (localhost în loc de teams.microsoft.com)',
      'Cerere de credențiale Microsoft',
      'Design diferit de Teams oficial',
      'Lipsă de autentificare Microsoft'
    ]
  },
  'bank-verify': {
    id: 'bank-verify',
    title: 'Raiffeisen Bank Security Verification',
    description: 'Complete your security verification to maintain access to your banking services.',
    formFields: [
      { label: 'Account Number', type: 'text', required: true, placeholder: 'Enter your account number' },
      { label: 'PIN Code', type: 'password', required: true, placeholder: 'Enter your PIN' },
      { label: 'Social Security Number', type: 'text', required: true, placeholder: 'Enter your SSN' },
      { label: 'Mother\'s Maiden Name', type: 'text', required: true, placeholder: 'Enter your mother\'s maiden name' }
    ],
    attachments: [
      { name: 'security_update.pdf', size: '3.1 MB', type: 'PDF Document' },
      { name: 'verification_form.pdf', size: '1.2 MB', type: 'PDF Document' }
    ],
    isMalicious: true,
    redFlags: [
      'URL suspect (localhost în loc de raiffeisen.ro)',
      'Cerere de informații bancare sensibile',
      'Design simplu pentru o bancă',
      'Lipsă de certificat bancar valid'
    ]
  }
}

export default function PhishingLandingPage() {
  const { templateId } = useParams()
  const router = useRouter()
  const [formData, setFormData] = useState<{ [key: string]: string }>({})
  const [showResult, setShowResult] = useState(false)
  const [userAction, setUserAction] = useState<string>('')

  const pageData = landingPages[templateId as string]

  useEffect(() => {
    if (!pageData) {
      router.push('/simulations')
      return
    }
  }, [pageData, router])

  if (!pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading simulation...</p>
        </div>
      </div>
    )
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUserAction('form_submitted')
    setShowResult(true)
  }

  const handleAttachmentDownload = (filename: string) => {
    setUserAction('attachment_downloaded')
    setShowResult(true)
  }

  const handleReportPhishing = () => {
    setUserAction('reported')
    setShowResult(true)
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-red-600 text-white px-6 py-4">
              <h1 className="text-2xl font-bold">⚠️ SIMULARE DE PHISHING DETECTATĂ!</h1>
              <p className="text-red-100">Aceasta a fost o simulare - iată ce ai făcut</p>
            </div>
            
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-12 h-12 text-red-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {userAction === 'reported' ? 'Excelent! 🎉' : 'Ai fost păcălit! 😔'}
                </h2>
                <p className="text-lg text-gray-600">
                  {userAction === 'reported' 
                    ? 'Ai identificat corect simularea de phishing!'
                    : 'Ai interacționat cu o pagină falsă de phishing.'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ce ai făcut:</h3>
                  <div className="space-y-3">
                    {userAction === 'form_submitted' && (
                      <div className="flex items-center text-red-600">
                        <XCircle className="w-5 h-5 mr-2" />
                        <span>Ai completat un formular cu informații sensibile</span>
                      </div>
                    )}
                    {userAction === 'attachment_downloaded' && (
                      <div className="flex items-center text-red-600">
                        <XCircle className="w-5 h-5 mr-2" />
                        <span>Ai descărcat un atașament suspect</span>
                      </div>
                    )}
                    {userAction === 'reported' && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span>Ai raportat corect pagina ca phishing</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Semne de Avertizare:</h3>
                  <div className="space-y-2">
                    {pageData.redFlags.map((flag, index) => (
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
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Verifică întotdeauna URL-ul în bara de adrese</li>
                  <li>• Nu introduce niciodată informații sensibile pe site-uri suspecte</li>
                  <li>• Caută certificatul SSL și design-ul oficial</li>
                  <li>• Când ești în dubii, raportează ca phishing</li>
                </ul>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/simulations/phishing-simulator')}
                  className="bg-warm-copper text-white px-6 py-3 rounded-lg font-medium hover:bg-warm-bronze transition-colors"
                >
                  Încearcă Alt Email
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
      {/* Fake Website Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">{pageData.title}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Not Secure</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Warning Banner */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">SIMULARE DE PHISHING ACTIVĂ</h3>
              <p className="text-sm text-red-700 mt-1">
                Aceasta este o pagină falsă creată pentru a testa conștientizarea ta de securitate. 
                Nu introduce informații reale!
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{pageData.title}</h2>
              <p className="text-gray-600">{pageData.description}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pageData.formFields.map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={field.type}
                      value={formData[field.label] || ''}
                      onChange={(e) => setFormData({...formData, [field.label]: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  </div>
                ))}
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Verification
                </button>
                
                <button
                  type="button"
                  onClick={handleReportPhishing}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Report Phishing
                </button>
              </div>
            </form>

            {/* Attachments */}
            {pageData.attachments.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
                <div className="space-y-3">
                  {pageData.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-8 h-8 text-blue-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{attachment.name}</p>
                          <p className="text-sm text-gray-500">{attachment.size} • {attachment.type}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAttachmentDownload(attachment.name)}
                        className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
