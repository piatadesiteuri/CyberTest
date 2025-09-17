'use client'

import { Target, Mail, Phone, AlertTriangle, Play, Pause, Settings } from 'lucide-react'

const simulations = [
  {
    id: 1,
    name: 'Phishing Campaign',
    type: 'Email',
    icon: Mail,
    status: 'active',
    participants: 1247,
    clickRate: 12.5,
    lastRun: '2024-01-15',
    nextRun: '2024-01-22',
    description: 'Automated phishing simulation targeting all users',
  },
  {
    id: 2,
    name: 'Smishing Campaign',
    type: 'SMS',
    icon: Phone,
    status: 'active',
    participants: 1247,
    clickRate: 8.3,
    lastRun: '2024-01-14',
    nextRun: '2024-01-21',
    description: 'SMS-based social engineering attack simulation',
  },
  {
    id: 3,
    name: 'Vishing Simulation',
    type: 'Voice',
    icon: Phone,
    status: 'paused',
    participants: 312,
    clickRate: 15.2,
    lastRun: '2024-01-10',
    nextRun: '2024-01-24',
    description: 'Voice-based social engineering for high-risk groups',
  },
  {
    id: 4,
    name: 'APT Simulation',
    type: 'Advanced',
    icon: AlertTriangle,
    status: 'completed',
    participants: 89,
    clickRate: 3.1,
    lastRun: '2024-01-08',
    nextRun: '2024-02-08',
    description: 'Advanced Persistent Threat simulation for IT staff',
  },
]

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

export default function SocialEngineeringSims() {
  return (
    <div className="space-y-6">
      {/* Simulations Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-harmony-dark">Social Engineering Simulations</h2>
          <div className="flex space-x-2">
            <button className="btn-secondary">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </button>
            <button className="btn-primary">
              <Play className="h-4 w-4 mr-2" />
              New Campaign
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {simulations.map((sim) => {
            const Icon = sim.icon
            return (
              <div key={sim.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-harmony-cream/20 p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-harmony-dark" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{sim.name}</h3>
                      <p className="text-sm text-gray-500">{sim.type} Simulation</p>
                    </div>
                  </div>
                  <span className={getStatusBadge(sim.status)}>
                    {sim.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{sim.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Participants</p>
                    <p className="font-semibold text-gray-900">{sim.participants}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Click Rate</p>
                    <p className={`font-semibold ${getClickRateColor(sim.clickRate)}`}>
                      {sim.clickRate}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Last: {sim.lastRun}</span>
                  <span>Next: {sim.nextRun}</span>
                </div>
                
                <div className="flex space-x-2">
                  {sim.status === 'active' ? (
                    <button className="flex-1 btn-secondary">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </button>
                  ) : (
                    <button className="flex-1 btn-primary">
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </button>
                  )}
                  <button className="btn-secondary">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Auto-Pilot Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-harmony-dark">Auto-Pilot Status</h3>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Active</span>
          </div>
        </div>
        <p className="text-gray-600 mb-4">
          Auto-Pilot is running recurring campaigns without manual intervention. 
          All scheduled simulations are executing automatically based on configured parameters.
        </p>
        <div className="flex space-x-2">
          <button className="btn-secondary">Configure Schedule</button>
          <button className="btn-primary">View Logs</button>
        </div>
      </div>
    </div>
  )
}
