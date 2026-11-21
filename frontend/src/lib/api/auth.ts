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
export type LoginVerifyRes = { user: User; accessToken: string }

export type LoginResendReq = { loginId: string }
export type LoginResendRes = { otpExpiresInSec: number; resendAfterSec: number }

export type StartReq = { name: string; phone: string; email: string }
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
    if (result.accessToken) {
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
