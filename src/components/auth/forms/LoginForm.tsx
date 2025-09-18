'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LoginRequest } from '@/types/auth'

interface LoginFormProps {
  onSwitchToRegister: () => void
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await login(formData)
      // Redirect to dashboard after successful login
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      // Error handled by context
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-harmony-dark">
            Welcome Back
          </h2>
          <p className="mt-2 text-harmony-tan">
            Sign in to your CyberTest account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-harmony-dark mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-harmony-tan/30 rounded-lg focus:ring-2 focus:ring-harmony-dark focus:border-harmony-dark transition-colors bg-white/80"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-harmony-dark mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-12 border border-harmony-tan/30 rounded-lg focus:ring-2 focus:ring-harmony-dark focus:border-harmony-dark transition-colors bg-white/80"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-harmony-tan hover:text-harmony-dark"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-harmony-dark focus:ring-harmony-dark border-harmony-tan/30 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-harmony-dark">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-harmony-dark hover:text-harmony-tan">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-harmony-tan">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-harmony-dark hover:text-harmony-tan font-medium"
            >
              Sign up
            </button>
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-harmony-tan/30" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white/90 text-harmony-tan">Or continue with</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <button className="flex-1 bg-white/90 border border-harmony-tan/30 text-harmony-dark py-3 px-4 rounded-lg hover:bg-harmony-cream/20 focus:ring-2 focus:ring-harmony-dark focus:ring-offset-2 transition-colors font-medium">
            Google
          </button>
          <button className="flex-1 bg-white/90 border border-harmony-tan/30 text-harmony-dark py-3 px-4 rounded-lg hover:bg-harmony-cream/20 focus:ring-2 focus:ring-harmony-dark focus:ring-offset-2 transition-colors font-medium">
            Microsoft
          </button>
        </div>
      </div>
    </div>
  )
}