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
    const res = await apiClient.get<any>('/portal/dashboard')
    return res.data?.data ?? res.data
  },

  joinEvent: async (
    eventId: string
  ): Promise<{
    message: string
    stats: PortalStats
    joinedEventIds: string[]
    recentActivities: PortalActivity[]
  }> => {
    const res = await apiClient.post<any>(`/portal/events/${eventId}/join`)
    return res.data?.data ?? res.data
  },

  updateProfile: async (payload: { name?: string; phone?: string }): Promise<{ message: string; user: PortalUser }> => {
    const res = await apiClient.put<any>('/portal/profile', payload)
    return res.data?.data ?? res.data
  },
}
