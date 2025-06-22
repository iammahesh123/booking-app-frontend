import { User, Bus, Route, Schedule, Seat, Booking, PopularRoute, BookingSummary } from './types';

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "customer@example.com",
    phone: "1234567890",
    role: "CUSTOMER",
  },
  {
    id: "2",
    name: "Agent Smith",
    email: "agent@example.com",
    phone: "9876543210",
    role: "CUSTOMER",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@example.com",
    phone: "5556667777",
    role: "ADMIN",
  }
];

export const mockBuses: Bus[] = [
  {
    id: 1,
    busName: "Royal Cruiser",
    busNumber: "KA-01-F-7777",
    busType: "AC",
    totalSeats: 40,
    busAmenities: ["WiFi", "Charging Point", "Refreshments", "Air Conditioning"],
    operatorName: "Sharma Travels",
  },
  {
    id: 2,
    busName: "Night Rider",
    busNumber: "MH-04-AB-9999",
    busType: "SLEEPER",
    totalSeats: 30,
    busAmenities: ["WiFi", "Charging Point", "Blankets", "Air Conditioning"],
    operatorName: "National Travels",
  },
  {
    id: 3,
    busName: "City Express",
    busNumber: "DL-01-AB-1234",
    busType: "NON_AC",
    totalSeats: 45,
    busAmenities: ["Charging Point", "Water Bottle"],
    operatorName: "Delhi Express",
  },
  {
    id: 4,
    busName: "Golden Chariot",
    busNumber: "TN-07-CD-4567",
    busType: "AC",
    totalSeats: 38,
    busAmenities: ["WiFi", "Charging Point", "Snacks", "Air Conditioning", "USB Ports"],
    operatorName: "Southern Travels",
  },
  {
    id: 5,
    busName: "Mountain Safari",
    busNumber: "HP-03-XY-7890",
    busType: "SEMI_SLEEPER",
    totalSeats: 35,
    busAmenities: ["Charging Point", "Reading Light", "Air Conditioning"],
    operatorName: "Himalayan Tours",
  }
];

export const mockRoutes: Route[] = [
  {
    id: 1,
    sourceCity: "Delhi",
    destinationCity: "Mumbai",
    stops: [
      {
        stopName: "Jaipur",
        arrivalTime: "23:30",
        departureTime: "23:45",
        distance: 280
      },
      {
        stopName: "Ahmedabad",
        arrivalTime: "08:30",
        departureTime: "08:45",
        distance: 850
      },
      {
        stopName: "Surat",
        arrivalTime: "12:30",
        departureTime: "12:45",
        distance: 1100
      }
    ],
    totalDistance: 1400,
    totalDuration: "18h 30m",
  },
  {
    id: 2,
    sourceCity: "Bangalore",
    destinationCity: "Hyderabad",
    stops: [
      {
        stopName: "Anantapur",
        arrivalTime: "11:30",
        departureTime: "11:45",
        distance: 200
      },
      {
        stopName: "Kurnool",
        arrivalTime: "14:30",
        departureTime: "14:45",
        distance: 350
      }
    ],
    totalDistance: 570,
    totalDuration: "8h 15m",
  },
  {
    id: 3,
    sourceCity: "Chennai",
    destinationCity: "Bangalore",
    stops: [
      {
        stopName: "Vellore",
        arrivalTime: "08:30",
        departureTime: "08:45",
        distance: 140
      },
      {
        stopName: "Krishnagiri",
        arrivalTime: "10:30",
        departureTime: "10:45",
        distance: 250
      }
    ],
    totalDistance: 346,
    totalDuration: "6h 30m",
  },
  {
    id: 4,
    sourceCity: "Mumbai",
    destinationCity: "Pune",
    stops: [
      {
        stopName: "Lonavala",
        arrivalTime: "11:30",
        departureTime: "11:45",
        distance: 80
      }
    ],
    totalDistance: 150,
    totalDuration: "3h 45m",
  },
  {
    id: 5,
    sourceCity: "Delhi",
    destinationCity: "Jaipur",
    stops: [
      {
        stopName: "Gurugram",
        arrivalTime: "08:30",
        departureTime: "08:45",
        distance: 30
      },
      {
        stopName: "Neemrana",
        arrivalTime: "10:30",
        departureTime: "10:45",
        distance: 150
      }
    ],
    totalDistance: 280,
    totalDuration: "5h 15m",
  }
];

