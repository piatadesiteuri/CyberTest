'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, TrendingDown, Download, Calendar, Users, Shield, Target, Plus, Filter, RefreshCw } from 'lucide-react'
import { adminService, KeyMetrics, ReportData, SystemStatus } from '@/services/adminService'
import { useToast } from '@/contexts/ToastContext'

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
  const [showCreateReportModal, setShowCreateReportModal] = useState(false)
  const [filterPeriod, setFilterPeriod] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [refreshing, setRefreshing] = useState(false)
  const { showToast } = useToast()

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

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
    showToast('Data refreshed successfully', 'success')
  }

  const handleGenerateReport = async (reportType: string, period: string) => {
    try {
      const result = await adminService.generateReport(reportType, period)
      showToast('Report generation started', 'success')
      
      // Add the new report to the list with generating status
      const newReport: ReportData = {
        id: result.id,
        name: `${reportType} Report`,
        type: reportType,
        period: period,
        status: 'generating',
        lastGenerated: new Date().toISOString().split('T')[0],
        metrics: {}
      }
      setReports([newReport, ...reports])
    } catch (err) {
      console.error('Error generating report:', err)
      showToast('Failed to generate report', 'error')
    }
  }

  const handleDownloadReport = async (reportId: string) => {
    try {
      const result = await adminService.downloadReport(reportId)
      showToast('Download started', 'success')
      // In a real app, you would trigger the download
      console.log('Download initiated:', result)
    } catch (err) {
      console.error('Error downloading report:', err)
      showToast('Failed to download report', 'error')
    }
  }

  const handleDeleteReport = (reportId: string) => {
    setReports(reports.filter(report => report.id !== reportId))
    showToast('Report deleted', 'success')
  }

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesPeriod = filterPeriod === 'all' || report.period.includes(filterPeriod)
    const matchesType = filterType === 'all' || report.type.toLowerCase().includes(filterType.toLowerCase())
    return matchesPeriod && matchesType
  })

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-harmony-cream">Monitor performance and generate insights</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowCreateReportModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-harmony-dark/20 backdrop-blur-sm rounded-lg p-6 border border-harmony-cream/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Key Metrics</h2>
          <div className="flex items-center space-x-2 text-sm text-harmony-cream">
            <Calendar className="h-4 w-4" />
            <span>Last 30 days</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyMetrics.map((metric) => (
            <div key={metric.name} className="text-center bg-white/5 p-4 rounded-lg border border-harmony-cream/20">
              <div className="flex items-center justify-center space-x-2 mb-3">
                {getTrendIcon(metric.trend)}
                <span className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}
                </span>
              </div>
              <h3 className="font-medium text-white mb-1">{metric.name}</h3>
              <p className="text-sm text-harmony-cream">
                <span className={metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                  {metric.change}
                </span>
                {' '}vs last month
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Reports */}
      <div className="bg-harmony-dark/20 backdrop-blur-sm rounded-lg p-6 border border-harmony-cream/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Reports</h2>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
          >
            <option value="all" className="bg-harmony-dark text-white">All Types</option>
            <option value="comprehensive" className="bg-harmony-dark text-white">Comprehensive</option>
            <option value="training" className="bg-harmony-dark text-white">Training</option>
            <option value="simulation" className="bg-harmony-dark text-white">Simulation</option>
            <option value="security" className="bg-harmony-dark text-white">Security</option>
          </select>
          
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
          >
            <option value="all" className="bg-harmony-dark text-white">All Periods</option>
            <option value="week" className="bg-harmony-dark text-white">Last Week</option>
            <option value="month" className="bg-harmony-dark text-white">Last Month</option>
            <option value="quarter" className="bg-harmony-dark text-white">Last Quarter</option>
            <option value="year" className="bg-harmony-dark text-white">Last Year</option>
          </select>
        </div>
        
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const Icon = getReportIcon(report.type)
            return (
              <div key={report.id} className="flex items-center justify-between p-4 bg-white/5 border border-harmony-cream/20 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="bg-harmony-cream/20 p-3 rounded-lg">
                    <Icon className="h-5 w-5 text-harmony-cream" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{report.name}</h3>
                    <p className="text-sm text-harmony-cream">{report.type} • {report.period}</p>
                    <p className="text-xs text-harmony-cream/60">Last generated: {report.lastGenerated}</p>
                    {report.metrics && Object.keys(report.metrics).length > 0 && (
                      <div className="flex items-center gap-4 mt-2">
                        {report.metrics.totalSent && (
                          <span className="text-xs text-harmony-cream/80">
                            Sent: {report.metrics.totalSent}
                          </span>
                        )}
                        {report.metrics.totalClicked && (
                          <span className="text-xs text-harmony-cream/80">
                            Clicked: {report.metrics.totalClicked}
                          </span>
                        )}
                        {report.metrics.vulnerabilityScore && (
                          <span className="text-xs text-harmony-cream/80">
                            Risk: {report.metrics.vulnerabilityScore}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={getStatusBadge(report.status)}>
                    {report.status}
                  </span>
                  {report.status === 'ready' && (
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm"
                      onClick={() => handleDownloadReport(report.id)}
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  )}
                  <button 
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                    onClick={() => handleDeleteReport(report.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Real-time Dashboard */}
      <div className="bg-harmony-dark/20 backdrop-blur-sm rounded-lg p-6 border border-harmony-cream/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Real-time Dashboard</h2>
          <div className="flex items-center space-x-2 text-sm text-green-400">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-white/5 rounded-lg border border-harmony-cream/20">
            <div className="bg-blue-500/20 p-3 rounded-lg mb-3 mx-auto w-fit">
              <Target className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="font-medium text-white mb-2">Active Simulations</h3>
            <p className="text-3xl font-bold text-blue-400">
              {systemStatus?.activeSimulations || 0}
            </p>
            <p className="text-sm text-harmony-cream">Running campaigns</p>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-lg border border-harmony-cream/20">
            <div className="bg-green-500/20 p-3 rounded-lg mb-3 mx-auto w-fit">
              <Users className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="font-medium text-white mb-2">Users Online</h3>
            <p className="text-3xl font-bold text-green-400">
              {systemStatus?.activeUsers || 0}
            </p>
            <p className="text-sm text-harmony-cream">Currently active</p>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-lg border border-harmony-cream/20">
            <div className="bg-yellow-500/20 p-3 rounded-lg mb-3 mx-auto w-fit">
              <Shield className="h-6 w-6 text-yellow-400" />
            </div>
            <h3 className="font-medium text-white mb-2">Alerts Today</h3>
            <p className="text-3xl font-bold text-yellow-400">
              {systemStatus?.alertsToday || 0}
            </p>
            <p className="text-sm text-harmony-cream">Security events</p>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-lg border border-harmony-cream/20">
            <div className="bg-purple-500/20 p-3 rounded-lg mb-3 mx-auto w-fit">
              <BarChart3 className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="font-medium text-white mb-2">System Uptime</h3>
            <p className="text-3xl font-bold text-purple-400">
              {systemStatus?.uptime || '99.9%'}
            </p>
            <p className="text-sm text-harmony-cream">Availability</p>
          </div>
        </div>
      </div>

      {/* Create Report Modal */}
      {showCreateReportModal && (
        <CreateReportModal
          onClose={() => setShowCreateReportModal(false)}
          onSubmit={handleGenerateReport}
        />
      )}
    </div>
  )
}

// Create Report Modal Component
interface CreateReportModalProps {
  onClose: () => void
  onSubmit: (reportType: string, period: string) => void
}

function CreateReportModal({ onClose, onSubmit }: CreateReportModalProps) {
  const [formData, setFormData] = useState({
    type: 'comprehensive',
    period: 'last_30_days',
    includeSections: {
      userActivity: true,
      trainingProgress: true,
      phishingResults: true,
      riskAnalysis: true
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData.type, formData.period)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-harmony-dark rounded-lg p-6 w-full max-w-lg border border-harmony-cream/20">
        <h3 className="text-lg font-semibold text-white mb-4">Generate New Report</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Report Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
            >
              <option value="comprehensive" className="bg-harmony-dark text-white">Comprehensive Analysis</option>
              <option value="training" className="bg-harmony-dark text-white">Training Report</option>
              <option value="simulation" className="bg-harmony-dark text-white">Simulation Results</option>
              <option value="security" className="bg-harmony-dark text-white">Security Assessment</option>
              <option value="risk" className="bg-harmony-dark text-white">Risk Analysis</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Time Period</label>
            <select
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
            >
              <option value="last_7_days" className="bg-harmony-dark text-white">Last 7 Days</option>
              <option value="last_30_days" className="bg-harmony-dark text-white">Last 30 Days</option>
              <option value="last_90_days" className="bg-harmony-dark text-white">Last 90 Days</option>
              <option value="last_year" className="bg-harmony-dark text-white">Last Year</option>
              <option value="custom" className="bg-harmony-dark text-white">Custom Range</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-2">Include Sections</label>
            <div className="space-y-2">
              {Object.entries({
                userActivity: 'User Activity',
                trainingProgress: 'Training Progress',
                phishingResults: 'Phishing Results',
                riskAnalysis: 'Risk Analysis'
              }).map(([key, label]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.includeSections[key as keyof typeof formData.includeSections]}
                    onChange={(e) => setFormData({
                      ...formData,
                      includeSections: {
                        ...formData.includeSections,
                        [key]: e.target.checked
                      }
                    })}
                    className="rounded border-harmony-cream/20 bg-white/10 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-harmony-cream text-sm">{label}</span>
                </label>
              ))}
            </div>
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
              Generate Report
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

