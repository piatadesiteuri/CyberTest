'use client'

import { useState, useEffect } from 'react'
import { Activity, User, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { adminService, ActivityLog } from '@/services/adminService'

const getActivityIcon = (type: string, status: string) => {
  const iconClass = "h-4 w-4"
  
  if (status === 'success') {
    return <CheckCircle className={`${iconClass} text-green-500`} />
  } else if (status === 'warning') {
    return <AlertCircle className={`${iconClass} text-yellow-500`} />
  } else {
    return <Activity className={`${iconClass} text-blue-500`} />
  }
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true)
        const data = await adminService.getRecentActivity()
        setActivities(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recent activity')
        console.error('Error fetching recent activity:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentActivity()
    
    // Set up polling for live updates (every 30 seconds)
    const interval = setInterval(fetchRecentActivity, 30000)
    
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-lg">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
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
          <p className="text-red-600 mb-4">Failed to load recent activity</p>
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
        <h2 className="text-xl font-bold text-harmony-dark">Recent Activity</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Live Updates</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 mt-0.5">
              {getActivityIcon(activity.type, activity.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <User className="h-3 w-3 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {activity.user}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {activity.action}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full btn-secondary">
          View Activity Log
        </button>
      </div>
    </div>
  )
}