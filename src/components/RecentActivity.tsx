'use client'

import { Activity, User, Clock, CheckCircle, AlertCircle } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'training',
    user: 'John Smith',
    action: 'completed Phishing Awareness training',
    time: '5 minutes ago',
    status: 'success',
  },
  {
    id: 2,
    type: 'simulation',
    user: 'Sarah Johnson',
    action: 'clicked on phishing link in simulation',
    time: '12 minutes ago',
    status: 'warning',
  },
  {
    id: 3,
    type: 'login',
    user: 'Mike Wilson',
    action: 'logged in from new device',
    time: '25 minutes ago',
    status: 'info',
  },
  {
    id: 4,
    type: 'training',
    user: 'Emily Davis',
    action: 'started Password Security training',
    time: '1 hour ago',
    status: 'info',
  },
  {
    id: 5,
    type: 'alert',
    user: 'System',
    action: 'security policy updated',
    time: '2 hours ago',
    status: 'info',
  },
]

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