'use client'

import { Shield } from 'lucide-react'
import CyberMenu from './icons/CyberMenu'
import CyberBell from './icons/CyberBell'
import CyberUser from './icons/CyberUser'
import CyberLogout from './icons/CyberLogout'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface DashboardHeaderProps {
  onMenuClick: () => void
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
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
              <CyberMenu className="h-6 w-6" />
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
              <CyberBell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-warm-sunset rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <CyberUser className="h-6 w-6 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-harmony-cream capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors group"
                title="Logout"
              >
                <CyberLogout className="h-5 w-5 text-white group-hover:text-warm-sunset transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
