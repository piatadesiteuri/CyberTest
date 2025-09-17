'use client'

import { AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react'

const alerts = [
  {
    id: 1,
    type: 'warning',
    title: 'Phishing Simulation Detected',
    description: 'Multiple users clicked on suspicious links in the latest phishing simulation.',
    time: '2 hours ago',
    status: 'active',
  },
  {
    id: 2,
    type: 'success',
    title: 'Security Training Completed',
    description: 'All employees in the Finance department completed their quarterly security training.',
    time: '4 hours ago',
    status: 'resolved',
  },
  {
    id: 3,
    type: 'info',
    title: 'New Security Policy Published',
    description: 'Updated password policy has been published and requires acknowledgment from all users.',
    time: '1 day ago',
    status: 'pending',
  },
  {
    id: 4,
    type: 'warning',
    title: 'Failed Login Attempts',
    description: 'Unusual login patterns detected for user accounts in the IT department.',
    time: '2 days ago',
    status: 'investigating',
  },
]

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
                  <span className={getStatusBadge(alert.status)}>
                    {alert.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {alert.description}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {alert.time}
                </p>
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