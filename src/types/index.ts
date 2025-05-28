

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'agent' | 'admin';
  profilePicture?: string;
}

export interface Bus {
  id: string;
  busName?: string;
  busNumber?: string;
  busType: 'AC' | 'Non-AC' | 'Sleeper' | 'Semi-Sleeper';
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
  date: string;
  availableSeats: number;
  fare: number;
}

export interface Seat {
  id: string;
  number: string;
  type: 'window' | 'aisle' | 'middle' | 'sleeper';
  status: 'available' | 'booked' | 'selected' | 'unavailable';
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  scheduleId: string;
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