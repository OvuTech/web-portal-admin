'use client';

import { useState, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  Ticket,
  CreditCard,
  BarChart3,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Partners', href: '/dashboard/partners', icon: Building2 },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Bookings', href: '/dashboard/bookings', icon: Ticket },
  { name: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
];

const pageTitles: Record<string, { title: string; description: string }> = {
  '/dashboard': {
    title: 'Dashboard',
    description: 'Welcome back! Here\'s what\'s happening today. 👋',
  },
  '/dashboard/partners': {
    title: 'Partners',
    description: 'Manage and approve partner applications',
  },
  '/dashboard/users': {
    title: 'Users',
    description: 'Manage all user accounts and activity',
  },
  '/dashboard/bookings': {
    title: 'Bookings',
    description: 'View and manage all bookings across the platform',
  },
  '/dashboard/transactions': {
    title: 'Transactions',
    description: 'Monitor all payment transactions and refunds',
  },
  '/dashboard/analytics': {
    title: 'Analytics',
    description: 'View platform analytics and insights',
  },
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { admin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const pageInfo = pageTitles[pathname] || {
    title: 'Admin Portal',
    description: 'Manage OVU platform operations',
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Image
                src="/bird.png"
                alt="OVU Logo"
                width={35}
                height={30}
                className="h-7 w-auto"
              />
              <span className="text-lg font-bold text-gray-900 tracking-wider" style={{ fontFamily: 'Arial, sans-serif' }}>OVU</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Admin Label */}
          <div className="px-5 py-3">
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                    active
                      ? 'bg-[#0B5B7A] text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon className={cn('h-5 w-5', active ? 'text-white' : 'text-gray-400')} />
                  <span className="flex-1">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-[#0B5B7A] flex items-center justify-center text-white font-semibold text-sm">
                {admin?.first_name?.charAt(0) || 'A'}{admin?.last_name?.charAt(0) || 'D'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {admin?.first_name} {admin?.last_name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 capitalize">{admin?.role || 'Admin'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="mt-3 w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            {/* Left Section - Page Title & Welcome */}
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 font-heading">{pageInfo.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-600">{pageInfo.description}</p>
                  <span className="text-xs text-gray-400">•</span>
                  <p className="text-xs text-gray-500">Last updated: {currentTime}</p>
                </div>
              </div>
            </div>

            {/* Right Section - User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{admin?.email || 'Admin'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}


