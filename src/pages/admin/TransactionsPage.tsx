import React, { useState } from 'react';
import {
  CreditCard,
  Download,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Calendar,
  Building2,
  Smartphone,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import DataTable, { ColumnDef } from '../../components/ui/DataTable';
import toast from 'react-hot-toast';

interface TransactionRecord {
  id: string;
  bookingId: string;
  customer: string;
  email: string;
  phone: string;
  amount: number;
  baseFare: number;
  gst: number;
  serviceFee: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  paymentMethod: string;
  gatewayRef: string;
}

const initialTransactions: TransactionRecord[] = [
  {
    id: 'TR-1001',
    bookingId: 'BK-78901',
    customer: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    amount: 1850,
    baseFare: 1714,
    gst: 86,
    serviceFee: 50,
    status: 'completed',
    date: '2026-09-07',
    paymentMethod: 'UPI (Google Pay)',
    gatewayRef: 'pay_NzkjK1928Jk',
  },
  {
    id: 'TR-1002',
    bookingId: 'BK-78902',
    customer: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+91 98123 45678',
    amount: 1200,
    baseFare: 1095,
    gst: 55,
    serviceFee: 50,
    status: 'pending',
    date: '2026-09-07',
    paymentMethod: 'NetBanking (HDFC)',
    gatewayRef: 'pay_NzkjK1929Lp',
  },
  {
    id: 'TR-1003',
    bookingId: 'BK-78903',
    customer: 'Robert Johnson',
    email: 'robert.j@example.com',
    phone: '+91 97654 32109',
    amount: 850,
    baseFare: 762,
    gst: 38,
    serviceFee: 50,
    status: 'failed',
    date: '2026-09-06',
    paymentMethod: 'Card (Visa •••• 4242)',
    gatewayRef: 'pay_NzkjK1930Mn',
  },
  {
    id: 'TR-1004',
    bookingId: 'BK-78904',
    customer: 'Emily Davis',
    email: 'emily.d@example.com',
    phone: '+91 99887 76655',
    amount: 2100,
    baseFare: 1952,
    gst: 98,
    serviceFee: 50,
    status: 'refunded',
    date: '2026-09-05',
    paymentMethod: 'UPI (PhonePe)',
    gatewayRef: 'pay_NzkjK1931Zq',
  },
  {
    id: 'TR-1005',
    bookingId: 'BK-78905',
    customer: 'Suresh Kumar',
    email: 'suresh.k@example.com',
    phone: '+91 98450 99881',
    amount: 1450,
    baseFare: 1333,
    gst: 67,
    serviceFee: 50,
    status: 'completed',
    date: '2026-09-05',
    paymentMethod: 'UPI (Paytm)',
    gatewayRef: 'pay_NzkjK1932Ab',
  },
  {
    id: 'TR-1006',
    bookingId: 'BK-78906',
    customer: 'Meera Nair',
    email: 'meera.nair@example.com',
    phone: '+91 94470 12345',
    amount: 950,
    baseFare: 857,
    gst: 43,
    serviceFee: 50,
    status: 'completed',
    date: '2026-09-04',
    paymentMethod: 'Card (Mastercard •••• 8812)',
    gatewayRef: 'pay_NzkjK1933Cd',
  },
];

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>(initialTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  // Filter logic
  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      searchTerm === '' ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.gatewayRef.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;

    const txDate = new Date(tx.date);
    const matchesDate =
      (!dateRange.from || txDate >= new Date(dateRange.from)) &&
      (!dateRange.to || txDate <= new Date(dateRange.to));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleExportCSV = () => {
    const headers = [
      'Transaction ID',
      'Booking ID',
      'Customer',
      'Email',
      'Amount',
      'Status',
      'Date',
      'Payment Method',
      'Gateway Ref',
    ];

    const rows = filtered.map((tx) => [
      tx.id,
      tx.bookingId,
      `"${tx.customer}"`,
      tx.email,
      tx.amount,
      tx.status,
      tx.date,
      `"${tx.paymentMethod}"`,
      tx.gatewayRef,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bluebus_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filtered.length} transactions to CSV`);
  };

  const columns: ColumnDef<TransactionRecord>[] = [
    {
      key: 'id',
      header: 'Reference',
      sortable: true,
      render: (tx) => (
        <div>
          <span className="font-mono font-bold text-primary block">{tx.id}</span>
          <span className="text-[11px] text-gray-400 font-mono">{tx.bookingId}</span>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      render: (tx) => (
        <div>
          <span className="font-semibold text-gray-900 block text-sm">{tx.customer}</span>
          <span className="text-xs text-gray-500">{tx.email}</span>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (tx) => (
        <span className="font-bold text-gray-900 text-sm">₹{tx.amount.toLocaleString()}</span>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Payment Rail',
      render: (tx) => (
        <span className="inline-flex items-center gap-1 text-xs text-gray-700">
          <CreditCard size={13} className="text-gray-400" />
          {tx.paymentMethod}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (tx) => <StatusBadge status={tx.status} size="sm" />,
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (tx) => <span className="text-xs text-gray-500">{tx.date}</span>,
    },
    {
      key: 'actions',
      header: 'Audit',
      align: 'right',
      render: (tx) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedTx(tx)}
          className="h-8 w-8 p-0"
          title="Inspect transaction"
          aria-label="Inspect transaction"
        >
          <Eye size={16} className="text-primary" />
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            Financial Transactions Ledger
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Audit payments, gateway reconciliation logs, settlements, and refund claims.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleExportCSV}
          leftIcon={<Download size={16} />}
        >
          Export CSV
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        {['all', 'completed', 'pending', 'failed', 'refunded'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
              statusFilter === st
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <DataTable<TransactionRecord>
        data={filtered}
        columns={columns}
        totalRecords={filtered.length}
        page={currentPage}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={(sz) => {
          setItemsPerPage(sz);
          setCurrentPage(1);
        }}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by transaction ID, customer, email, or gateway ref..."
        keyExtractor={(tx) => tx.id}
        emptyMessage="No transactions match your filter"
        emptySubtext="Try resetting filters or adjusting date ranges."
      />

      {/* Transaction Inspection Modal */}
      <Modal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title={`Audit: ${selectedTx?.id}`}
        description="Comprehensive gateway settlement record and fare breakdown."
        size="md"
      >
        {selectedTx && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2.5">
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-500 font-medium">Gateway Reference:</span>
                <span className="font-mono font-bold text-gray-900">{selectedTx.gatewayRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Booking Code:</span>
                <span className="font-mono font-semibold text-primary">{selectedTx.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Customer:</span>
                <span className="font-bold text-gray-900">{selectedTx.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Contact:</span>
                <span className="text-gray-700">{selectedTx.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Channel:</span>
                <span className="font-semibold text-gray-800">{selectedTx.paymentMethod}</span>
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-2">
              <h4 className="font-bold text-gray-900 mb-2">Ledger Accounting Breakdown</h4>
              <div className="flex justify-between text-gray-600">
                <span>Base Fare</span>
                <span>₹{selectedTx.baseFare.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Platform Convenience Fee</span>
                <span>₹{selectedTx.serviceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (5%)</span>
                <span>₹{selectedTx.gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-100">
                <span>Gross Settlement</span>
                <span className="text-primary">₹{selectedTx.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedTx(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TransactionsPage;