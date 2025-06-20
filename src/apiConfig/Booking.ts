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

// interface BookingDetailsResponse {
//   id: number;  
//   bookingNumber: string;  
//   bus: {
//     name: string;
//     number: string;
//   };
//   route: {
//     source: string;
//     destination: string;
//     departureTime: string;
//     arrivalTime: string;
//   };
//   travelDate: string;
//   seats: string[];
//   passengers: Array<{
//     name: string;
//     age: number;
//     gender: string;
//     seatNumber: string;
//   }>;
//   fareDetails: {
//     baseFare: number;
//     serviceFee: number;
//     gstAmount: number;
//     totalAmount: number;
//   };
//   status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
//   createdAt: string;
// }

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
    const response = await post('/bus-booking', {
      ...bookingData,
      bookingDate: new Date(bookingData.bookingDate).toISOString()
    });
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
// Add type for seat and passenger
interface Seat {
  seatNumber: string;
}

interface Passenger {
  passengerName: string;
  age: number;
  gender: string;
  seatNumber: string;
}

// Add type for booking response
interface BookingResponse {
  id: number;
  bookingNumber: string;
  busSchedule?: {
    bus?: { name: string; number: string };
    source?: string;
    destination?: string;
    departureTime?: string;
    arrivalTime?: string;
    travelDate?: string;
  };
  seats?: Seat[];
  passengers?: Passenger[];
  totalPrice: number;
  bookingStatus: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  createdAt: string;
}

export const getBookingDetails = async (bookingId: string) => {
  try {
    const response = await get(`/bus-booking/${bookingId}`);
    // Transform backend response to match frontend interface
    const booking = response.data as BookingResponse;
    return {
      id: booking.id,
      bookingCode: booking.bookingNumber,
      bus: booking.busSchedule?.bus || { name: '', number: '' },
      route: {
        source: booking.busSchedule?.source || '',
        destination: booking.busSchedule?.destination || '',
        departureTime: booking.busSchedule?.departureTime || '',
        arrivalTime: booking.busSchedule?.arrivalTime || ''
      },
      travelDate: booking.busSchedule?.travelDate || '',
      seats: booking.seats?.map((seat: Seat) => seat.seatNumber) || [],
      passengers: booking.passengers?.map((passenger: Passenger) => ({
        name: passenger.passengerName,
        age: passenger.age,
        gender: passenger.gender,
        seatNumber: passenger.seatNumber
      })) || [],
      fareDetails: {
        baseFare: booking.totalPrice * 0.8, // Example calculation
        serviceFee: booking.totalPrice * 0.1,
        gstAmount: booking.totalPrice * 0.1,
        totalAmount: booking.totalPrice
      },
      status: booking.bookingStatus,
      createdAt: booking.createdAt
    };
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
interface UserBooking {
  id: number;
  bookingNumber: string;
  busSchedule?: {
    bus?: { name: string; number: string };
    source?: string;
    destination?: string;
    departureTime?: string;
    arrivalTime?: string;
    travelDate?: string;
  };
  bookingStatus: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  createdAt: string;
}

export const getUserBookings = async (userId: string) => {
  try {
    const response = await get(`/bus-booking/user/${userId}`);
    const bookings = response.data as UserBooking[];
    return bookings.map((booking: UserBooking) => ({
      id: booking.id,
      bookingCode: booking.bookingNumber,
      bus: booking.busSchedule?.bus || { name: '', number: '' },
      route: {
        source: booking.busSchedule?.source || '',
        destination: booking.busSchedule?.destination || '',
        departureTime: booking.busSchedule?.departureTime || '',
        arrivalTime: booking.busSchedule?.arrivalTime || ''
      },
      travelDate: booking.busSchedule?.travelDate || '',
      status: booking.bookingStatus,
      createdAt: booking.createdAt
    }));
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw new Error('Failed to load your bookings. Please try again later.');
  }
};