// export const mockSchedules: Schedule[] = [
//   {
//     id:1,
//     busId: 1,
//     routeId: 1,
//     departureTime: "21:00",
//     arrivalTime: "15:30",
//     scheduleDate: "2025-01-15",
//     totalSeats: 28,
//     farePrice: 1800,
//   },
//   {
//     id: 2,
//     busId: 2,
//     routeId: 2,
//     departureTime: "22:30",c
//     arrivalTime: "06:45",
//     scheduleDate: "2025-01-15",
//     totalSeats: 18,
//     farePrice: 1200,
//   },
//   {
//     id: 3,
//     busId: 3,
//     routeId: 3,
//     departureTime: "08:15",
//     arrivalTime: "14:45",
//     scheduleDate: "2025-01-15",
//     totalSeats: 32,
//     farePrice: 850,
//   },
//   {
//     id: 4,
//     busId: 4,
//     routeId: 4,
//     departureTime: "10:00",
//     arrivalTime: "13:45",
//     scheduleDate: "2025-01-15",
//     totalSeats: 25,
//     farePrice: 450,
//   },
//   {
//     id: 5,
//     busId: 5,
//     routeId: 5,
//     departureTime: "07:30",
//     arrivalTime: "12:45",
//     scheduleDate: "2025-01-15",
//     totalSeats: 22,
//     farePrice: 650,
//   },
//   {
//     id: 6,
//     busId: 1,
//     routeId: 1,
//     departureTime: "18:00",
//     arrivalTime: "12:30",
//     scheduleDate: "2025-01-15",
//     totalSeats: 35,
//     farePrice: 1750,
//   }
// ];

// export const generateSeats = (scheduleId: number): Seat[] => {
//   const seats: Seat[] = [];
//   const rows = 10;
//   const seatsPerRow = 4; // 2 on each side with an aisle

//   for (let row = 1; row <= rows; row++) {
//     for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
//       const seatLetter = String.fromCharCode(64 + seatNum); // A, B, C, D
//       const seatNumber = `${row}${seatLetter}`;

//       // Randomly decide if a seat is booked or available
//       const status = Math.random() < 0.3 ? 'booked' : 'available';

//       // Determine seat type
//       let type: 'window' | 'aisle' | 'middle' | 'sleeper';
//       if (seatNum === 1 || seatNum === 4) {
//         type = 'window';
//       } else {
//         type = 'aisle';
//       }

//       // Generate price (window seats are slightly more expensive)
//       const basePrice = scheduleId === 1 ? 1800 : 
//                         scheduleId === 2 ? 1200 : 
//                         scheduleId === 3 ? 850 : 
//                         scheduleId === 4 ? 450 : 
//                         scheduleId === 5 ? 650 : 1750;

//       const price = type === 'window' ? basePrice + 50 : basePrice;

//       seats.push({
//         id: row * 10 + seatNum, // or any unique number logic
//         seatNumber: seatNumber,
//         seatType: type,
//         seatStatus: status === 'booked' ? 'BOOKED' : 'AVAILABLE',
//         seatPrice: price,
//       });
//     }
//   }

//   return seats;
// };

export const mockBookings: Booking[] = [



];

export const mockPopularRoutes: PopularRoute[] = [
  {
    source: "Delhi",
    destination: "Mumbai",
    count: 325,
  },
  {
    source: "Bangalore",
    destination: "Hyderabad",
    count: 278,
  },
  {
    source: "Mumbai",
    destination: "Pune",
    count: 247,
  },
  {
    source: "Chennai",
    destination: "Bangalore",
    count: 231,
  },
  {
    source: "Delhi",
    destination: "Jaipur",
    count: 199,
  }
];

export const mockBookingSummary: BookingSummary = {
  totalBookings: 1289,
  totalRevenue: 1456750,
  cancelledBookings: 87,
  upcomingBookings: 215,
};

export const busTypes = [
  { value: 'all', label: 'All Buses' },
  { value: 'AC', label: 'AC' },
  { value: 'Non-AC', label: 'Non-AC' },
  { value: 'Sleeper', label: 'Sleeper' },
  { value: 'Semi-Sleeper', label: 'Semi-Sleeper' },
];

export const departureTimings = [
  { value: 'all', label: 'All Timings' },
  { value: 'morning', label: 'Morning (6AM - 12PM)' },
  { value: 'afternoon', label: 'Afternoon (12PM - 4PM)' },
  { value: 'evening', label: 'Evening (4PM - 8PM)' },
  { value: 'night', label: 'Night (8PM - 6AM)' },
];