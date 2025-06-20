import axios from 'axios';
import { ApiScheduleResponse, Bus, OrderBy, Route, Schedule, ScheduleDuration, Seat, SeatStatus, SeatType } from '../types';

const API_BASE_URL = 'https://bus-booking-svc-latest.onrender.com';

// Configure axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const busApi = {

  // Get all buses
  getAll: async () => {
    try {
      const response = await api.get('/bus');
      return response.data;
    } catch (error) {
      console.error('Error fetching buses:', error);
      throw error;
    }
  },

  // Add a new bus
  create: async (busData: any) => {
    try {
      const response = await api.post('/bus', busData);
      return response.data;
    } catch (error) {
      console.error('Error creating bus:', error);
      throw error;
    }
  },

  // Update a bus
  update: async (id: number, busData: any) => {
    try {
      const response = await api.put(`/bus/${id}`, busData);
      return response.data;
    } catch (error) {
      console.error('Error updating bus:', error);
      throw error;
    }
  },

  // Delete a bus
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/bus/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting bus:', error);
      throw error;
    }
  },
};

export const fetchSchedules = async (
  source: string,
  destination: string,
  date: string
): Promise<Schedule[]> => {
  try {
    const response = await api.get<ApiScheduleResponse[]>('/bus-schedule/fetch-schedules', {
      params: { source, destination, date }
    });

    return response.data.map(apiSchedule => ({
      id: apiSchedule.id,
      busId: apiSchedule.busResponseDTO.id,
      routeId: apiSchedule.routeResponseDTO?.id || 0,
      departureTime: apiSchedule.departureTime,
      arrivalTime: apiSchedule.arrivalTime,
      scheduleDate: apiSchedule.scheduleDate,
      totalSeats: apiSchedule.totalSeats,
      farePrice: apiSchedule.farePrice,
      bus: apiSchedule.busResponseDTO,
      route: apiSchedule.routeResponseDTO || undefined,
      automationDuration: apiSchedule.automationDuration,
      isMasterRecord: apiSchedule.isMasterRecord ?? false
    }));
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return [];
  }
};



export const fetchBuses = async (): Promise<Bus[]> => {
  try {
    const response = await api.get('/bus');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching buses:', error);
    return [];
  }
};

// export const fetchRoutes = async (): Promise<Route[]> => {
//   const response = await api.get(`/bus-route`);
//   return response.data.data;
// };


export const registerUser = async (userData: {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}) => {
  const response = await api.post('/auth-user/register', userData);
  return response.data;
};


export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth-user/login`, credentials);

    return {
      id: response.data.id,
      username: response.data.username,
      email: response.data.email,
      role: response.data.role,
      phoneNumber: response.data.phoneNumber,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Handle specific error statuses
        if (error.response.status === 401) {
          throw new Error('Invalid email or password');
        }
        if (error.response.status === 403) {
          throw new Error('Account not verified');
        }
        throw new Error(error.response.data.message || 'Login failed');
      }
    }
    throw new Error('Network error. Please try again.');
  }
};


export const fetchCities = async (): Promise<string[]> => {
  const response = await api.get(`/bus-route/cities`);
  return response.data;
};

// In apiConfig/Bus.ts
export const fetchSeats = async (scheduleId: number): Promise<Seat[]> => {
  try {
    const response = await api.get(`/bus-seats/view-seats/${scheduleId}`);
    return response.data.map((seat: any) => ({
      id: seat.id,
      seatNumber: seat.seatNumber,
      seatType: seat.seatType as SeatType, 
      seatStatus: seat.seatStatus as SeatStatus, 
      seatPrice: seat.seatPrice,
      scheduleId: seat.scheduleId,
      createdAt: seat.createdAt,
      updatedAt: seat.updatedAt,
      updatedBy: seat.updatedBy,
      createdBy: seat.createdBy
    }));
  } catch (error) {
    console.error('Error fetching seats:', error);
    return [];
  }
};


export const fetchAllSchedules = async (): Promise<Schedule[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bus-schedule`);
    if (!response.ok) throw new Error('Failed to fetch schedules');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return [];
  }
};

export const fetchAllBuses = async (): Promise<Bus[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bus`);
    if (!response.ok) throw new Error('Failed to fetch buses');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching buses:', error);
    return [];
  }
};

export const fetchAllRoutes = async (): Promise<Route[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bus-route`);
    if (!response.ok) throw new Error('Failed to fetch routes');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching routes:', error);
    return [];
  }
};

