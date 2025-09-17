'use client'

import { Menu, Bell, User, Shield } from 'lucide-react'

interface DashboardHeaderProps {
  onMenuClick: () => void
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="header-gradient shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden text-white hover:text-harmony-cream transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CyberTest Dashboard</h1>
                <p className="text-sm text-harmony-cream">Security Training Platform</p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-white hover:text-harmony-cream transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-harmony-cream">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
