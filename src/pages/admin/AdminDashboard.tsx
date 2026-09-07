import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  TrendingUp,
  UserCheck,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronRight,
  Bus,
  AlertCircle
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import StatusBadge from '../../components/ui/StatusBadge';

const bookingChartData = [
  { month: 'Jan', bookings: 320, revenue: 420000 },
  { month: 'Feb', bookings: 410, revenue: 530000 },
  { month: 'Mar', bookings: 380, revenue: 490000 },
  { month: 'Apr', bookings: 450, revenue: 580000 },
  { month: 'May', bookings: 390, revenue: 510000 },
  { month: 'Jun', bookings: 470, revenue: 620000 },
];

const staticTransactions = [
  { id: 'TR-8921', customer: 'Rohan Sharma', route: 'Bengaluru → Hyderabad', amount: 1850, status: 'completed', date: 'Just now' },
  { id: 'TR-8920', customer: 'Priya Patel', route: 'Mumbai → Pune', amount: 650, status: 'completed', date: '12m ago' },
  { id: 'TR-8919', customer: 'Anand Verma', route: 'Delhi → Jaipur', amount: 920, status: 'pending', date: '34m ago' },
  { id: 'TR-8918', customer: 'Sneha Reddy', route: 'Chennai → Bengaluru', amount: 1200, status: 'completed', date: '1h ago' },
  { id: 'TR-8917', customer: 'Karthik Nair', route: 'Hyderabad → Vijayawada', amount: 780, status: 'refunded', date: '2h ago' },
];

const popularRoutes = [
  { source: 'Bengaluru', destination: 'Hyderabad', count: 1420, percentage: 38 },
  { source: 'Mumbai', destination: 'Pune', count: 980, percentage: 26 },
  { source: 'Delhi', destination: 'Jaipur', count: 750, percentage: 20 },
  { source: 'Chennai', destination: 'Bengaluru', count: 590, percentage: 16 },
];

export const AdminDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'today' | '7d' | '30d'>('7d');

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header with Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Operations Command Center</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Real-time fleet utilization, reservation velocity, and operational revenue.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded-lg shadow-xs">
          <button
            onClick={() => setTimeframe('today')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              timeframe === 'today' ? 'bg-primary text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeframe('7d')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              timeframe === '7d' ? 'bg-primary text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeframe('30d')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              timeframe === '30d' ? 'bg-primary text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/schedules"
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all hover:border-primary/40 group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Bookings</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">2,420</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="flex items-center text-emerald-600 font-semibold">
              <ArrowUpRight className="w-4 h-4 mr-0.5" /> +12.4%
            </span>
            <span className="text-gray-400 group-hover:text-primary transition-colors flex items-center">
              View Schedules <ChevronRight size={12} className="ml-0.5" />
            </span>
          </div>
        </Link>

        <Link
          to="/admin/transactions"
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all hover:border-primary/40 group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gross Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">₹3,150,000</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 group-hover:scale-105 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="flex items-center text-emerald-600 font-semibold">
              <ArrowUpRight className="w-4 h-4 mr-0.5" /> +8.1%
            </span>
            <span className="text-gray-400 group-hover:text-primary transition-colors flex items-center">
              Reconcile <ChevronRight size={12} className="ml-0.5" />
            </span>
          </div>
        </Link>

        <Link
          to="/admin/buses"
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all hover:border-primary/40 group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Fleet</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">48 Buses</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 group-hover:scale-105 transition-transform">
              <Bus className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-gray-600 font-medium">92% Operational</span>
            <span className="text-gray-400 group-hover:text-primary transition-colors flex items-center">
              Fleet Specs <ChevronRight size={12} className="ml-0.5" />
            </span>
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all hover:border-primary/40 group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Users & Agents</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">3,587</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 group-hover:scale-105 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="flex items-center text-emerald-600 font-semibold">
              <ArrowUpRight className="w-4 h-4 mr-0.5" /> +18 new
            </span>
            <span className="text-gray-400 group-hover:text-primary transition-colors flex items-center">
              Manage <ChevronRight size={12} className="ml-0.5" />
            </span>
          </div>
        </Link>
      </div>

      {/* Main Charts & Popular Routes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Booking Velocity Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Booking Volume & Velocity</h2>
              <p className="text-xs text-gray-500">Monthly passenger reservation trends</p>
            </div>
            <span className="text-xs text-gray-400 font-medium">YTD 2026</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="bookings" fill="#1a365d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Transit Corridors */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Top Routes by Volume</h2>
              <Link to="/admin/routes" className="text-xs text-primary font-semibold hover:underline">
                All Routes
              </Link>
            </div>
            <div className="space-y-3.5">
              {popularRoutes.map((r, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800">
                      {r.source} → {r.destination}
                    </span>
                    <span className="font-bold text-gray-900">{r.count} trips</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${r.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              to="/admin/schedules"
              className="w-full inline-flex items-center justify-center py-2 px-3 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Add Schedule to High-Volume Corridors
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Recent Passenger Transactions</h2>
            <p className="text-xs text-gray-500">Live booking feed across all channels</p>
          </div>
          <Link
            to="/admin/transactions"
            className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors flex items-center"
          >
            View All Ledger <ChevronRight size={14} className="ml-0.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-gray-50/70 text-gray-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Route Corridor</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {staticTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-primary">{tx.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{tx.customer}</td>
                  <td className="px-4 py-3 text-gray-600">{tx.route}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">₹{tx.amount}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={tx.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right text-gray-400">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;