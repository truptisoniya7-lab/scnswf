import { apiClient } from './client'

export interface AuthUser {
  id: string
  email: string
  first_name?: string
  last_name?: string
  name: string
  role: string
  is_staff?: boolean
  avatar_url?: string | null
}

export interface AuthResponse {
  access: string
  refresh?: string
  user: AuthUser
}

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await apiClient.post<{ data: AuthResponse }>('/auth/login', credentials)
    return res.data.data
  },

  register: async (payload: { email: string; password: string; name: string; phone?: string }) => {
    const res = await apiClient.post<{ data: AuthResponse }>('/auth/register', payload)
    return res.data.data
  },

  forgotPassword: async (email: string) => {
    const res = await apiClient.post<{ data: { message: string; resend_cooldown?: number } }>(
      '/auth/forgot-password',
      { email }
    )
    return res.data.data
  },

  verifyResetOtp: async (email: string, otp: string) => {
    const res = await apiClient.post<{ data: { message: string; verified: boolean } }>(
      '/auth/verify-reset-otp',
      { email, otp }
    )
    return res.data.data
  },

  resetPassword: async (payload: { email: string; otp: string; newPassword: string }) => {
    const res = await apiClient.post<{ data: { message: string } }>('/auth/reset-password', payload)
    return res.data.data
  },

  googleAuth: async (payload: { email: string; name?: string; avatar?: string }) => {
    const res = await apiClient.post<{ data: AuthResponse }>('/auth/google', payload)
    return res.data.data
  },

  getCurrentUser: async () => {
    const res = await apiClient.get<{ data: AuthUser }>('/auth/me')
    return res.data.data
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('auth_user')
    }
  },
}

