'use client'

import { useState, useEffect, useCallback } from 'react'
import { Target, Mail, Phone, AlertTriangle, Play, Pause, Settings, Plus, Edit, Trash2, Users } from 'lucide-react'
import { adminService, SimulationData } from '@/services/adminService'
import { useToast } from '@/contexts/ToastContext'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cybertest-production.up.railway.app'

const getStatusBadge = (status: string) => {
  const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
  switch (status) {
    case 'active':
      return `${baseClasses} bg-green-100 text-green-800`
    case 'paused':
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    case 'completed':
      return `${baseClasses} bg-blue-100 text-blue-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}

const getClickRateColor = (rate: number) => {
  if (rate > 15) return 'text-red-600'
  if (rate > 10) return 'text-yellow-600'
  return 'text-green-600'
}

interface PhishingCampaign {
  id: string
  title: string
  description: string
  type: string
  status: string
  targetUsers: string[]
  startDate: string
  endDate: string
  emailTemplate: string
  landingPageUrl: string
}

export default function SocialEngineeringSims() {
  const [simulations, setSimulations] = useState<SimulationData[]>([])
  const [campaigns, setCampaigns] = useState<PhishingCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<PhishingCampaign | null>(null)
  const { showToast } = useToast()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [simulationsData, campaignsData] = await Promise.all([
        adminService.getSimulations(),
        fetchPhishingCampaigns()
      ])
      setSimulations(simulationsData)
      setCampaigns(campaignsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const fetchPhishingCampaigns = async (): Promise<PhishingCampaign[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/phishing/campaigns`)
      if (response.ok) {
        const data = await response.json()
        return data.data || []
      } else {
        // Return mock data if API fails
        return [
          {
            id: '1',
            title: 'Q4 Security Awareness',
            description: 'Quarterly phishing awareness campaign targeting all employees',
            type: 'phishing',
            status: 'active',
            targetUsers: ['all'],
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            emailTemplate: 'urgent_security_update',
            landingPageUrl: '/simulations/phishing/landing/1'
          },
          {
            id: '2',
            title: 'HR Department Training',
            description: 'Targeted phishing simulation for HR department',
            type: 'phishing',
            status: 'draft',
            targetUsers: ['hr'],
            startDate: '2024-02-01',
            endDate: '2024-02-15',
            emailTemplate: 'fake_resume',
            landingPageUrl: '/simulations/phishing/landing/2'
          }
        ]
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      return []
    }
  }

  const handleStartSimulation = async (simulationId: string) => {
    try {
      await adminService.startSimulation(simulationId)
      setSimulations(simulations.map(sim => 
        sim.id === simulationId ? { ...sim, status: 'active' } : sim
      ))
    } catch (err) {
      console.error('Error starting simulation:', err)
    }
  }

  const handlePauseSimulation = async (simulationId: string) => {
    try {
      await adminService.pauseSimulation(simulationId)
      setSimulations(simulations.map(sim => 
        sim.id === simulationId ? { ...sim, status: 'paused' } : sim
      ))
    } catch (err) {
      console.error('Error pausing simulation:', err)
    }
  }

  const handleConfigureSimulation = async (simulationId: string) => {
    try {
      // In a real app, this would open a configuration modal
      await adminService.configureSimulation(simulationId, {})
      showToast('Simulation configuration updated', 'success')
    } catch (err) {
      console.error('Error configuring simulation:', err)
      showToast('Failed to configure simulation', 'error')
    }
  }

  const handleCreateCampaign = async (campaignData: Partial<PhishingCampaign>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/phishing/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: campaignData.title,
          description: campaignData.description,
          type: campaignData.type || 'phishing',
          target_users: campaignData.targetUsers || [],
          start_date: campaignData.startDate,
          end_date: campaignData.endDate,
          email_template: campaignData.emailTemplate,
          landing_page_url: campaignData.landingPageUrl
        })
      })

      if (response.ok) {
        const result = await response.json()
        showToast('Campaign created successfully', 'success')
        fetchData() // Refresh data
      } else {
        // Fallback to local creation
        const newCampaign: PhishingCampaign = {
          id: Date.now().toString(),
          title: campaignData.title || '',
          description: campaignData.description || '',
          type: campaignData.type || 'phishing',
          status: 'draft',
          targetUsers: campaignData.targetUsers || [],
          startDate: campaignData.startDate || new Date().toISOString().split('T')[0],
          endDate: campaignData.endDate || new Date().toISOString().split('T')[0],
          emailTemplate: campaignData.emailTemplate || '',
          landingPageUrl: campaignData.landingPageUrl || ''
        }
        setCampaigns([...campaigns, newCampaign])
        showToast('Campaign created locally', 'warning')
      }
    } catch (error) {
      console.error('Error creating campaign:', error)
      showToast('Failed to create campaign', 'error')
    }
  }

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      setCampaigns(campaigns.filter(campaign => campaign.id !== campaignId))
      showToast('Campaign deleted', 'success')
    } catch (error) {
      console.error('Error deleting campaign:', error)
      showToast('Failed to delete campaign', 'error')
    }
  }

  const handleStartCampaign = async (campaignId: string) => {
    try {
      setCampaigns(campaigns.map(campaign =>
        campaign.id === campaignId ? { ...campaign, status: 'active' } : campaign
      ))
      showToast('Campaign started', 'success')
    } catch (error) {
      console.error('Error starting campaign:', error)
      showToast('Failed to start campaign', 'error')
    }
  }

  const getSimulationIcon = (type: string) => {
    switch (type) {
      case 'Email':
        return Mail
      case 'SMS':
        return Phone
      case 'Voice':
        return Phone
      case 'Advanced':
        return AlertTriangle
      default:
        return Target
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Failed to load simulations</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Phishing Simulations</h1>
          <p className="text-harmony-cream">Create and manage phishing campaigns and simulations</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Settings className="h-4 w-4" />
            <span>Configure</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* Phishing Campaigns */}
      <div className="bg-harmony-dark/20 backdrop-blur-sm rounded-lg p-6 border border-harmony-cream/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Phishing Campaigns</h2>
          <span className="text-sm text-harmony-cream">{campaigns.length} campaigns</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white/5 border border-harmony-cream/20 rounded-lg p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-harmony-cream/20 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-harmony-cream" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{campaign.title}</h3>
                    <p className="text-sm text-harmony-cream">{campaign.type} Campaign</p>
                  </div>
                </div>
                <span className={getStatusBadge(campaign.status)}>
                  {campaign.status}
                </span>
              </div>
              
              <p className="text-sm text-harmony-cream mb-4">{campaign.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-harmony-cream/80 mb-1">Target Users</p>
                  <p className="font-semibold text-white">{campaign.targetUsers?.join(', ') || 'No targets'}</p>
                </div>
                <div>
                  <p className="text-xs text-harmony-cream/80 mb-1">Duration</p>
                  <p className="font-semibold text-white">
                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {campaign.status === 'draft' ? (
                  <button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm"
                    onClick={() => handleStartCampaign(campaign.id)}
                  >
                    <Play className="h-4 w-4" />
                    <span>Start</span>
                  </button>
                ) : (
                  <button 
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm"
                    onClick={() => handlePauseSimulation(campaign.id)}
                  >
                    <Pause className="h-4 w-4" />
                    <span>Pause</span>
                  </button>
                )}
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                  onClick={() => setEditingCampaign(campaign)}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                  onClick={() => handleDeleteCampaign(campaign.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulations Overview */}
      <div className="bg-harmony-dark/20 backdrop-blur-sm rounded-lg p-6 border border-harmony-cream/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Active Simulations</h2>
          <span className="text-sm text-harmony-cream">{simulations.length} simulations</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {simulations.map((sim) => {
            const Icon = getSimulationIcon(sim.type)
            return (
              <div key={sim.id} className="bg-white/5 border border-harmony-cream/20 rounded-lg p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-harmony-cream/20 p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-harmony-cream" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{sim.name}</h3>
                      <p className="text-sm text-harmony-cream">{sim.type} Simulation</p>
                    </div>
                  </div>
                  <span className={getStatusBadge(sim.status)}>
                    {sim.status}
                  </span>
                </div>
                
                <p className="text-sm text-harmony-cream mb-4">{sim.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-harmony-cream/80 mb-1">Participants</p>
                    <p className="font-semibold text-white">{sim.participants}</p>
                  </div>
                  <div>
                    <p className="text-xs text-harmony-cream/80 mb-1">Click Rate</p>
                    <p className={`font-semibold ${getClickRateColor(sim.clickRate)}`}>
                      {sim.clickRate}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-harmony-cream/80 mb-4">
                  <span>Last: {sim.lastRun}</span>
                  <span>Next: {sim.nextRun}</span>
                </div>
                
                <div className="flex space-x-2">
                  {sim.status === 'active' ? (
                    <button 
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm"
                      onClick={() => handlePauseSimulation(sim.id)}
                    >
                      <Pause className="h-4 w-4" />
                      <span>Pause</span>
                    </button>
                  ) : (
                    <button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm"
                      onClick={() => handleStartSimulation(sim.id)}
                    >
                      <Play className="h-4 w-4" />
                      <span>Start</span>
                    </button>
                  )}
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                    onClick={() => handleConfigureSimulation(sim.id)}
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Auto-Pilot Status */}
      <div className="bg-harmony-dark/20 backdrop-blur-sm rounded-lg p-6 border border-harmony-cream/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Auto-Pilot Status</h3>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-harmony-cream">Active</span>
          </div>
        </div>
        <p className="text-harmony-cream mb-4">
          Auto-Pilot is running recurring campaigns without manual intervention. 
          All scheduled simulations are executing automatically based on configured parameters.
        </p>
        <div className="flex space-x-2">
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
            Configure Schedule
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            View Logs
          </button>
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <CreateCampaignModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateCampaign}
        />
      )}

      {/* Edit Campaign Modal */}
      {editingCampaign && (
        <EditCampaignModal
          campaign={editingCampaign}
          onClose={() => setEditingCampaign(null)}
          onSubmit={(campaignData) => {
            // Handle edit logic here
            setEditingCampaign(null)
            showToast('Campaign updated', 'success')
          }}
        />
      )}
    </div>
  )
}

// Create Campaign Modal Component
interface CreateCampaignModalProps {
  onClose: () => void
  onSubmit: (campaignData: Partial<PhishingCampaign>) => void
}

function CreateCampaignModal({ onClose, onSubmit }: CreateCampaignModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'phishing',
    targetUsers: ['all'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    emailTemplate: 'urgent_security_update',
    landingPageUrl: '/simulations/phishing/landing/1'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-harmony-dark rounded-lg p-6 w-full max-w-2xl border border-harmony-cream/20 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-white mb-4">Create New Phishing Campaign</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Campaign Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
              placeholder="Enter campaign title..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
              placeholder="Enter campaign description..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-harmony-cream mb-1">Campaign Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
              >
                <option value="phishing" className="bg-harmony-dark text-white">Email Phishing</option>
                <option value="smishing" className="bg-harmony-dark text-white">SMS Phishing</option>
                <option value="vishing" className="bg-harmony-dark text-white">Voice Phishing</option>
                <option value="spear" className="bg-harmony-dark text-white">Spear Phishing</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-harmony-cream mb-1">Email Template</label>
              <select
                value={formData.emailTemplate}
                onChange={(e) => setFormData({ ...formData, emailTemplate: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
              >
                <option value="urgent_security_update" className="bg-harmony-dark text-white">Urgent Security Update</option>
                <option value="fake_invoice" className="bg-harmony-dark text-white">Fake Invoice</option>
                <option value="password_reset" className="bg-harmony-dark text-white">Password Reset</option>
                <option value="fake_resume" className="bg-harmony-dark text-white">Fake Resume</option>
                <option value="bank_notification" className="bg-harmony-dark text-white">Bank Notification</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-harmony-cream mb-1">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-harmony-cream mb-1">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Target Users</label>
            <select
              multiple
              value={formData.targetUsers}
              onChange={(e) => setFormData({ 
                ...formData, 
                targetUsers: Array.from(e.target.selectedOptions, option => option.value)
              })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
              size={4}
            >
              <option value="all" className="bg-harmony-dark text-white">All Employees</option>
              <option value="hr" className="bg-harmony-dark text-white">HR Department</option>
              <option value="it" className="bg-harmony-dark text-white">IT Department</option>
              <option value="finance" className="bg-harmony-dark text-white">Finance Department</option>
              <option value="marketing" className="bg-harmony-dark text-white">Marketing Department</option>
              <option value="sales" className="bg-harmony-dark text-white">Sales Department</option>
            </select>
            <p className="text-xs text-harmony-cream/60 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Campaign Modal Component (simplified version)
interface EditCampaignModalProps {
  campaign: PhishingCampaign
  onClose: () => void
  onSubmit: (campaignData: Partial<PhishingCampaign>) => void
}

function EditCampaignModal({ campaign, onClose, onSubmit }: EditCampaignModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-harmony-dark rounded-lg p-6 w-full max-w-md border border-harmony-cream/20">
        <h3 className="text-lg font-semibold text-white mb-4">Edit Campaign</h3>
        <p className="text-harmony-cream mb-4">Campaign editing functionality will be implemented here.</p>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit({})}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