export const fetchSeatsForSchedule = async (scheduleId: number): Promise<Seat[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bus-seats/view-seats/${scheduleId}`);
    if (!response.ok) throw new Error('Failed to fetch seats');
    return await response.json();
  } catch (error) {
    console.error('Error fetching seats:', error);
    return [];
  }
};

// Type definitions
interface PassengerData {
  passengerName: string;
  age: number;
  gender: string;
  seatNumber: string;
  busId: number;
}

export enum BookingStatus {
  CONFIRMED = "CONFIRMED",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED"
}

export enum PaymentStatus {
  PAID = "PAID",
  PENDING = "PENDING",
  FAILED = "FAILED"
}

interface BookingData {
  userId: string;
  bookingDate: string;
  totalPrice: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  seatIds: number[];
  passengerIds: number[];
  busScheduleId: number;
}

/**
 * Create a new passenger record
 * @param passengerData Passenger details
 * @returns Created passenger record with ID
 */
export const createPassenger = async (passengerData: PassengerData) => {
  try {
    const response = await api.post('/bus-passenger', passengerData);
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
    const response = await api.post('/bus-booking', {
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
interface Passenger {
  passengerName: string;
  age: number;
  gender: string;
  seatNumber: string;
}

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
    const response = await api.get(`/bus-booking/${bookingId}`);
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
    const response = await api.post(`/bus-booking/${bookingId}/cancel`, {});
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
    const response = await api.get(`/bus-booking/user/${userId}`);
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

export const fetchRoutes = async (
  pageNumber: number,
  pageSize: number,
  sortColumn: string,
  orderBy: OrderBy
): Promise<{ data: Route[]; totalPages: number; totalRecords: number }> => {
  try {
    const response = await api.get('/bus-route', {
      params: {
        pageNumber,
        pageSize,
        sortColumn,
        orderBy
      }
    });
    return {
      data: response.data.data || [],
      totalPages: response.data.totalPages || 1,
      totalRecords: response.data.totalRecords || 0
    };
  } catch (error) {
    console.error('Error fetching routes:', error);
    return {
      data: [],
      totalPages: 1,
      totalRecords: 0
    };
  }
};

export const createRoute = async (routeData: {
  sourceCity: string;
  destinationCity: string;
  totalDistance: number;
  totalDuration: string;
  stopIds: number[];
}): Promise<Route> => {
  try {
    const response = await api.post('/bus-route', routeData);
    return response.data;
  } catch (error) {
    console.error('Error creating route:', error);
    throw new Error('Failed to create route');
  }
};

export const updateRoute = async (
  routeId: number,
  routeData: {
    sourceCity: string;
    destinationCity: string;
    totalDistance: number;
    totalDuration: string;
    stopIds: number[];
  }
): Promise<Route> => {
  try {
    const response = await api.put(`/bus-route/${routeId}`, routeData);
    return response.data;
  } catch (error) {
    console.error('Error updating route:', error);
    throw new Error('Failed to update route');
  }
};

export const deleteRoute = async (routeId: number): Promise<void> => {
  try {
    await api.delete(`/bus-route/${routeId}`);
  } catch (error) {
    console.error('Error deleting route:', error);
    throw new Error('Failed to delete route');
  }
};

// Stop-related API calls
export const createStop = async (stopData: {
  stopName: string;
  arrivalTime: string;
  departureTime: string;
  distance: number;
}): Promise<{ id: number }> => {
  try {
    const response = await api.post('/bus-stop', stopData);
    return response.data;
  } catch (error) {
    console.error('Error creating stop:', error);
    throw new Error('Failed to create stop');
  }
};

export const updateStop = async (
  stopId: number,
  stopData: {
    stopName: string;
    arrivalTime: string;
    departureTime: string;
    distance: number;
  }
): Promise<{ id: number }> => {
  try {
    const response = await api.put(`/bus-stop/${stopId}`, stopData);
    return response.data;
  } catch (error) {
    console.error('Error updating stop:', error);
    throw new Error('Failed to update stop');
  }
};


export const scheduleApi = {
  // Get all schedules with pagination and sorting
  getSchedules: (params: {
    pageNumber: number;
    pageSize: number;
    sortColumn?: string;
    orderBY?: OrderBy;
  }) => api.get('/bus-schedule', { params }),

  // Get a single schedule by ID
  getSchedule: (id: number) => api.get(`/bus-schedule/${id}`),


  // Create a new schedule
  createSchedule: (data: {
    busId: number;
    routeId: number;
    departureTime: string;
    arrivalTime: string;
    scheduleDate: string;
    totalSeats: number;
    farePrice: number;
    automationDuration: ScheduleDuration;
    isMasterRecord: boolean;
  }) => api.post('/bus-schedule', data),

  // Update an existing schedule
  updateSchedule: (id: number, data: {
    busId: number;
    routeId: number;
    departureTime: string;
    arrivalTime: string;
    scheduleDate: string;
    totalSeats: number;
    farePrice: number;
    automationDuration: ScheduleDuration;
    isMasterRecord: boolean;
  }) => api.put(`/bus-schedule/${id}`, data),

  // Delete a schedule
  deleteSchedule: (id: number) => api.delete(`/bus-schedule/${id}`),
};

// Route related APIs
export const routeApi = {
  getAllRoutes: () => api.get('/bus-route'),
  getRoute: (id: number) => api.get(`/bus-route/${id}`),
};

export default api;

