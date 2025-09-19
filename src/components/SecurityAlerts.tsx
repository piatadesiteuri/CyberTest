'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react'
import { adminService, SecurityAlert } from '@/services/adminService'

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'info':
      return <Clock className="h-5 w-5 text-blue-500" />
    default:
      return <AlertTriangle className="h-5 w-5 text-gray-500" />
  }
}

const getStatusBadge = (status: string) => {
  const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
  switch (status) {
    case 'active':
      return `${baseClasses} bg-red-100 text-red-800`
    case 'resolved':
      return `${baseClasses} bg-green-100 text-green-800`
    case 'pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    case 'investigating':
      return `${baseClasses} bg-blue-100 text-blue-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}

export default function SecurityAlerts() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true)
        const data = await adminService.getSecurityAlerts()
        setAlerts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch security alerts')
        console.error('Error fetching security alerts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [])

  const handleUpdateAlertStatus = async (alertId: string, newStatus: SecurityAlert['status']) => {
    try {
      await adminService.updateAlertStatus(alertId, newStatus)
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, status: newStatus } : alert
      ))
    } catch (err) {
      console.error('Error updating alert status:', err)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="h-5 w-5 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Failed to load security alerts</p>
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
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-harmony-dark">Security Alerts</h2>
        <button className="text-harmony-tan hover:text-harmony-dark transition-colors">
          <ExternalLink className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-3">
              {getAlertIcon(alert.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {alert.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={getStatusBadge(alert.status)}>
                      {alert.status}
                    </span>
                    {alert.status === 'active' && (
                      <button
                        onClick={() => handleUpdateAlertStatus(alert.id, 'resolved')}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {alert.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    {alert.time}
                  </p>
                  {alert.severity && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.severity}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <button className="w-full btn-primary">
          View All Alerts
        </button>
      </div>
    </div>
  )
}