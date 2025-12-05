'use client';

import { useEffect, useState } from 'react';
import { Eye, Search, Filter, Download } from 'lucide-react';
import { formatDate, formatDateTime, formatCurrency } from '@/lib/utils';
import { adminService, Booking } from '@/lib/api/admin';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-700' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
      completed: { label: 'Completed', className: 'bg-blue-100 text-blue-700' },
    };

    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-700' };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-ovu-primary"
              />
            </div>
            <select className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-ovu-primary">
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-ovu-primary">
              <option value="all">All Types</option>
              <option value="bus">Bus</option>
              <option value="airline">Airline</option>
            </select>
            <button className="h-10 px-4 flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button className="h-10 px-4 flex items-center gap-2 text-sm font-medium text-white bg-ovu-primary hover:bg-ovu-secondary rounded-lg cursor-pointer">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Booking Reference</th>
                <th>Route</th>
                <th>Transport Type</th>
                <th>Passengers</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    Loading bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="font-medium">{booking.booking_reference}</td>
                    <td>
                      {booking.origin} → {booking.destination}
                    </td>
                    <td className="capitalize">{booking.transport_type}</td>
                    <td>{booking.total_passengers}</td>
                    <td className="font-medium">{formatCurrency(booking.total_price, booking.currency)}</td>
                    <td>{getStatusBadge(booking.status)}</td>
                    <td>{formatDate(booking.departure_date)}</td>
                    <td>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


