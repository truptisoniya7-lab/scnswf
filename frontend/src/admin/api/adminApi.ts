import { apiClient } from '../../api/client';

export interface OverviewStats {
  totalUsers: number;
  newUsersThisMonth: number;
  pendingApplications: number;
  donationsThisMonthAmount: number;
  donationsThisMonthCount: number;
  totalDonationsAmount: number;
  recentAudit: any[];
  recentApplications: any[];
}

export interface RegistrationChartData {
  timeline: { date: string; count: number }[];
  roles: { name: string; value: number }[];
}

export interface DonationChartItem {
  month: string;
  amount: number;
  count: number;
}

export interface AdminUser {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: string;
  systemRole?: 'user' | 'staff' | 'superadmin';
  registrationRole?: string;
  status?: 'active' | 'suspended';
  emailVerified?: boolean;
  createdAt: string;
}

export interface AdminApplication {
  id: string;
  type: 'volunteer' | 'internship';
  applicantName: string;
  email: string;
  phone?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
  reviewerId?: string;
  rejectionReason?: string;
  notes: { id: string; authorId: string; authorName: string; text: string; createdAt: string }[];
  statusHistory: { status: string; changedBy: string; reason?: string; at: string }[];
  details: Record<string, any>;
}

export interface AdminDonation {
  id: string;
  donor_name?: string | null;
  donor_email?: string | null;
  donor_phone?: string | null;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  receipt_number?: string;
  method?: string;
  created_at: string;
}

export const adminApi = {
  // Stats
  getOverview: async () => {
    const res = await apiClient.get<{ data: OverviewStats }>('/admin/stats/overview');
    return res.data.data;
  },

  getRegistrationsChart: async (days = 30) => {
    const res = await apiClient.get<{ data: RegistrationChartData }>(`/admin/stats/registrations?days=${days}`);
    return res.data.data;
  },

  getDonationsChart: async () => {
    const res = await apiClient.get<{ data: DonationChartItem[] }>('/admin/stats/donations');
    return res.data.data;
  },

  // Users
  listUsers: async (params?: Record<string, any>) => {
    const res = await apiClient.get('/admin/users', { params });
    return res.data;
  },

  getUser: async (id: string) => {
    const res = await apiClient.get<{ data: { user: AdminUser; linkedApplications: any; linkedDonations: any[] } }>(
      `/admin/users/${id}`
    );
    return res.data.data;
  },

  updateUser: async (id: string, data: Partial<AdminUser>) => {
    const res = await apiClient.patch(`/admin/users/${id}`, data);
    return res.data.data;
  },

  suspendUser: async (id: string) => {
    const res = await apiClient.post(`/admin/users/${id}/suspend`);
    return res.data;
  },

  reactivateUser: async (id: string) => {
    const res = await apiClient.post(`/admin/users/${id}/reactivate`);
    return res.data;
  },

  deleteUser: async (id: string) => {
    const res = await apiClient.delete(`/admin/users/${id}`);
    return res.data;
  },

  changeSystemRole: async (id: string, systemRole: 'user' | 'staff' | 'superadmin') => {
    const res = await apiClient.patch(`/admin/users/${id}/system-role`, { systemRole });
    return res.data;
  },

  // Applications
  listApplications: async (params?: Record<string, any>) => {
    const res = await apiClient.get('/admin/applications', { params });
    return res.data;
  },

  getApplication: async (id: string) => {
    const res = await apiClient.get<{ data: AdminApplication }>(`/admin/applications/${id}`);
    return res.data.data;
  },

  updateApplicationStatus: async (id: string, status: string, reason?: string) => {
    const res = await apiClient.patch(`/admin/applications/${id}/status`, { status, reason });
    return res.data;
  },

  addApplicationNote: async (id: string, text: string) => {
    const res = await apiClient.post(`/admin/applications/${id}/notes`, { text });
    return res.data.data;
  },

  bulkApplications: async (ids: string[], action: 'approve' | 'reject', reason?: string) => {
    const res = await apiClient.post('/admin/applications/bulk', { ids, action, reason });
    return res.data;
  },

  // Donations
  listDonations: async (params?: Record<string, any>) => {
    const res = await apiClient.get('/admin/donations', { params });
    return res.data;
  },

  getDonation: async (id: string) => {
    const res = await apiClient.get<{ data: AdminDonation }>(`/admin/donations/${id}`);
    return res.data.data;
  },

  createManualDonation: async (data: any) => {
    const res = await apiClient.post('/admin/donations', data);
    return res.data.data;
  },

  updateDonationStatus: async (id: string, status: string) => {
    const res = await apiClient.patch(`/admin/donations/${id}/status`, { status });
    return res.data.data;
  },

  resendDonationReceipt: async (id: string) => {
    const res = await apiClient.post(`/admin/donations/${id}/resend-receipt`);
    return res.data;
  },

  // Content
  listContent: async (type: string) => {
    const res = await apiClient.get(`/admin/content/${type}`);
    return res.data.data;
  },

  createContent: async (type: string, data: any) => {
    const res = await apiClient.post(`/admin/content/${type}`, data);
    return res.data.data;
  },

  deleteContent: async (type: string, id: string) => {
    const res = await apiClient.delete(`/admin/content/${type}/${id}`);
    return res.data;
  },

  // Audit
  listAudit: async (params?: Record<string, any>) => {
    const res = await apiClient.get('/admin/audit', { params });
    return res.data;
  },

  getAudit: async (id: string) => {
    const res = await apiClient.get(`/admin/audit/${id}`);
    return res.data.data;
  },

  // Settings
  getSettings: async () => {
    const res = await apiClient.get('/admin/settings');
    return res.data.data;
  },

  listStaff: async () => {
    const res = await apiClient.get('/admin/staff');
    return res.data.data;
  },

  // Export CSV
  getExportUrl: (entity: string, params?: Record<string, any>) => {
    const query = new URLSearchParams(params).toString();
    const baseURL = (apiClient.defaults.baseURL || '/api/v1').replace(/\/+$/, '');
    return `${baseURL}/admin/export/${entity}.csv${query ? `?${query}` : ''}`;
  },
};
