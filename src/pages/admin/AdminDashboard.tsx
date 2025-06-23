import React from 'react';
import { Ticket, BarChart2, UserCheck, DollarSign } from 'lucide-react';
import { mockBookingSummary, mockPopularRoutes } from '../../data/MockData';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const bookingChartData = [
  { month: 'Jan', bookings: 320 },
  { month: 'Feb', bookings: 410 },
  { month: 'Mar', bookings: 380 },
  { month: 'Apr', bookings: 450 },
  { month: 'May', bookings: 390 },
  { month: 'Jun', bookings: 470 }
];

const AdminDashboard: React.FC = () => {
  const summary = mockBookingSummary;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <SummaryCard
          title="Total Bookings"
          value={summary.totalBookings}
          change="12"
          positive={true}
          icon={<Ticket className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />}
          color="blue"
        />
        <SummaryCard
          title="Total Revenue"
          value={`₹${summary.totalRevenue.toLocaleString()}`}
          change="8"
          positive={true}
          icon={<DollarSign className="h-5 w-5 md:h-6 md:w-6 text-green-600" />}
          color="green"
        />
        <SummaryCard
          title="Cancelled Bookings"
          value={summary.cancelledBookings}
          change="3"
          positive={false}
          icon={<BarChart2 className="h-5 w-5 md:h-6 md:w-6 text-red-600" />}
          color="red"
        />
        <SummaryCard
          title="Active Users"
          value="3,587"
          change="18"
          positive={true}
          icon={<UserCheck className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />}
          color="purple"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Bookings Overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Routes */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Popular Routes</h2>
          <div className="space-y-3 md:space-y-4">
            {mockPopularRoutes.map((route, index) => (
              <RouteItem
                key={index}
                index={index}
                route={route}
                totalBookings={summary.totalBookings}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 mt-4 md:mt-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-lg font-semibold p-4 md:p-6">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <TableHeader>ID</TableHeader>
                  <TableHeader>Customer</TableHeader>
                  <TableHeader>Amount</TableHeader>
                  <TableHeader>Status</TableHeader>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item} className="hover:bg-gray-50">
                    <TableCell>
                      TR-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
                    </TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>
                      ₹{(Math.random() * 2000 + 500).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status="completed" />
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-lg font-semibold p-4 md:p-6">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <TableHeader>User</TableHeader>
                  <TableHeader>Role</TableHeader>
                  <TableHeader>Status</TableHeader>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0 rounded-full bg-gray-200"></div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">User Name</div>
                          <div className="text-sm text-gray-500">user{item}@example.com</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item % 3 === 0 ? 'Admin' : item % 3 === 1 ? 'Agent' : 'Customer'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status="active" />
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const SummaryCard = ({ title, value, change, positive, icon, color }: {
  title: string;
  value: string | number;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  color: string;
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm md:text-base text-gray-500">{title}</p>
          <h3 className="text-2xl md:text-3xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`rounded-full p-2 md:p-3 ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <p className={`${positive ? 'text-green-600' : 'text-red-600'} mt-2 md:mt-4 text-xs md:text-sm`}>
        {positive ? '↑' : '↓'} {change}% from last month
      </p>
    </div>
  );
};

const RouteItem = ({ index, route, totalBookings }: {
  index: number;
  route: { source: string; destination: string; count: number };
  totalBookings: number;
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-6 w-6 md:h-8 md:w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs md:text-sm">
          {index + 1}
        </div>
        <div className="ml-2 md:ml-3">
          <p className="text-xs md:text-sm font-medium">{route.source} to {route.destination}</p>
          <p className="text-xs text-gray-500">{route.count} bookings</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs md:text-sm font-medium text-gray-900">
          {Math.round((route.count / totalBookings) * 100)}%
        </div>
      </div>
    </div>
  );
};

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
    {children}
  </td>
);

const StatusBadge = ({ status }: { status: 'active' | 'completed' | 'inactive' }) => {
  const statusClasses = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    inactive: 'bg-gray-100 text-gray-800'
  };

  const statusText = {
    active: 'Active',
    completed: 'Completed',
    inactive: 'Inactive'
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
      {statusText[status]}
    </span>
  );
};

export default AdminDashboard;