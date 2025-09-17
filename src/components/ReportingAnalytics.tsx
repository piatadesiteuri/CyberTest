'use client'

import { BarChart3, TrendingUp, TrendingDown, Download, Calendar, Users, Shield, Target } from 'lucide-react'

const reports = [
  {
    id: 1,
    name: 'Monthly Security Report',
    type: 'Comprehensive',
    period: 'January 2024',
    status: 'ready',
    lastGenerated: '2024-01-15',
    icon: BarChart3,
  },
  {
    id: 2,
    name: 'Training Progress Report',
    type: 'Training',
    period: 'Q1 2024',
    status: 'generating',
    lastGenerated: '2024-01-14',
    icon: Users,
  },
  {
    id: 3,
    name: 'Simulation Results',
    type: 'Simulations',
    period: 'Last 30 days',
    status: 'ready',
    lastGenerated: '2024-01-15',
    icon: Target,
  },
  {
    id: 4,
    name: 'Risk Assessment',
    type: 'Risk Analysis',
    period: 'January 2024',
    status: 'ready',
    lastGenerated: '2024-01-13',
    icon: Shield,
  },
]

const keyMetrics = [
  {
    name: 'Overall Risk Score',
    value: 'Low',
    change: '-8%',
    trend: 'down',
    color: 'text-green-600',
  },
  {
    name: 'Training Completion',
    value: '89%',
    change: '+5%',
    trend: 'up',
    color: 'text-blue-600',
  },
  {
    name: 'Phishing Click Rate',
    value: '12.5%',
    change: '-3%',
    trend: 'down',
    color: 'text-green-600',
  },
  {
    name: 'Active Users',
    value: '1,247',
    change: '+12%',
    trend: 'up',
    color: 'text-blue-600',
  },
]

const getStatusBadge = (status: string) => {
  const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
  switch (status) {
    case 'ready':
      return `${baseClasses} bg-green-100 text-green-800`
    case 'generating':
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    case 'error':
      return `${baseClasses} bg-red-100 text-red-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}

const getTrendIcon = (trend: string) => {
  if (trend === 'up') {
    return <TrendingUp className="h-4 w-4 text-green-500" />
  } else {
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }
}

export default function ReportingAnalytics() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-harmony-dark">Key Metrics</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Last 30 days</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyMetrics.map((metric) => (
            <div key={metric.name} className="text-center">
              <div className="bg-harmony-cream/20 p-4 rounded-lg mb-3">
                <div className="flex items-center justify-center space-x-2">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-2xl font-bold ${metric.color}`}>
                    {metric.value}
                  </span>
                </div>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{metric.name}</h3>
              <p className="text-sm text-gray-500">
                <span className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {metric.change}
                </span>
                {' '}vs last month
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Reports */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-harmony-dark">Reports</h2>
          <button className="btn-primary">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Report
          </button>
        </div>
        
        <div className="space-y-4">
          {reports.map((report) => {
            const Icon = report.icon
            return (
              <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="bg-harmony-cream/20 p-3 rounded-lg">
                    <Icon className="h-5 w-5 text-harmony-dark" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{report.name}</h3>
                    <p className="text-sm text-gray-500">{report.type} • {report.period}</p>
                    <p className="text-xs text-gray-400">Last generated: {report.lastGenerated}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={getStatusBadge(report.status)}>
                    {report.status}
                  </span>
                  {report.status === 'ready' && (
                    <button className="btn-secondary">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Real-time Dashboard */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-harmony-dark">Real-time Dashboard</h2>
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <div className="h-2 w-2 bg-green-400 rounded-full"></div>
            <span>Live</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Active Simulations</h3>
            <p className="text-3xl font-bold text-harmony-dark">3</p>
            <p className="text-sm text-gray-500">Running campaigns</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Users Online</h3>
            <p className="text-3xl font-bold text-harmony-dark">247</p>
            <p className="text-sm text-gray-500">Currently active</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Alerts Today</h3>
            <p className="text-3xl font-bold text-harmony-dark">12</p>
            <p className="text-sm text-gray-500">Security events</p>
          </div>
        </div>
      </div>
    </div>
  )
}
