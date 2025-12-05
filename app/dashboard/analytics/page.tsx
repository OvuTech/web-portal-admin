'use client';

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0B5B7A', '#094A63', '#FFC107', '#10B981', '#EF4444'];

const bookingData = [
  { name: 'Jan', bookings: 400, revenue: 2400 },
  { name: 'Feb', bookings: 300, revenue: 1800 },
  { name: 'Mar', bookings: 500, revenue: 3000 },
  { name: 'Apr', bookings: 450, revenue: 2700 },
  { name: 'May', bookings: 600, revenue: 3600 },
  { name: 'Jun', bookings: 550, revenue: 3300 },
];

const routeData = [
  { name: 'Lagos - Abuja', value: 35 },
  { name: 'Lagos - Ibadan', value: 25 },
  { name: 'Abuja - Kano', value: 20 },
  { name: 'Lagos - Port Harcourt', value: 15 },
  { name: 'Others', value: 5 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bookings" stroke="#0B5B7A" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#0B5B7A" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Route Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Routes</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={routeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percent }: { percent?: number }) => percent ? `${(percent * 100).toFixed(0)}%` : ''}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {routeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

