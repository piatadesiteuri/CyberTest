'use client'

import { Users, Shield, Target, TrendingUp } from 'lucide-react'

const metrics = [
  {
    name: 'Total Users',
    value: '1,247',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
  },
  {
    name: 'Training Completed',
    value: '89%',
    change: '+5%',
    changeType: 'positive',
    icon: Shield,
  },
  {
    name: 'Simulations Run',
    value: '156',
    change: '+23',
    changeType: 'positive',
    icon: Target,
  },
  {
    name: 'Risk Score',
    value: 'Low',
    change: '-8%',
    changeType: 'positive',
    icon: TrendingUp,
  },
]

export default function MetricsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
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