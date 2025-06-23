import React, { useState } from 'react';
import { Search, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const TransactionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Mock transaction data
  const transactions = [
    {
      id: 'TR-0001',
      bookingId: 'BK-0001',
      customer: 'John Doe',
      email: 'john@example.com',
      amount: 1850,
      status: 'completed',
      date: '2025-01-15',
      paymentMethod: 'Credit Card',
    },
    {
      id: 'TR-0002',
      bookingId: 'BK-0002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      amount: 1200,
      status: 'pending',
      date: '2025-01-16',
      paymentMethod: 'PayPal',
    },
    {
      id: 'TR-0003',
      bookingId: 'BK-0003',
      customer: 'Robert Johnson',
      email: 'robert@example.com',
      amount: 850,
      status: 'failed',
      date: '2025-01-17',
      paymentMethod: 'Bank Transfer',
    },
    {
      id: 'TR-0004',
      bookingId: 'BK-0004',
      customer: 'Emily Davis',
      email: 'emily@example.com',
      amount: 2100,
      status: 'refunded',
      date: '2025-01-18',
      paymentMethod: 'Credit Card',
    },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by search term
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by date range
    const transactionDate = new Date(transaction.date);
    const fromDate = dateRange.from ? new Date(dateRange.from) : null;
    const toDate = dateRange.to ? new Date(dateRange.to) : null;

    const matchesDateRange =
      (!fromDate || transactionDate >= fromDate) &&
      (!toDate || transactionDate <= toDate);

    return matchesSearch && matchesDateRange;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Transactions</h1>
          <p className="mt-1 sm:mt-2 text-sm text-gray-700">
            View and manage all payment transactions
          </p>
        </div>
        <div className="mt-3 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download size={18} />}
            onClick={() => {
              // Handle export functionality
            }}
            className="w-full sm:w-auto"
          >
            <span className="sr-only sm:not-sr-only">Export</span>
          </Button>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={18} />}
            fullWidth
            // size="sm"
          />
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Filter size={18} />}
            onClick={() => setShowFilters(!showFilters)}
            className="w-full sm:w-auto"
          >
            <span className="sr-only sm:not-sr-only">Filters</span>
          </Button>
        </div>

        {showFilters && (
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                type="date"
                label="From Date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                // size="sm"
              />
              <Input
                type="date"
                label="To Date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                // size="sm"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDateRange({ from: '', to: '' });
                  setShowFilters(false);
                }}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  // Apply filters
                  setShowFilters(false);
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        {/* Mobile view - Card layout */}
        <div className="sm:hidden space-y-3">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{transaction.customer}</h3>
                  <p className="text-sm text-gray-500">{transaction.email}</p>
                </div>
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(transaction.status)}`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Transaction ID</p>
                  <p className="font-medium">{transaction.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Booking ID</p>
                  <p className="font-medium">{transaction.bookingId}</p>
                </div>
                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-medium">₹{transaction.amount}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Payment Method</p>
                  <p className="font-medium">{transaction.paymentMethod}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop view - Table layout */}
        <div className="hidden sm:block">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                        Transaction ID
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                        Customer
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                        Amount
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                        Date
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                        Payment Method
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs sm:text-sm">
                          <div className="font-medium text-gray-900">{transaction.id}</div>
                          <div className="text-gray-500">{transaction.bookingId}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-xs sm:text-sm">
                          <div className="font-medium text-gray-900">{transaction.customer}</div>
                          <div className="text-gray-500">{transaction.email}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-xs sm:text-sm font-medium text-gray-900">
                          ₹{transaction.amount}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-xs sm:text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-xs sm:text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-xs sm:text-sm text-gray-500">
                          {transaction.paymentMethod}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 flex items-center justify-between">
        <div className="text-xs sm:text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTransactions.length}</span> of{' '}
          <span className="font-medium">{filteredTransactions.length}</span> results
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled leftIcon={<ChevronLeft size={16} />}>
            <span className="sr-only sm:not-sr-only">Previous</span>
          </Button>
          <Button variant="outline" size="sm" rightIcon={<ChevronRight size={16} />}>
            <span className="sr-only sm:not-sr-only">Next</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;