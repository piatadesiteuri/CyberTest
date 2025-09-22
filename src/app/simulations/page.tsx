'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Play, Target, Users, BarChart3, Shield, AlertTriangle, Mail, MessageSquare, Phone, Clock } from 'lucide-react'

interface PhishingCampaign {
  id: string
  title: string
  description: string
  type: 'phishing' | 'smishing' | 'vishing'
  status: 'draft' | 'active' | 'paused' | 'completed'
  targetGroups: string[]
  startDate: string
  endDate: string
  results?: {
    totalSent: number
    totalOpened: number
    totalClicked: number
    totalReported: number
    vulnerabilityScore: number
  }
}

export default function SimulationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<PhishingCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<'all' | 'phishing' | 'smishing' | 'vishing'>('all')

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://cybertest-production.up.railway.app'}/api/phishing/campaigns`)
        if (response.ok) {
          const data = await response.json()
          setCampaigns(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'phishing':
        return <Mail className="w-6 h-6 text-warm-copper" />
      case 'smishing':
        return <MessageSquare className="w-6 h-6 text-warm-amber" />
      case 'vishing':
        return <Phone className="w-6 h-6 text-warm-bronze" />
      default:
        return <Target className="w-6 h-6 text-warm-gold" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'phishing':
        return 'bg-warm-copper/10 text-warm-copper border-warm-copper/20'
      case 'smishing':
        return 'bg-warm-amber/10 text-warm-amber border-warm-amber/20'
      case 'vishing':
        return 'bg-warm-bronze/10 text-warm-bronze border-warm-bronze/20'
      default:
        return 'bg-warm-gold/10 text-warm-gold border-warm-gold/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => 
    selectedType === 'all' || campaign.type === selectedType
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-copper mx-auto mb-4"></div>
          <p className="text-gray-600">Loading simulations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center text-gray-600 hover:text-warm-copper transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-warm-copper to-warm-bronze rounded-xl flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Phishing Simulations</h1>
              <p className="text-lg text-gray-600 mt-1">Test your team's security awareness with realistic attack simulations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { key: 'all', label: 'All Simulations', icon: Target },
              { key: 'phishing', label: 'Phishing', icon: Mail },
              { key: 'smishing', label: 'Smishing', icon: MessageSquare },
              { key: 'vishing', label: 'Vishing', icon: Phone }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedType(key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  selectedType === key
                    ? 'bg-white text-warm-copper shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-warm-copper/10 rounded-lg">
                <Target className="w-6 h-6 text-warm-copper" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.reduce((sum, c) => sum + (c.results?.totalSent || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Vulnerability</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.length > 0 
                    ? Math.round(campaigns.reduce((sum, c) => sum + (c.results?.vulnerabilityScore || 0), 0) / campaigns.length)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Phishing Tutorial */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Mail className="w-8 h-8 text-warm-copper" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Phishing Awareness</h3>
                  <p className="text-sm text-gray-600">Învață să identifici email-urile false</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>15 min</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Nivel: Începător</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Target className="w-4 h-4 mr-2" />
                  <span>Email Security</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <button 
                  onClick={() => router.push('/simulations/tutorial')}
                  className="w-full bg-warm-copper text-white px-4 py-3 rounded-lg font-medium hover:bg-warm-bronze transition-colors flex items-center justify-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Începe Tutorial-ul
                </button>
                <button 
                  onClick={() => router.push('/simulations/phishing-simulator')}
                  className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Simulator Real
                </button>
              </div>
            </div>
          </div>

          {/* Smishing Tutorial */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MessageSquare className="w-8 h-8 text-warm-amber" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Smishing Awareness</h3>
                  <p className="text-sm text-gray-600">Învață să identifici SMS-urile false</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>12 min</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Nivel: Începător</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Target className="w-4 h-4 mr-2" />
                  <span>SMS Security</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <button 
                  onClick={() => router.push('/simulations/tutorial')}
                  className="w-full bg-warm-amber text-white px-4 py-3 rounded-lg font-medium hover:bg-warm-bronze transition-colors flex items-center justify-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Începe Tutorial-ul
                </button>
                <button 
                  onClick={() => router.push('/simulations/phishing-simulator')}
                  className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Simulator Real
                </button>
              </div>
            </div>
          </div>

          {/* Vishing Tutorial */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Phone className="w-8 h-8 text-warm-bronze" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Vishing Awareness</h3>
                  <p className="text-sm text-gray-600">Învață să identifici apelurile false</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>10 min</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Nivel: Începător</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Target className="w-4 h-4 mr-2" />
                  <span>Voice Security</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <button 
                  onClick={() => router.push('/simulations/tutorial')}
                  className="w-full bg-warm-bronze text-white px-4 py-3 rounded-lg font-medium hover:bg-warm-copper transition-colors flex items-center justify-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Începe Tutorial-ul
                </button>
                <button 
                  onClick={() => router.push('/simulations/phishing-simulator')}
                  className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Simulator Real
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
