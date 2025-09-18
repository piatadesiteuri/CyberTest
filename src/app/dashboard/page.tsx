'use client'

import { useAuth } from '@/contexts/AuthContext'
import AdminDashboard from '@/components/AdminDashboard'
import UserDashboard from '@/components/UserDashboard'

export default function DashboardPage() {
  const { user, isLoading, isAdmin } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-harmony-dark mx-auto mb-4"></div>
          <p className="text-harmony-cream">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access the dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      {isAdmin() ? <AdminDashboard /> : <UserDashboard />}
    </main>
  )
}
