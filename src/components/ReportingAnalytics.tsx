'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, TrendingDown, Download, Calendar, Users, Shield, Target } from 'lucide-react'
import { adminService, KeyMetrics, ReportData, SystemStatus } from '@/services/adminService'

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
  const [keyMetrics, setKeyMetrics] = useState<KeyMetrics[]>([])
  const [reports, setReports] = useState<ReportData[]>([])
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [metricsData, reportsData, statusData] = await Promise.all([
          adminService.getKeyMetrics(),
          adminService.getReports(),
          adminService.getSystemStatus()
        ])
        setKeyMetrics(metricsData)
        setReports(reportsData)
        setSystemStatus(statusData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reporting data')
        console.error('Error fetching reporting data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleGenerateReport = async () => {
    try {
      const result = await adminService.generateReport('comprehensive', 'last_30_days')
      console.log('Report generation started:', result)
      // In a real app, you might show a toast notification or update the UI
    } catch (err) {
      console.error('Error generating report:', err)
    }
  }

  const handleDownloadReport = async (reportId: string) => {
    try {
      const result = await adminService.downloadReport(reportId)
      console.log('Download initiated:', result)
      // In a real app, you would trigger the download
    } catch (err) {
      console.error('Error downloading report:', err)
    }
  }

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'Comprehensive':
        return BarChart3
      case 'Training':
        return Users
      case 'Simulations':
        return Target
      case 'Risk Analysis':
        return Shield
      default:
        return BarChart3
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <div className="bg-gray-200 p-4 rounded-lg mb-3 h-16"></div>
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-20 mx-auto"></div>
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
          <p className="text-red-600 mb-4">Failed to load reporting data</p>
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
          <button className="btn-primary" onClick={handleGenerateReport}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Report
          </button>
        </div>
        
        <div className="space-y-4">
          {reports.map((report) => {
            const Icon = getReportIcon(report.type)
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
                    <button 
                      className="btn-secondary"
                      onClick={() => handleDownloadReport(report.id)}
                    >
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
            <p className="text-3xl font-bold text-harmony-dark">
              {systemStatus?.activeSimulations || 0}
            </p>
            <p className="text-sm text-gray-500">Running campaigns</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Users Online</h3>
            <p className="text-3xl font-bold text-harmony-dark">
              {systemStatus?.activeUsers || 0}
            </p>
            <p className="text-sm text-gray-500">Currently active</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Alerts Today</h3>
            <p className="text-3xl font-bold text-harmony-dark">
              {systemStatus?.alertsToday || 0}
            </p>
            <p className="text-sm text-gray-500">Security events</p>
          </div>
        </div>
      </div>
    </div>
  )
}
