import apiClient from './client';

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminResponse {
  id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  role: 'customer' | 'operator' | 'partner' | 'admin';
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
}

export const authService = {
  // Login admin (using /api/v1/auth/login)
  login: async (data: AdminLoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post('/auth/login', data);
    const { access_token, refresh_token } = response.data;
    
    // Store tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_access_token', access_token);
      if (refresh_token) {
        localStorage.setItem('admin_refresh_token', refresh_token);
      }
    }
    
    return response.data;
  },

  // Get current admin
  getCurrentAdmin: async (): Promise<AdminResponse> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_refresh_token');
      window.location.href = '/login';
    }
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('admin_access_token');
    }
    return false;
  },

  // Clear tokens
  clearTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_refresh_token');
    }
  },
};

export default authService;

