'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { RegisterRequest, UserRole } from '@/types/auth'

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    department: '',
    role: UserRole.EMPLOYEE,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.')
      return
    }

    if (!acceptTerms) {
      alert('Please accept the terms and conditions.')
      return
    }

    setIsLoading(true)

    try {
      const response = await register(formData)
      // Redirect to dashboard after successful registration
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Registration error:', error)
      // Error handled by context
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-harmony-dark">
            Join CyberTest
          </h2>
          <p className="mt-2 text-harmony-tan">
            Create your account to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-harmony-dark mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                className="w-full px-4 py-3 border border-harmony-tan/30 rounded-lg focus:ring-2 focus:ring-harmony-dark focus:border-harmony-dark transition-colors bg-white/80"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-harmony-dark mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                className="w-full px-4 py-3 border border-harmony-tan/30 rounded-lg focus:ring-2 focus:ring-harmony-dark focus:border-harmony-dark transition-colors bg-white/80"
                required
              />
            </div>
          </div>

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
            <label htmlFor="department" className="block text-sm font-medium text-harmony-dark mb-1">
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-harmony-tan/30 rounded-lg focus:ring-2 focus:ring-harmony-dark focus:border-harmony-dark transition-colors bg-white/80"
              required
            >
              <option value="">Select your department</option>
              <option value="IT">IT</option>
              <option value="HR">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Operations">Operations</option>
              <option value="Other">Other</option>
            </select>
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
                placeholder="Create a password"
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-harmony-dark mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 pr-12 border border-harmony-tan/30 rounded-lg focus:ring-2 focus:ring-harmony-dark focus:border-harmony-dark transition-colors bg-white/80"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-harmony-tan hover:text-harmony-dark"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="h-4 w-4 text-harmony-dark focus:ring-harmony-dark border-harmony-tan/30 rounded"
            />
            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-harmony-dark">
              I agree to the{' '}
              <a href="/terms" className="text-harmony-dark hover:text-harmony-tan">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-harmony-dark hover:text-harmony-tan">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-harmony-tan">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-harmony-dark hover:text-harmony-tan font-medium"
            >
              Sign in
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