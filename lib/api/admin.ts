import apiClient from './client';

export interface Partner {
  id: string;
  email: string;
  name?: string;
  company_name: string;
  business_type: string;
  status: 'pending_verification' | 'pending_approval' | 'active' | 'suspended' | 'rejected';
  created_at: string;
}

export interface PartnerApprovalRequest {
  action: 'approve' | 'reject';
  rate_limit_per_minute?: number;
  rate_limit_per_day?: number;
  notes?: string;
  reason?: string;
}

export interface Booking {
  id: string;
  booking_reference: string;
  user_id: string;
  transport_type: string;
  status: string;
  origin: string;
  destination: string;
  departure_date: string;
  total_passengers: number;
  total_price: number;
  currency: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  created_at: string;
}

export interface WaitlistMember {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface WaitlistResponse {
  waitlist: WaitlistMember[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PartnersResponse {
  partners: Partner[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const adminService = {
  // Partners
  getAllPartners: async (params?: { page?: number; page_size?: number; status_filter?: string }): Promise<PartnersResponse> => {
    const response = await apiClient.get('/admin/partners', { params });
    return response.data;
  },

  getPendingPartners: async (params?: { skip?: number; limit?: number }): Promise<Partner[]> => {
    const response = await apiClient.get('/admin/partners/pending', { params });
    return response.data;
  },

  approvePartner: async (partnerId: string, data: PartnerApprovalRequest): Promise<any> => {
    const response = await apiClient.post(`/admin/partners/${partnerId}/approve`, data);
    return response.data;
  },

  suspendPartner: async (partnerId: string, reason: string): Promise<any> => {
    const response = await apiClient.post(`/admin/partners/${partnerId}/suspend`, { reason });
    return response.data;
  },

  rejectPartner: async (partnerId: string, data: { reason?: string }): Promise<any> => {
    const response = await apiClient.post(`/admin/partners/${partnerId}/approve`, {
      action: 'reject',
      reason: data.reason,
    });
    return response.data;
  },


  activatePartner: async (partnerId: string): Promise<any> => {
    const response = await apiClient.post(`/admin/partners/${partnerId}/activate`);
    return response.data;
  },

  // Bookings
  getBookings: async (params?: any): Promise<Booking[]> => {
    const response = await apiClient.get('/admin/bookings', { params });
    return response.data;
  },

  // Transactions
  getTransactions: async (params?: any): Promise<Transaction[]> => {
    const response = await apiClient.get('/admin/transactions', { params });
    return response.data;
  },

  // Waitlist
  getWaitlist: async (params?: { page?: number; page_size?: number }): Promise<WaitlistResponse> => {
    const response = await apiClient.get('/admin/waitlist', { params });
    return response.data;
  },
};

export default adminService;


