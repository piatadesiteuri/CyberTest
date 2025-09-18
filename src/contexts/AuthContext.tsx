'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContextType, User, LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth'
import { authService } from '@/services/auth/authService'
import { useToast } from './ToastContext'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { addToast } = useToast()

  useEffect(() => {
    // Clean up corrupted localStorage data
    try {
      const userStr = localStorage.getItem('user')
      if (userStr === 'undefined' || userStr === 'null') {
        console.log('Cleaning up corrupted localStorage data')
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    } catch (error) {
      console.log('Error cleaning localStorage:', error)
      // If localStorage is corrupted, clear everything
      localStorage.clear()
    }
    
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser()
    console.log('AuthContext useEffect - currentUser:', currentUser)
    console.log('AuthContext useEffect - isAuthenticated:', authService.isAuthenticated())
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      setIsLoading(true)
      const response = await authService.login(credentials)
      console.log('AuthContext login - response:', response)
      console.log('AuthContext login - setting user:', response.user)
      setUser(response.user)
      
      addToast({
        type: 'success',
        title: 'Welcome back!',
        message: `Successfully logged in as ${response.user.firstName} ${response.user.lastName}`,
        duration: 4000
      })
      
      return response
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Login Failed',
        message: 'Invalid credentials. Please try again.',
        duration: 5000
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      setIsLoading(true)
      const response = await authService.register(userData)
      setUser(response.user)
      
      addToast({
        type: 'success',
        title: 'Account Created!',
        message: `Welcome to CyberTest, ${response.user.firstName}! Your account has been created successfully.`,
        duration: 5000
      })
      
      return response
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Registration Failed',
        message: 'Unable to create account. Please try again.',
        duration: 5000
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      const userName = user?.firstName || 'User'
      await authService.logout()
      setUser(null)
      
      addToast({
        type: 'info',
        title: 'Logged Out',
        message: `Goodbye, ${userName}! You have been successfully logged out.`,
        duration: 3000
      })
    } catch (error) {
      console.error('Logout error:', error)
      addToast({
        type: 'error',
        title: 'Logout Error',
        message: 'There was an error during logout. Please try again.',
        duration: 4000
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = async () => {
    try {
      await authService.refreshToken()
    } catch (error) {
      console.error('Token refresh error:', error)
      // If refresh fails, logout user
      await logout()
    }
  }

  // Role-based helper functions
  const hasRole = (role: string): boolean => {
    return user?.role === role
  }

  const hasAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false
  }

  const isAdmin = (): boolean => {
    return hasAnyRole(['admin', 'it_security_admin', 'ciso'])
  }

  const isManager = (): boolean => {
    return hasAnyRole(['manager', 'admin', 'it_security_admin', 'ciso'])
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    hasRole,
    hasAnyRole,
    isAdmin,
    isManager,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
