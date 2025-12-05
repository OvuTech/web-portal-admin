'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService, AdminResponse, AdminLoginRequest } from '@/lib/api/auth';

interface AuthContextType {
  admin: AdminResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: AdminLoginRequest) => Promise<void>;
  logout: () => void;
  refreshAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const adminData = await authService.getCurrentAdmin();
          
          // Verify user has admin role
          if (adminData.role !== 'admin') {
            console.error('Access denied: User does not have admin role');
            authService.logout();
            router.push('/login');
            setIsLoading(false);
            return;
          }
          
          // If API returns name instead of first_name/last_name, split it
          if (adminData.name && !adminData.first_name) {
            const nameParts = adminData.name.split(' ');
            adminData.first_name = nameParts[0] || '';
            adminData.last_name = nameParts.slice(1).join(' ') || '';
          }
          setAdmin(adminData);
        } catch (error) {
          console.error('Failed to get admin data:', error);
          authService.logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const login = async (data: AdminLoginRequest) => {
    await authService.login(data);
    const adminData = await authService.getCurrentAdmin();
    
    // Verify user has admin role
    if (adminData.role !== 'admin') {
      authService.logout();
      throw new Error('Access denied: You do not have admin privileges');
    }
    
    // If API returns name instead of first_name/last_name, split it
    if (adminData.name && !adminData.first_name) {
      const nameParts = adminData.name.split(' ');
      adminData.first_name = nameParts[0] || '';
      adminData.last_name = nameParts.slice(1).join(' ') || '';
    }
    setAdmin(adminData);
    router.push('/dashboard');
  };

  const logout = () => {
    setAdmin(null);
    authService.logout();
  };

  const refreshAdmin = async () => {
    if (authService.isAuthenticated()) {
      const adminData = await authService.getCurrentAdmin();
      // If API returns name instead of first_name/last_name, split it
      if (adminData.name && !adminData.first_name) {
        const nameParts = adminData.name.split(' ');
        adminData.first_name = nameParts[0] || '';
        adminData.last_name = nameParts.slice(1).join(' ') || '';
      }
      setAdmin(adminData);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin,
        login,
        logout,
        refreshAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

