import React from 'react';

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
  name: string;
  busNumber: string;
  busType: 'AC' | 'Non-AC' | 'Sleeper' | 'Semi-Sleeper';
  totalSeats: number;
  amenities: string[];
  operator: string;
}

export interface Stop {
  name: string;
  arrivalTime: string;
  departureTime: string;
  distance: number; // Distance from start in km
}

export interface Route {
  id: string;
  source: string;
  destination: string;
  stops: Stop[];
  distance: number;
  duration: string; // in the format "5h 30m"
}

export interface Schedule {
  id: string;
  busId: string;
  routeId: string;
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