import { get, post } from '../../src/apiConfig/axios';

// Type definitions
interface PassengerData {
  passengerName: string;
  age: number;
  gender: string;
  seatNumber: string;
  busId: number;
}

interface BookingData {
  userId: string;
  bookingDate: string;
  totalPrice: number;
  bookingStatus: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  seatIds: number[];
  passengerIds: number[];
  busScheduleId: number;
}

interface BookingDetailsResponse {
  id: string;
  bookingCode: string;
  bus: {
    name: string;
    number: string;
  };
  route: {
    source: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
  };
  travelDate: string;
  seats: string[];
  passengers: Array<{
    name: string;
    age: number;
    gender: string;
    seatNumber: string;
  }>;
  fareDetails: {
    baseFare: number;
    serviceFee: number;
    gstAmount: number;
    totalAmount: number;
  };
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  createdAt: string;
}

/**
 * Create a new passenger record
 * @param passengerData Passenger details
 * @returns Created passenger record with ID
 */
export const createPassenger = async (passengerData: PassengerData) => {
  try {
    const response = await post('/bus-passenger', passengerData);
    return response.data;
  } catch (error) {
    console.error('Error creating passenger:', error);
    throw new Error('Failed to create passenger. Please try again.');
  }
};

/**
 * Create a new booking
 * @param bookingData Booking details
 * @returns Created booking record
 */
export const createBooking = async (bookingData: BookingData) => {
  try {
    const response = await post('/bus-booking', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Failed to complete booking. Please try again.');
  }
};

/**
 * Fetch booking details by ID
 * @param bookingId Booking ID to fetch
 * @returns Detailed booking information
 */
export const getBookingDetails = async (bookingId: string) => {
  try {
    const response = await get(`/bus-booking/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw new Error('Failed to load booking details. Please try again later.');
  }
};

/**
 * Cancel an existing booking
 * @param bookingId Booking ID to cancel
 * @returns Updated booking status
 */
export const cancelBooking = async (bookingId: string) => {
  try {
    const response = await post(`/bus-booking/${bookingId}/cancel`, {});
    return response.data;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw new Error('Failed to cancel booking. Please try again or contact support.');
  }
};

/**
 * Get all bookings for a user
 * @param userId User ID to fetch bookings for
 * @returns Array of user's bookings
 */
export const getUserBookings = async (userId: string) => {
  try {
    const response = await get(`/bus-booking/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw new Error('Failed to load your bookings. Please try again later.');
  }
};

// Utility function to generate mock booking data (for development/testing)
export const generateMockBooking = (): BookingDetailsResponse => {
  return {
    id: 'mock-' + Math.random().toString(36).substring(2, 9),
    bookingCode: 'BK' + Math.floor(100000 + Math.random() * 900000),
    bus: {
      name: ['Royal Cruiser', 'Luxury Express', 'City Travels', 'Green Line'][Math.floor(Math.random() * 4)],
      number: ['KA-01', 'MH-02', 'TN-03', 'DL-04'][Math.floor(Math.random() * 4)] + '-F-' + Math.floor(1000 + Math.random() * 9000),
    },
    route: {
      source: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai'][Math.floor(Math.random() * 4)],
      destination: ['Jaipur', 'Pune', 'Hyderabad', 'Kochi'][Math.floor(Math.random() * 4)],
      departureTime: '08:00',
      arrivalTime: '20:00',
    },
    travelDate: new Date(Date.now() + 86400000 * (Math.floor(Math.random() * 30) + 1)).toISOString(),
    seats: ['1A', '2B'],
    passengers: [
      {
        name: 'John Doe',
        age: 35,
        gender: 'male',
        seatNumber: '1A',
      },
      {
        name: 'Jane Doe',
        age: 32,
        gender: 'female',
        seatNumber: '2B',
      },
    ],
    fareDetails: {
      baseFare: 3000,
      serviceFee: 50,
      gstAmount: 150,
      totalAmount: 3200,
    },
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  };
};