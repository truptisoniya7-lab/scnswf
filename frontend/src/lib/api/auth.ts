import { apiClient } from '../../api/client'

export type Role = 'internship' | 'donor' | 'volunteer' | string
export type SystemRole = 'user' | 'staff' | 'superadmin'

export interface User {
  id: string
  name: string
  phone: string
  email: string
  emailVerified: boolean
  role: Role
  systemRole?: SystemRole
  registrationRole?: string
  status?: string
  createdAt: string
}

export type LoginStartReq = { email: string }
export type LoginStartRes = { loginId: string; otpExpiresInSec: number; resendAfterSec: number }

export type LoginVerifyReq = { loginId: string; otp: string }
export type LoginVerifyRes = {
  user?: User
  accessToken?: string
  isNewUser?: boolean
  email?: string
  message?: string
}

export type SetupPasswordReq = {
  email: string
  password?: string
  name?: string
  phone?: string
  role?: 'volunteer' | 'donor' | 'internship'
  bio?: string
}
export type SetupPasswordRes = { user: User; accessToken: string }

export type LoginResendReq = { loginId: string }
export type LoginResendRes = { otpExpiresInSec: number; resendAfterSec: number }

export type StartReq = { name: string; phone: string; email: string; password?: string }
export type StartRes = { registrationId: string; otpExpiresInSec: number; resendAfterSec: number }

export type VerifyReq = { registrationId: string; otp: string }
export type VerifyRes = { verified: true }

export type ResendReq = { registrationId: string }
export type ResendRes = { otpExpiresInSec: number; resendAfterSec: number }

export type CompleteReq = { registrationId: string; role: 'internship' | 'donor' | 'volunteer' }
export type CompleteRes = { user: User; accessToken: string }

export const passwordlessAuthApi = {
  // Login flow
  loginStart: async (data: LoginStartReq): Promise<LoginStartRes> => {
    const res = await apiClient.post<{ data: LoginStartRes }>('/auth/login/start', data)
    return res.data.data ?? (res.data as unknown as LoginStartRes)
  },

  loginVerify: async (data: LoginVerifyReq): Promise<LoginVerifyRes> => {
    const res = await apiClient.post<{ data: LoginVerifyRes }>('/auth/login/verify', data)
    const result = res.data.data ?? (res.data as unknown as LoginVerifyRes)
    if (result.accessToken && result.user) {
      localStorage.setItem('access_token', result.accessToken)
      localStorage.setItem('auth_user', JSON.stringify(result.user))
      window.dispatchEvent(new Event('authChange'))
    }
    return result
  },

  setupPassword: async (data: SetupPasswordReq): Promise<SetupPasswordRes> => {
    const res = await apiClient.post<{ data: SetupPasswordRes }>('/auth/setup-password', data)
    const result = res.data.data ?? (res.data as unknown as SetupPasswordRes)
    if (result.accessToken && result.user) {
      localStorage.setItem('access_token', result.accessToken)
      localStorage.setItem('auth_user', JSON.stringify(result.user))
      window.dispatchEvent(new Event('authChange'))
    }
    return result
  },

  loginResend: async (data: LoginResendReq): Promise<LoginResendRes> => {
    const res = await apiClient.post<{ data: LoginResendRes }>('/auth/login/resend', data)
    return res.data.data ?? (res.data as unknown as LoginResendRes)
  },

  // Register flow
  registerStart: async (data: StartReq): Promise<StartRes> => {
    const res = await apiClient.post<{ data: StartRes }>('/auth/register/start', data)
    return res.data.data ?? (res.data as unknown as StartRes)
  },

  registerVerify: async (data: VerifyReq): Promise<VerifyRes> => {
    const res = await apiClient.post<{ data: VerifyRes }>('/auth/register/verify', data)
    return res.data.data ?? (res.data as unknown as VerifyRes)
  },

  registerResend: async (data: ResendReq): Promise<ResendRes> => {
    const res = await apiClient.post<{ data: ResendRes }>('/auth/register/resend', data)
    return res.data.data ?? (res.data as unknown as ResendRes)
  },

  registerComplete: async (data: CompleteReq): Promise<CompleteRes> => {
    const res = await apiClient.post<{ data: CompleteRes }>('/auth/register/complete', data)
    const result = res.data.data ?? (res.data as unknown as CompleteRes)
    if (result.accessToken) {
      localStorage.setItem('access_token', result.accessToken)
      localStorage.setItem('auth_user', JSON.stringify(result.user))
      window.dispatchEvent(new Event('authChange'))
    }
    return result
  },

  // Password login flow
  loginWithPassword: async (credentials: { email: string; password: string }): Promise<LoginVerifyRes> => {
    const res = await apiClient.post<any>('/auth/login', credentials)
    const data = res.data?.data ?? res.data
    const token = data.accessToken || data.access
    const user = data.user
    if (token) {
      localStorage.setItem('access_token', token)
      localStorage.setItem('auth_user', JSON.stringify(user))
      window.dispatchEvent(new Event('authChange'))
    }
    return { user, accessToken: token }
  },

  // Password reset flow
  forgotPassword: async (email: string): Promise<{ message: string; resend_cooldown?: number }> => {
    const res = await apiClient.post<any>('/auth/forgot-password', { email })
    return res.data?.data ?? res.data
  },

  verifyResetOtp: async (email: string, otp: string): Promise<{ message: string; verified: boolean }> => {
    const res = await apiClient.post<any>('/auth/verify-reset-otp', { email, otp })
    return res.data?.data ?? res.data
  },

  resetPassword: async (payload: { email: string; otp: string; newPassword: string }): Promise<{ message: string }> => {
    const res = await apiClient.post<any>('/auth/reset-password', payload)
    return res.data?.data ?? res.data
  },

  // Current session & logout
  getCurrentUser: (): User | null => {
    try {
      const raw = localStorage.getItem('auth_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('auth_user')
      window.dispatchEvent(new Event('authChange'))
    }
  },
}
