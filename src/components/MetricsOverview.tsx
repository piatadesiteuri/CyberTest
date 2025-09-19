'use client'

import { useState, useEffect } from 'react'
import { Users, Shield, Target, TrendingUp } from 'lucide-react'
import { adminService, DashboardMetrics } from '@/services/adminService'

export default function MetricsOverview() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        const data = await adminService.getDashboardMetrics()
        setMetrics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics')
        console.error('Error fetching dashboard metrics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="metric-card animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="bg-gray-200 p-3 rounded-lg w-12 h-12"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error || !metrics) {
    return (
      <div className="metric-card">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Failed to load metrics</p>
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

  const metricsData = [
    {
      name: 'Total Users',
      value: metrics.totalUsers.toLocaleString(),
      change: `+${metrics.userGrowth}%`,
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Training Completed',
      value: `${metrics.trainingCompleted}%`,
      change: `+${metrics.trainingGrowth}%`,
      changeType: 'positive',
      icon: Shield,
    },
    {
      name: 'Simulations Run',
      value: metrics.simulationsRun.toString(),
      change: `+${metrics.simulationGrowth}`,
      changeType: 'positive',
      icon: Target,
    },
    {
      name: 'Risk Score',
      value: metrics.riskScore,
      change: `-${metrics.riskImprovement}%`,
      changeType: 'positive',
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricsData.map((metric) => {
        const Icon = metric.icon
        return (
          <div key={metric.name} className="metric-card group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {metric.name}
                </p>
                <p className="text-3xl font-bold text-harmony-dark">
                  {metric.value}
                </p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    metric.changeType === 'positive' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {metric.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="bg-harmony-cream/20 p-3 rounded-lg group-hover:bg-harmony-tan/20 transition-colors">
                <Icon className="h-6 w-6 text-harmony-tan" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}