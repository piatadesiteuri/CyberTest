'use client'

import { useState } from 'react'
import DashboardHeader from './DashboardHeader'
import Sidebar from './Sidebar'
import MetricsOverview from './MetricsOverview'
import SecurityAlerts from './SecurityAlerts'
import TrainingProgress from './TrainingProgress'
import RecentActivity from './RecentActivity'
import UserManagement from './UserManagement'
import SocialEngineeringSims from './SocialEngineeringSims'
import ReportingAnalytics from './ReportingAnalytics'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-transparent">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Cybersecurity Training Dashboard
              </h1>
              <p className="text-harmony-cream text-lg">
                Monitor your organization's security awareness and training progress
              </p>
            </div>

            {/* Metrics Overview */}
            <div className="mb-8">
              <MetricsOverview />
            </div>

            {/* Main Content Grid */}
            <div className="space-y-8">
              {/* Security Alerts */}
              <SecurityAlerts />
              
              {/* Training Progress */}
              <TrainingProgress />
              
              {/* Social Engineering Simulations */}
              <SocialEngineeringSims />
              
              {/* User Management */}
              <UserManagement />
              
              {/* Reporting & Analytics */}
              <ReportingAnalytics />
              
              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RecentActivity />
                </div>
                <div className="lg:col-span-1">
                  {/* Additional widgets can go here */}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
