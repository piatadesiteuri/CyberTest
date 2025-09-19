'use client'

import { useState, useEffect } from 'react'
import { Target, Mail, Phone, AlertTriangle, Play, Pause, Settings } from 'lucide-react'
import { adminService, SimulationData } from '@/services/adminService'

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
  const [simulations, setSimulations] = useState<SimulationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        setLoading(true)
        const data = await adminService.getSimulations()
        setSimulations(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch simulations')
        console.error('Error fetching simulations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSimulations()
  }, [])

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
      console.log('Simulation configuration updated')
    } catch (err) {
      console.error('Error configuring simulation:', err)
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
            const Icon = getSimulationIcon(sim.type)
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
                    <button 
                      className="flex-1 btn-secondary"
                      onClick={() => handlePauseSimulation(sim.id)}
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </button>
                  ) : (
                    <button 
                      className="flex-1 btn-primary"
                      onClick={() => handleStartSimulation(sim.id)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </button>
                  )}
                  <button 
                    className="btn-secondary"
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
