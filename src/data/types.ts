export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
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

export enum ScheduleDuration {
  ONE_MONTH = 'ONE_MONTH',
  TWO_MONTHS = 'TWO_MONTHS',
  THREE_MONTHS = 'THREE_MONTHS',
  FOUR_MONTHS = 'FOUR_MONTHS'
}

// Update your types.ts to include these new types
export interface Schedule {
  id: number;
  busId: number;
  routeId: number;
  departureTime: string;
  arrivalTime: string;
  scheduleDate: string;
  totalSeats: number;
  farePrice: number;
  automationDuration: ScheduleDuration;
  seats?: Seat[];
  isMasterRecord: boolean;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string;
  createdBy?: string;
};

export interface ApiScheduleResponse {
  id: number;
  busResponseDTO: Bus;
  routeResponseDTO: Route | null;
  scheduleDate: string;
  arrivalTime: string;
  departureTime: string;
  automationDuration: ScheduleDuration;
  isMasterRecord: boolean;
  totalSeats: number;
  farePrice: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  createdBy: string;
}

export enum SeatType {
  WINDOW = 'WINDOW',
  AISLE = 'AISLE',
  MIDDLE = 'MIDDLE',
  SLEEPER = 'SLEEPER'
}

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  BLOCKED = 'BLOCKED',
  SELECTED = 'SELECTED',
  UNAVAILABLE = 'UNAVAILABLE'
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

// types.ts (or wherever you define your interfaces)
export interface Seat {
  id: number;
  seatNumber: string;
  seatType: 'LOWER' | 'UPPER' | 'SLEEPER' | 'SEATER'; // Adjust based on your SeatType enum
  seatStatus: 'AVAILABLE' | 'BOOKED' | 'BLOCKED'; // Adjust based on your SeatStatus enum
  seatPrice: number;
}

export interface Passenger {
  id: number;
  passengerName: string;
  age: number;
  gender: string;
  seatNumber: string;
}

export interface BusBooking {
  id: number;
  userId: string;
  bookingDate: string;
  totalPrice: number;
  bookingStatus: 'CONFIRMED' | 'PENDING' | 'CANCELLED'; 
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED'; 
  seats: Seat[];
  passengers: Passenger[];
  createdAt: string;
  updatedAt: string;
  busScheduleId: number;
}

export interface BookingDetails {
  id: number;
  bookingCode: string;
  bus: {
    busName: string;
    busNumber: string;
    busType: 'AC' | 'NON_AC' | 'SLEEPER' | 'SEMI_SLEEPER' | string;
    totalSeats: number;
    busAmenities: string[];
    operatorName: string;
  };
  route: {
    id: number;
    sourceCity: string;
    destinationCity: string;
    totalDistance: number;
    totalDuration: string;
    departureTime: string;
    arrivalTime: string;
    stops: Stop[];
  };
  travelDate: string;
  seats: string[];
  passengers: Passenger[];
  fareDetails: {
    baseFare: number;
    serviceFee: number;
    gstAmount: number;
    totalAmount: number;
  };
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  createdAt: string;
}


// types.ts (or wherever you define your interfaces)
export interface SeatDTO {
  id: number;
  seatNumber: string;
  seatType: 'LOWER' | 'UPPER' | 'SLEEPER' | 'SEATER'; // Adjust based on your SeatType enum
  seatStatus: 'AVAILABLE' | 'BOOKED' | 'BLOCKED'; // Adjust based on your SeatStatus enum
  seatPrice: number;
  scheduleId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PassengerDTO {
  id: number;
  passengerName: string;
  age: number;
  gender: string;
  seatNumber: string;
  busId: number;
}

export interface BookingResponse {
  id: number;
  userId: string;
  bookingDate: string;
  totalPrice: number;
  bookingStatus: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  seatDTOS: Array<{
    id: number;
    seatNumber: string;
    seatType: string;
    seatStatus: string;
    seatPrice: number;
    scheduleId: number;
  }>;
  passengerResponseDTOS: Array<{
    id: number;
    passengerName: string;
    age: number;
    gender: string;
    seatNumber: string;
  }>;
  busName: string;
  busNumber: string;
  sourceCity: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusBookingDTO {
  id: number;
  userId: string;
  bookingDate: string; // or Date if you prefer
  totalPrice: number;
  bookingStatus: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  seatIds: string[];
  passengerIds: string[];
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  createdBy: string;
  busSchedule?: {
    id: number;
    bus: {
      name: string;
      number: string;
      type: string;
      totalSeats: number;
      amenities: string[];
      operator: string;
    };
    source: string;
    destination: string;
    distance: number;
    duration: string;
    departureTime: string;
    arrivalTime: string;
    travelDate: string;
      busName: string;
  busNumber: string;
  sourceCity: string;
  destinationCity: string;
    stops: any[]; 
  };
}