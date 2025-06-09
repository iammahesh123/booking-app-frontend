export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' |  'ADMIN';
  profilePicture?: string;
}

export interface Bus {
  id?: number;
  busName?: string;
  busNumber?: string;
  busType: 'AC' | 'NON_AC' | 'SLEEPER' | 'SEMI_SLEEPER';
  totalSeats: number;
  busAmenities?: string[];
  operatorName: string;
}

export interface Stop {
  id?: number;
  stopName: string;
  arrivalTime: string;
  departureTime: string;
  distance: number; // Distance from start in km
}

export interface Route {
  id: number;
  sourceCity: string;
  destinationCity: string;
  totalDistance: number;
  totalDuration: string; 
  stopIds?: number[]; 
  stops?: Stop[];
  
}

export interface Schedule {
  id: number;
  busId: number;
  routeId: number;
  departureTime: string;
  arrivalTime: string;
  scheduleDate: string;
  totalSeats: number;
  farePrice: number;
  bus?: Bus;
  route?: Route;
  seats?: Seat[]; // Optional, can be fetched separately
}

export interface ApiScheduleResponse {
  id: number;
  busResponseDTO: Bus;
  routeResponseDTO: Route | null;
  scheduleDate: string;
  arrivalTime: string;
  departureTime: string;
  totalSeats: number;
  farePrice: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  createdBy: string;
}

export interface Seat {
  id: number;
  seatNumber: string;
  seatType: 'window' | 'aisle' | 'middle' | 'sleeper';
  seatStatus: 'AVAILABLE' | 'BOOKED' | 'SELECTED' | 'UNAVAILABLE';
  seatPrice: number;
}

export enum OrderBy {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface Booking {
  id: string;
  userId: string;
  scheduleId: string;
  number: string;
  bookedSeats: Seat[];
  passengers: Passenger[];
  totalFare: number;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  bookingCode: string;
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  seatNumber: string;
}

export interface PopularRoute {
  source: string;
  destination: string;
  count: number;
}

export interface BookingSummary {
  totalBookings: number;
  totalRevenue: number;
  cancelledBookings: number;
  upcomingBookings: number;
}