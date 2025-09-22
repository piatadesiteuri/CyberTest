import { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types/auth'

class AuthService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://cybertest-production.up.railway.app'

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('🔗 AuthService login - baseUrl:', this.baseUrl)
      console.log('🔗 AuthService login - NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }

      const data = await response.json()
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', data.data.token)
      localStorage.setItem('refreshToken', data.data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.data.user))

      return data.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Registration failed')
      }

      const data = await response.json()
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', data.data.token)
      localStorage.setItem('refreshToken', data.data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.data.user))

      return data.data
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      
      if (refreshToken) {
        await fetch(`${this.baseUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const data = await response.json()
      localStorage.setItem('accessToken', data.token)
      
      return data.token
    } catch (error) {
      console.error('Token refresh error:', error)
      throw error
    }
  }

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user')
      if (!userStr || userStr === 'undefined' || userStr === 'null') {
        return null
      }
      return JSON.parse(userStr)
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }

  getAccessToken(): string | null {
    const token = localStorage.getItem('accessToken')
    return token && token !== 'undefined' && token !== 'null' ? token : null
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken()
    const user = this.getCurrentUser()
    return !!(token && user)
  }
}

export const authService = new AuthService()
