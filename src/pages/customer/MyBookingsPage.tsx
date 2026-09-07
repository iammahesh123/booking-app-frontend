import React, { useState, useEffect, useMemo } from 'react';
import { Eye, Ban, ArrowRight, Calendar, Ticket, MapPin, Users } from 'lucide-react';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { Link, useNavigate } from 'react-router-dom';
import CustomerLayout from '../../components/layout/CustomerLayout';
import toast from 'react-hot-toast';

interface BookingItem {
  id: string;
  bookingCode: string;
  sourceCity: string;
  destinationCity: string;
  bookingDate: string;
  departureTime?: string;
  busName?: string;
  busNumber?: string;
  totalFare: number;
  status: 'confirmed' | 'cancelled' | 'pending';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  passengers: Array<{ name: string; age?: number; gender?: string }>;
  selectedSeats?: string[];
}

const DEFAULT_MOCK_BOOKINGS: BookingItem[] = [
  {
    id: 'bb-101',
    bookingCode: 'BB-982142',
    sourceCity: 'Mumbai',
    destinationCity: 'Pune',
    bookingDate: '2026-09-15',
    departureTime: '06:30 AM',
    busName: 'Royal Cruiser (Scania Multi-Axle AC)',
    busNumber: 'MH-12-BB-7777',
    totalFare: 1150,
    status: 'confirmed',
    paymentStatus: 'paid',
    passengers: [{ name: 'Aditi Sharma', age: 28, gender: 'Female' }],
    selectedSeats: ['3A', '3B'],
  },
  {
    id: 'bb-102',
    bookingCode: 'BB-552910',
    sourceCity: 'Bangalore',
    destinationCity: 'Hyderabad',
    bookingDate: '2026-09-20',
    departureTime: '09:00 PM',
    busName: 'Night Rider Sleeper AC',
    busNumber: 'KA-01-F-9999',
    totalFare: 2400,
    status: 'confirmed',
    paymentStatus: 'paid',
    passengers: [
      { name: 'Rahul Verma', age: 31, gender: 'Male' },
      { name: 'Sneha Verma', age: 29, gender: 'Female' },
    ],
    selectedSeats: ['L1', 'L2'],
  },
  {
    id: 'bb-103',
    bookingCode: 'BB-109283',
    sourceCity: 'Delhi',
    destinationCity: 'Jaipur',
    bookingDate: '2026-08-28',
    departureTime: '07:15 AM',
    busName: 'City Express Volvo 9600',
    busNumber: 'DL-01-AB-1234',
    totalFare: 850,
    status: 'cancelled',
    paymentStatus: 'refunded',
    passengers: [{ name: 'Aditi Sharma', age: 28, gender: 'Female' }],
    selectedSeats: ['4C'],
  },
];

const MyBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bluebus_user_bookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge stored with defaults to ensure variety
          const storedIds = new Set(parsed.map((p: any) => p.id));
          const merged = [...parsed, ...DEFAULT_MOCK_BOOKINGS.filter(d => !storedIds.has(d.id))];
          setBookings(merged);
          return;
        }
      }
    } catch (e) {
      console.warn('Error reading stored bookings:', e);
    }
    setBookings(DEFAULT_MOCK_BOOKINGS);
  }, []);

  const handleConfirmCancel = () => {
    if (!cancelTargetId) return;

    setBookings(prev =>
      prev.map(b =>
        b.id === cancelTargetId
          ? { ...b, status: 'cancelled', paymentStatus: 'refunded' }
          : b
      )
    );

    // Also update localStorage
    try {
      const stored = localStorage.getItem('bluebus_user_bookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        const updated = parsed.map((b: any) =>
          b.id === cancelTargetId
            ? { ...b, status: 'cancelled', paymentStatus: 'refunded' }
            : b
        );
        localStorage.setItem('bluebus_user_bookings', JSON.stringify(updated));
      }
    } catch (err) {
      console.warn('Failed to update localStorage cancel status', err);
    }

    toast.success('Booking cancelled successfully. Refund initiated.');
    setCancelTargetId(null);
  };

  const filteredBookings = useMemo(() => {
    if (filterStatus === 'ALL') return bookings;
    if (filterStatus === 'CONFIRMED') return bookings.filter(b => b.status === 'confirmed');
    return bookings.filter(b => b.status === 'cancelled');
  }, [bookings, filterStatus]);

  const counts = useMemo(() => ({
    all: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }), [bookings]);

  return (
    <CustomerLayout>
      <div className="bg-gray-50/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">My Trips & Bookings</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage upcoming bus tickets, check status, or cancel reserved seats.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => navigate('/')}
              leftIcon={<Ticket size={16} />}
            >
              Book New Ticket
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
            {[
              { id: 'ALL', label: 'All Trips', count: counts.all },
              { id: 'CONFIRMED', label: 'Confirmed', count: counts.confirmed },
              { id: 'CANCELLED', label: 'Cancelled', count: counts.cancelled },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  filterStatus === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    filterStatus === tab.id ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-primary flex items-center justify-center mb-4">
                <Ticket size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No bookings found</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-6">
                You do not have any {filterStatus !== 'ALL' ? filterStatus.toLowerCase() : ''} bookings registered right now.
              </p>
              <Button variant="primary" onClick={() => navigate('/')}>
                Browse Routes & Buses
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                          {booking.bookingCode}
                        </span>
                        <StatusBadge
                          status={booking.status === 'confirmed' ? 'confirmed' : 'cancelled'}
                        />
                        {booking.paymentStatus === 'refunded' && (
                          <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                            Refund Processed
                          </span>
                        )}
                      </div>
                      <div className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span>{booking.sourceCity}</span>
                        <ArrowRight size={18} className="text-primary" />
                        <span>{booking.destinationCity}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {booking.busName || 'Express Intercity'} • {booking.busNumber || 'Fleet Vehicle'}
                      </p>
                    </div>

                    <div className="text-left lg:text-right">
                      <div className="text-2xl font-black text-gray-900">₹{booking.totalFare}</div>
                      <div className="text-xs text-gray-500">Total Fare (Inclusive of taxes)</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 text-sm text-gray-600 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <div>
                        <span className="text-xs text-gray-400 block">Journey Date</span>
                        <span className="font-medium text-gray-800">{booking.bookingDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      <div>
                        <span className="text-xs text-gray-400 block">Passengers</span>
                        <span className="font-medium text-gray-800">
                          {booking.passengers?.length || 1} Person(s)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Ticket size={16} className="text-gray-400" />
                      <div>
                        <span className="text-xs text-gray-400 block">Seat Numbers</span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {booking.selectedSeats && booking.selectedSeats.length > 0 ? (
                            booking.selectedSeats.map(seat => (
                              <span
                                key={seat}
                                className="px-1.5 py-0.5 text-xs font-mono font-bold bg-blue-50 text-primary rounded border border-blue-200"
                              >
                                {seat}
                              </span>
                            ))
                          ) : (
                            <span className="font-medium text-gray-800">Confirmed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                    <div className="text-xs text-gray-500">
                      Primary Passenger: <strong className="text-gray-700">{booking.passengers?.[0]?.name || 'Traveler'}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      {booking.status === 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => setCancelTargetId(booking.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                        >
                          <Ban size={14} />
                          Cancel Ticket
                        </button>
                      )}

                      <Link
                        to={`/booking/confirmation/${booking.id}`}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-primary hover:text-white hover:bg-primary rounded-lg border border-primary transition-all"
                      >
                        <Eye size={14} />
                        View / Print Ticket
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cancellation Confirmation Dialog */}
        <ConfirmDialog
          isOpen={!!cancelTargetId}
          title="Cancel Bus Booking"
          message="Are you sure you want to cancel this booking? A 100% refund will be credited back to your original payment method within 3 to 5 business days."
          confirmText="Yes, Cancel Booking"
          variant="danger"
          onConfirm={handleConfirmCancel}
          onClose={() => setCancelTargetId(null)}
        />
      </div>
    </CustomerLayout>
  );
};

export default MyBookingsPage;