'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContextType, User, LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth'
import { authService } from '@/services/auth/authService'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser()
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      setIsLoading(true)
      const response = await authService.login(credentials)
      setUser(response.user)
      return response
    } catch (error) {
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
      return response
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await authService.logout()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
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
