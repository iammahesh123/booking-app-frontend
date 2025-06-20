import React, { useState } from 'react';
import { Search, Download, Filter } from 'lucide-react';
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
  
  ];

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
    <div className="p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage all payment transactions
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button
            variant="outline"
            leftIcon={<Download size={20} />}
            onClick={() => {
              // Handle export functionality
            }}
          >
            Export
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={20} />}
            fullWidth
          />
          <Button
            variant="outline"
            leftIcon={<Filter size={20} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                label="From Date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              />
              <Input
                type="date"
                label="To Date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDateRange({ from: '', to: '' });
                  setShowFilters(false);
                }}
              >
                Reset
              </Button>
              <Button
                variant="primary"
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

      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Transaction ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Customer
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Payment Method
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                        <div className="font-medium text-gray-900">{transaction.id}</div>
                        <div className="text-gray-500">{transaction.bookingId}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div className="font-medium text-gray-900">{transaction.customer}</div>
                        <div className="text-gray-500">{transaction.email}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                        ₹{transaction.amount}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
          <span className="font-medium">20</span> results
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <Button variant="outline">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;