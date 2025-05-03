import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockBookings } from '../../components/utils/MockData';
import { X, Eye, AlertTriangle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import CustomerLayout from '../../components/layout/CustomerLayout';

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState(mockBookings);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const handleCancelBooking = (bookingId: string) => {
    setSelectedBooking(bookingId);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = () => {
    if (selectedBooking) {
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === selectedBooking
            ? { ...booking, status: 'cancelled', paymentStatus: 'refunded' }
            : booking
        )
      );
      setShowCancelModal(false);
      setSelectedBooking(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <CustomerLayout>
      <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">My Bookings</h1>
              <p className="mt-2 text-sm text-gray-700">
                View and manage all your bus bookings
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Booking ID
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Journey Details
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Date
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Amount
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {booking.bookingCode}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            Delhi to Mumbai
                            <br />
                            <span className="text-xs text-gray-400">
                              {booking.passengers.length} passenger(s)
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            ₹{booking.totalFare}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end gap-2">
                              <Link
                                to={`/booking/confirmation/${booking.id}`}
                                className="text-primary hover:text-primary-dark"
                              >
                                <Eye className="h-5 w-5" />
                              </Link>
                              {booking.status !== 'cancelled' && (
                                <button
                                  onClick={() => handleCancelBooking(booking.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              )}
                            </div>
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

        {/* Cancel Booking Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-center mb-2">Cancel Booking</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelModal(false)}
                >
                  No, Keep it
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmCancelBooking}
                >
                  Yes, Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default MyBookingsPage;