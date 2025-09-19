'use client'

import { X, Home, Users, Shield, BarChart3, Settings, FileText, Target } from 'lucide-react'
import { TabType } from './AdminDashboard'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const navigation = [
  { name: 'Dashboard', tab: 'dashboard' as TabType, icon: Home },
  { name: 'Training Programs', tab: 'training' as TabType, icon: FileText },
  { name: 'Simulations', tab: 'simulations' as TabType, icon: Target },
  { name: 'Users', tab: 'users' as TabType, icon: Users },
  { name: 'Security Alerts', tab: 'security' as TabType, icon: Shield },
  { name: 'Reports', tab: 'reports' as TabType, icon: BarChart3 },
  { name: 'Settings', tab: 'settings' as TabType, icon: Settings },
]

export default function Sidebar({ isOpen, onClose, activeTab, onTabChange }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 sidebar-gradient transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">CyberTest</h2>
                <p className="text-xs text-harmony-cream">Training Platform</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-white hover:text-harmony-cream transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.tab
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    onTabChange(item.tab)
                    onClose() // Close sidebar on mobile after selection
                  }}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full text-left
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'text-harmony-cream hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-harmony-cream mb-1">Security Status</p>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-white">All Systems Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}