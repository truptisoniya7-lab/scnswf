import { apiClient } from '../../api/client'

export interface PortalUser {
  id: string
  name: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  role: string
  systemRole?: string
  status?: string
  createdAt?: string
  avatarUrl?: string | null
}

export interface PortalStats {
  eventsJoined: number
  volunteerHours: number
  campsSupported: number
  certificatesEarned: number
}

export interface PortalEvent {
  id: string
  slug: string
  title: string
  description: string
  location: string
  start_datetime: string
  end_datetime: string
  cover_image_url?: string | null
  status: string
}

export interface PortalActivity {
  id: string
  text: string
  timestamp: string
}

export interface PortalDashboardData {
  user: PortalUser
  stats: PortalStats
  joinedEventIds: string[]
  upcomingEvents: PortalEvent[]
  recentActivities: PortalActivity[]
}

export const portalApi = {
  getDashboard: async (): Promise<PortalDashboardData> => {
    try {
      const res = await apiClient.get<any>('/portal/dashboard')
      return res.data?.data ?? res.data
    } catch (err: any) {
      if (err?.response?.status === 404) {
        try {
          const fallback = await apiClient.get<any>('/auth/portal/dashboard')
          return fallback.data?.data ?? fallback.data
        } catch {
          // continue to throw original error
        }
      }
      throw err
    }
  },

  joinEvent: async (
    eventId: string
  ): Promise<{
    message: string
    stats: PortalStats
    joinedEventIds: string[]
    recentActivities: PortalActivity[]
  }> => {
    try {
      const res = await apiClient.post<any>(`/portal/events/${eventId}/join`)
      return res.data?.data ?? res.data
    } catch (err: any) {
      if (err?.response?.status === 404) {
        try {
          const fallback = await apiClient.post<any>(`/auth/portal/events/${eventId}/join`)
          return fallback.data?.data ?? fallback.data
        } catch {
          // continue
        }
      }
      throw err
    }
  },

  updateProfile: async (payload: { name?: string; phone?: string }): Promise<{ message: string; user: PortalUser }> => {
    try {
      const res = await apiClient.put<any>('/portal/profile', payload)
      return res.data?.data ?? res.data
    } catch (err: any) {
      if (err?.response?.status === 404) {
        try {
          const fallback = await apiClient.put<any>(`/auth/portal/profile`, payload)
          return fallback.data?.data ?? fallback.data
        } catch {
          // continue
        }
      }
      throw err
    }
  },
}
