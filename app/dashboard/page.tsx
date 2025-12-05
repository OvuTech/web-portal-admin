'use client';

import { useEffect, useState } from 'react';
import { Users, Building2, Ticket, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface DashboardStats {
  totalUsers: number;
  totalPartners: number;
  totalBookings: number;
  totalRevenue: number;
  pendingPartners: number;
  activeBookings: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPartners: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingPartners: 0,
    activeBookings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch dashboard stats from API
    // For now, using mock data
    setStats({
      totalUsers: 1250,
      totalPartners: 45,
      totalBookings: 3420,
      totalRevenue: 12500000,
      pendingPartners: 8,
      activeBookings: 156,
    });
    setIsLoading(false);
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      change: '+12%',
      trend: 'up',
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Total Partners',
      value: stats.totalPartners.toLocaleString(),
      icon: Building2,
      change: '+5',
      trend: 'up',
      color: 'bg-green-100',
      iconColor: 'text-green-600',
      badge: stats.pendingPartners > 0 ? `${stats.pendingPartners} pending` : null,
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toLocaleString(),
      icon: Ticket,
      change: '+8%',
      trend: 'up',
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: CreditCard,
      change: '+15%',
      trend: 'up',
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
  ];

  if (isLoading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  {stat.badge && (
                    <p className="mt-2 text-xs text-orange-600 font-medium">{stat.badge}</p>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/dashboard/partners?filter=pending"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-900">
                  Review Pending Partners ({stats.pendingPartners})
                </span>
              </div>
              <span className="text-xs text-gray-500">→</span>
            </a>
            <a
              href="/dashboard/bookings?filter=active"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Ticket className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  Active Bookings ({stats.activeBookings})
                </span>
              </div>
              <span className="text-xs text-gray-500">→</span>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900">No recent activity</p>
              <p className="text-xs text-gray-500 mt-1">Activity will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


