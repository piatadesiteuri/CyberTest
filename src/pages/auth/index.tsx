'use client'

import React, { useState } from 'react'
import LoginForm from '@/components/auth/forms/LoginForm'
import RegisterForm from '@/components/auth/forms/RegisterForm'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen harmony-gradient relative overflow-hidden">
      {/* Cyber Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-harmony-cream/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-harmony-tan/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-harmony-cream/20 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 border border-harmony-tan/20 rounded-full animate-pulse delay-3000"></div>
        
        {/* Cyber Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(252, 216, 180, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(252, 216, 180, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-harmony-cream/40 rounded-full animate-bounce delay-500"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-harmony-tan/60 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-harmony-cream/50 rounded-full animate-bounce delay-1500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="space-y-8">
          {/* Logo and Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-harmony-dark rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-harmony-cream text-2xl font-bold">🛡️</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold harmony-gradient-text">
                CyberTest
              </h1>
              <p className="text-lg text-harmony-cream mt-2">
                All-in-One Cybersecurity Training Platform
              </p>
            </div>
          </div>

          {/* Auth Form */}
          <div className="card w-full max-w-md mx-auto">
            {isLogin ? (
              <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-harmony-cream/80 text-sm">
            <p>© 2025 CyberTest. All rights reserved.</p>
            <p className="mt-1">Empowering organizations with cybersecurity awareness.</p>
          </div>
        </div>
      </div>
    </div>
  )
}