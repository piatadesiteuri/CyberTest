'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import DashboardHeader from './DashboardHeader'
import Sidebar from './Sidebar'
import MetricsOverview from './MetricsOverview'
import SecurityAlerts from './SecurityAlerts'
import TrainingProgress from './TrainingProgress'
import RecentActivity from './RecentActivity'

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()

  return (
    <div className="flex h-screen bg-transparent">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        
        {/* User Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* User Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    My Training Dashboard
                  </h1>
                  <p className="text-harmony-cream text-lg">
                    Welcome back, {user?.firstName}! Track your cybersecurity training progress
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

            {/* User Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm font-medium">Completed Modules</p>
                    <p className="text-3xl font-bold text-white">8/12</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-lg p-6 border border-green-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200 text-sm font-medium">Training Score</p>
                    <p className="text-3xl font-bold text-white">87%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-medium">Current Streak</p>
                    <p className="text-3xl font-bold text-white">12 days</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-lg p-6 border border-orange-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-200 text-sm font-medium">Next Training</p>
                    <p className="text-3xl font-bold text-white">2 days</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="space-y-8">
              {/* Security Alerts */}
              <SecurityAlerts />
              
              {/* Training Progress */}
              <TrainingProgress />
              
              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RecentActivity />
                </div>
                <div className="lg:col-span-1">
                  {/* User Quick Actions */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full bg-blue-500/20 text-blue-200 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors text-left">
                        Start New Training
                      </button>
                      <button className="w-full bg-green-500/20 text-green-200 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors text-left">
                        View Certificates
                      </button>
                      <button className="w-full bg-purple-500/20 text-purple-200 px-4 py-2 rounded-lg hover:bg-purple-500/30 transition-colors text-left">
                        Take Quiz
                      </button>
                      <button className="w-full bg-orange-500/20 text-orange-200 px-4 py-2 rounded-lg hover:bg-orange-500/30 transition-colors text-left">
                        View Progress
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
