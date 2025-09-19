'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import DashboardHeader from './DashboardHeader'
import Sidebar from './Sidebar'
import MetricsOverview from './MetricsOverview'
import SecurityAlerts from './SecurityAlerts'
import TrainingProgress from './TrainingProgress'
import RecentActivity from './RecentActivity'
import UserManagement from './UserManagement'
import SocialEngineeringSims from './SocialEngineeringSims'
import ReportingAnalytics from './ReportingAnalytics'
import CourseManagement from './CourseManagement'

export type TabType = 'dashboard' | 'training' | 'simulations' | 'users' | 'security' | 'reports' | 'settings'

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const { user } = useAuth()

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Cybersecurity Training Dashboard
                  </h1>
                  <p className="text-harmony-cream text-lg">
                    Welcome back, {user?.firstName}! Monitor your organization's security awareness and training progress
                  </p>
                </div>
                <div className="bg-harmony-dark/20 backdrop-blur-sm rounded-lg p-4 border border-harmony-cream/20">
                  <div className="text-sm text-harmony-cream/80">Role</div>
                  <div className="text-lg font-semibold text-white capitalize">
                    {user?.role?.replace('_', ' ')}
                  </div>
                </div>
              </div>
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
          </>
        )
      
      case 'training':
        return (
          <div className="space-y-6">
            <CourseManagement />
          </div>
        )
      
      case 'simulations':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Phishing Simulations</h1>
            </div>
            <SocialEngineeringSims />
          </div>
        )
      
      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">User Management</h1>
            </div>
            <UserManagement />
          </div>
        )
      
      case 'security':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Security Alerts</h1>
            </div>
            <SecurityAlerts />
          </div>
        )
      
      case 'reports':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
            </div>
            <ReportingAnalytics />
          </div>
        )
      
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Settings</h1>
            </div>
            <div className="bg-harmony-dark/20 backdrop-blur-sm rounded-lg p-6 border border-harmony-cream/20">
              <p className="text-harmony-cream">Settings panel will be implemented here.</p>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-transparent">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
