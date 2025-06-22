import React from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { Check, Download, Bus, MapPin, Calendar, Clock, Users, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { getBookingDetails } from '../../apiConfig/Bus';
import { BookingDetails } from '../../data/types';

const BookingConfirmationPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = React.useState<BookingDetails | null>(null);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);


  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    };
    return new Date(timeString).toLocaleTimeString('en-US', options);
  };

  React.useEffect(() => {
    if (location.state?.bookingDetails) {
      setBookingDetails(location.state.bookingDetails);
      setLoading(false);
    } else if (bookingId) {
      // const bookingData = getBookingDetails(bookingId);
      // setBookingDetails(bookingData);
    } else {
      setError('No booking information available');
      setLoading(false);
    }
  }, [bookingId, location.state]);

  // const fetchBookingDetails = async (id: string) => {
  //   try {
  //     setLoading(true);
  //     const data = await getBookingDetails(id);
  //     console.log('Fetched booking details:', data);
  //     // Map API response to BookingDetails shape
  //     setBookingDetails({
  //       ...data,
  //       bus: {
  //         busName: data.busName,
  //         busNumber: data.busNumber,
  //         busType: data.busType,
  //         totalSeats: data.totalSeats,
  //         busAmenities: data.busAmenities,
  //         operatorName: data.operatorName,
  //       },
       
  //       route: {
  //       //   ...data.route,
  //       //   id: 0,
  //       //   sourceCity: data.route.source,
  //       //   destinationCity: data.route.destination,
  //       //   departureTime: data.route.departureTime,
  //       //   arrivalTime: data.route.arrivalTime,
  //       //   totalDistance: 100,
  //       //   totalDuration: "100km",
  //       //   stops: data.route.stops || [],
  //       // },
  //     });
  //   } catch (err) {
  //     console.error('Failed to fetch booking details:', err);
  //     setError('Failed to load booking details. Please try again later.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your booking details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button variant="primary" onClick={() => navigate(-1)} leftIcon={<ArrowLeft size={16} />}>
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Booking Not Found</h3>
            <p className="text-gray-600 mb-6">We couldn't find the booking you're looking for.</p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Go Back
              </Button>
              <Button variant="primary" onClick={() => navigate('/')}>
                Book a Trip
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Navbar />
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

          <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Booking ID: {bookingDetails.bookingCode}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Booked on {formatDate(bookingDetails.createdAt)} at {formatTime(bookingDetails.createdAt)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download size={16} />}
                  >
                    Download Ticket
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                  >
                    Print Ticket
                  </Button>
                </div>
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
                      {/* <p className="font-medium text-gray-900">{bookingDetails.bus.busName}</p>
                      <p className="text-sm text-gray-500">{bookingDetails.bus.busNumber}</p> */}
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
                        <p className="font-medium text-gray-900">{bookingDetails.route?.sourceCity}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">To</p>
                        <p className="font-medium text-gray-900">{bookingDetails.route?.destinationCity}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(bookingDetails.travelDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium text-gray-900">
                          {/* {formatTime(bookingDetails.route.departureTime)} - {formatTime(bookingDetails.route.arrivalTime)} */}
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
                          <p className="font-medium text-gray-900">{passenger.passengerName}</p>
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
                      <span className="text-gray-900">₹{bookingDetails.fareDetails?.baseFare}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500">Service Fee</span>
                      <span className="text-gray-900">₹{bookingDetails.fareDetails?.serviceFee}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500">Taxes & GST</span>
                      <span className="text-gray-900">₹{bookingDetails.fareDetails?.gstAmount}</span>
                    </div>
                    <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                      <span className="font-medium text-gray-900">Total Amount</span>
                      <span className="font-medium text-gray-900">₹{bookingDetails.fareDetails?.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-5 sm:px-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500">
                  Status: <span className={`font-medium ${bookingDetails.status === 'CONFIRMED' ? 'text-green-600' :
                      bookingDetails.status === 'CANCELLED' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                    {bookingDetails.status}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Link to="/bookings">
                    <Button variant="outline">View All Bookings</Button>
                  </Link>
                  <Link to="/">
                    <Button variant="primary">Book Another Trip</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2">Need Help?</h4>
            <p className="text-sm text-blue-700">
              Contact our customer support at support@busbooking.com or call +1 (555) 123-4567 for any assistance with your booking.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingConfirmationPage;