'use client'

import React, { useState } from 'react'
import LoginForm from '@/components/auth/forms/LoginForm'
import RegisterForm from '@/components/auth/forms/RegisterForm'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Logo and Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">🛡️</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                CyberTest
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                All-in-One Cybersecurity Training Platform
              </p>
            </div>
          </div>

          {/* Auth Form */}
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md mx-auto border border-gray-200">
            {isLogin ? (
              <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-gray-600 text-sm">
            <p>© 2025 CyberTest. All rights reserved.</p>
            <p className="mt-1">Empowering organizations with cybersecurity awareness.</p>
          </div>
        </div>
      </div>
    </div>
  )
}