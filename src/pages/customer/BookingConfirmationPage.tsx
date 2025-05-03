import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Download, Bus, MapPin, Calendar, Clock, Users } from 'lucide-react';
import Button from '../../components/ui/Button';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const BookingConfirmationPage: React.FC = () => {
  // const {  } = useParams();

  // In a real app, you would fetch booking details using the bookingId
  const bookingDetails = {
    bookingCode: 'BK123456',
    busName: 'Royal Cruiser',
    busNumber: 'KA-01-F-7777',
    source: 'Delhi',
    destination: 'Mumbai',
    date: '2025-01-15',
    departureTime: '21:00',
    arrivalTime: '15:30',
    seats: ['1A', '1B'],
    passengers: [
      { name: 'John Doe', age: 35, gender: 'male', seatNumber: '1A' },
      { name: 'Jane Doe', age: 32, gender: 'female', seatNumber: '1B' }
    ],
    totalAmount: 3650,
    status: 'confirmed'
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
          <p className="mt-2 text-gray-600">
            Your booking has been confirmed and tickets have been sent to your email.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Booking ID: {bookingDetails.bookingCode}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Please save this booking ID for future reference
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download size={16} />}
              >
                Download Ticket
              </Button>
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {/* Bus Details */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-4">Bus Details</h4>
                <div className="flex items-start space-x-3">
                  <Bus className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{bookingDetails.busName}</p>
                    <p className="text-sm text-gray-500">{bookingDetails.busNumber}</p>
                  </div>
                </div>
              </div>

              {/* Journey Details */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-4">Journey Details</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-medium text-gray-900">{bookingDetails.source}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">To</p>
                      <p className="font-medium text-gray-900">{bookingDetails.destination}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(bookingDetails.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium text-gray-900">
                        {bookingDetails.departureTime} - {bookingDetails.arrivalTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passenger Details */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-4">Passenger Details</h4>
                <div className="space-y-4">
                  {bookingDetails.passengers.map((passenger, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{passenger.name}</p>
                        <p className="text-sm text-gray-500">
                          {passenger.age} years • {passenger.gender} • Seat {passenger.seatNumber}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-4">Payment Details</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Base Fare</span>
                    <span className="text-gray-900">₹{bookingDetails.totalAmount - 200}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Service Fee</span>
                    <span className="text-gray-900">₹50</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">GST (5%)</span>
                    <span className="text-gray-900">₹150</span>
                  </div>
                  <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                    <span className="font-medium text-gray-900">Total Amount</span>
                    <span className="font-medium text-gray-900">₹{bookingDetails.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <Link
                to="/bookings"
                className="text-primary hover:text-primary-dark font-medium"
              >
                View All Bookings
              </Link>
              <Link to="/">
                <Button variant="primary">Book Another Trip</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default BookingConfirmationPage;