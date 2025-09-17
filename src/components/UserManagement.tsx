'use client'

import { Users, UserPlus, Shield, AlertTriangle, CheckCircle } from 'lucide-react'

const userGroups = [
  {
    id: 1,
    name: 'All Users',
    count: 1247,
    riskLevel: 'Medium',
    lastTraining: '2024-01-10',
    status: 'active',
  },
  {
    id: 2,
    name: 'High-Risk Groups',
    count: 89,
    riskLevel: 'High',
    lastTraining: '2024-01-08',
    status: 'active',
  },
  {
    id: 3,
    name: 'IT Staff',
    count: 45,
    riskLevel: 'Low',
    lastTraining: '2024-01-12',
    status: 'active',
  },
  {
    id: 4,
    name: 'Finance Department',
    count: 23,
    riskLevel: 'High',
    lastTraining: '2024-01-05',
    status: 'pending',
  },
]

const recentEnrollments = [
  {
    id: 1,
    name: 'Maria Popescu',
    department: 'HR',
    role: 'Employee',
    enrolledAt: '2024-01-15',
    status: 'completed',
  },
  {
    id: 2,
    name: 'Alexandru Ionescu',
    department: 'IT',
    role: 'System Admin',
    enrolledAt: '2024-01-14',
    status: 'in_progress',
  },
  {
    id: 3,
    name: 'Ana Dumitrescu',
    department: 'Finance',
    role: 'Manager',
    enrolledAt: '2024-01-13',
    status: 'completed',
  },
]

const getRiskBadge = (riskLevel: string) => {
  const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
  switch (riskLevel) {
    case 'High':
      return `${baseClasses} bg-red-100 text-red-800`
    case 'Medium':
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    case 'Low':
      return `${baseClasses} bg-green-100 text-green-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'in_progress':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case 'pending':
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    default:
      return <CheckCircle className="h-4 w-4 text-gray-500" />
  }
}

export default function UserManagement() {
  return (
    <div className="space-y-6">
      {/* User Groups Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-harmony-dark">User Groups</h2>
          <button className="btn-primary">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Group
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userGroups.map((group) => (
            <div key={group.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-harmony-cream/20 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-harmony-dark" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-500">{group.count} users</p>
                  </div>
                </div>
                <span className={getRiskBadge(group.riskLevel)}>
                  {group.riskLevel}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Last Training: {group.lastTraining}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  group.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {group.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Enrollments */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-harmony-dark">Recent Enrollments</h2>
          <button className="btn-secondary">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {recentEnrollments.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-harmony-dark text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.department} • {user.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">{user.enrolledAt}</span>
                {getStatusIcon(user.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
