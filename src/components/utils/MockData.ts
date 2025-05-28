import { User, Bus, Route, Schedule, Seat, Booking, PopularRoute, BookingSummary } from '../../types';

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "customer@example.com",
    phone: "1234567890",
    role: "customer",
  },
  {
    id: "2",
    name: "Agent Smith",
    email: "agent@example.com",
    phone: "9876543210",
    role: "agent",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@example.com",
    phone: "5556667777",
    role: "admin",
  }
];

export const mockBuses: Bus[] = [
  {
    id: "bus1",
    name: "Royal Cruiser",
    busNumber: "KA-01-F-7777",
    busType: "AC",
    totalSeats: 40,
    amenities: ["WiFi", "Charging Point", "Refreshments", "Air Conditioning"],
    operator: "Sharma Travels",
  },
  {
    id: "bus2",
    name: "Night Rider",
    busNumber: "MH-04-AB-9999",
    busType: "Sleeper",
    totalSeats: 30,
    amenities: ["WiFi", "Charging Point", "Blankets", "Air Conditioning"],
    operator: "National Travels",
  },
  {
    id: "bus3",
    name: "City Express",
    busNumber: "DL-01-AB-1234",
    busType: "Non-AC",
    totalSeats: 45,
    amenities: ["Charging Point", "Water Bottle"],
    operator: "Delhi Express",
  },
  {
    id: "bus4",
    name: "Golden Chariot",
    busNumber: "TN-07-CD-4567",
    busType: "AC",
    totalSeats: 38,
    amenities: ["WiFi", "Charging Point", "Snacks", "Air Conditioning", "USB Ports"],
    operator: "Southern Travels",
  },
  {
    id: "bus5",
    name: "Mountain Safari",
    busNumber: "HP-03-XY-7890",
    busType: "Semi-Sleeper",
    totalSeats: 35,
    amenities: ["Charging Point", "Reading Light", "Air Conditioning"],
    operator: "Himalayan Tours",
  }
];

export const mockRoutes: Route[] = [
  {
    id: "route1",
    source: "Delhi",
    destination: "Mumbai",
    stops: [
      {
        name: "Jaipur",
        arrivalTime: "23:30",
        departureTime: "23:45",
        distance: 280
      },
      {
        name: "Ahmedabad",
        arrivalTime: "08:30",
        departureTime: "08:45",
        distance: 850
      },
      {
        name: "Surat",
        arrivalTime: "12:30",
        departureTime: "12:45",
        distance: 1100
      }
    ],
    distance: 1400,
    duration: "18h 30m",
  },
  {
    id: "route2",
    source: "Bangalore",
    destination: "Hyderabad",
    stops: [
      {
        name: "Anantapur",
        arrivalTime: "11:30",
        departureTime: "11:45",
        distance: 200
      },
      {
        name: "Kurnool",
        arrivalTime: "14:30",
        departureTime: "14:45",
        distance: 350
      }
    ],
    distance: 570,
    duration: "8h 15m",
  },
  {
    id: "route3",
    source: "Chennai",
    destination: "Bangalore",
    stops: [
      {
        name: "Vellore",
        arrivalTime: "08:30",
        departureTime: "08:45",
        distance: 140
      },
      {
        name: "Krishnagiri",
        arrivalTime: "10:30",
        departureTime: "10:45",
        distance: 250
      }
    ],
    distance: 346,
    duration: "6h 30m",
  },
  {
    id: "route4",
    source: "Mumbai",
    destination: "Pune",
    stops: [
      {
        name: "Lonavala",
        arrivalTime: "11:30",
        departureTime: "11:45",
        distance: 80
      }
    ],
    distance: 150,
    duration: "3h 45m",
  },
  {
    id: "route5",
    source: "Delhi",
    destination: "Jaipur",
    stops: [
      {
        name: "Gurugram",
        arrivalTime: "08:30",
        departureTime: "08:45",
        distance: 30
      },
      {
        name: "Neemrana",
        arrivalTime: "10:30",
        departureTime: "10:45",
        distance: 150
      }
    ],
    distance: 280,
    duration: "5h 15m",
  }
];

export const mockSchedules: Schedule[] = [
  {
    id: "schedule1",
    busId: "bus1",
    routeId: "route1",
    departureTime: "21:00",
    arrivalTime: "15:30",
    date: "2025-01-15",
    availableSeats: 28,
    fare: 1800,
  },
  {
    id: "schedule2",
    busId: "bus2",
    routeId: "route2",
    departureTime: "22:30",
    arrivalTime: "06:45",
    date: "2025-01-15",
    availableSeats: 18,
    fare: 1200,
  },
  {
    id: "schedule3",
    busId: "bus3",
    routeId: "route3",
    departureTime: "08:15",
    arrivalTime: "14:45",
    date: "2025-01-15",
    availableSeats: 32,
    fare: 850,
  },
  {
    id: "schedule4",
    busId: "bus4",
    routeId: "route4",
    departureTime: "10:00",
    arrivalTime: "13:45",
    date: "2025-01-15",
    availableSeats: 25,
    fare: 450,
  },
  {
    id: "schedule5",
    busId: "bus5",
    routeId: "route5",
    departureTime: "07:30",
    arrivalTime: "12:45",
    date: "2025-01-15",
    availableSeats: 22,
    fare: 650,
  },
  {
    id: "schedule6",
    busId: "bus1",
    routeId: "route1",
    departureTime: "18:00",
    arrivalTime: "12:30",
    date: "2025-01-15",
    availableSeats: 35,
    fare: 1750,
  }
];

export const generateSeats = (scheduleId: string): Seat[] => {
  const seats: Seat[] = [];
  const rows = 10;
  const seatsPerRow = 4; // 2 on each side with an aisle
  
  for (let row = 1; row <= rows; row++) {
    for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
      const seatLetter = String.fromCharCode(64 + seatNum); // A, B, C, D
      const seatNumber = `${row}${seatLetter}`;
      
      // Randomly decide if a seat is booked or available
      const status = Math.random() < 0.3 ? 'booked' : 'available';
      
      // Determine seat type
      let type: 'window' | 'aisle' | 'middle' | 'sleeper';
      if (seatNum === 1 || seatNum === 4) {
        type = 'window';
      } else {
        type = 'aisle';
      }
      
      // Generate price (window seats are slightly more expensive)
      const basePrice = scheduleId === 'schedule1' ? 1800 : 
                        scheduleId === 'schedule2' ? 1200 : 
                        scheduleId === 'schedule3' ? 850 : 
                        scheduleId === 'schedule4' ? 450 : 
                        scheduleId === 'schedule5' ? 650 : 1750;
      
      const price = type === 'window' ? basePrice + 50 : basePrice;
      
      seats.push({
        id: `${scheduleId}_${seatNumber}`,
        number: seatNumber,
        type,
        status,
        price,
      });
    }
  }
  
  return seats;
};

export const mockBookings: Booking[] = [
  {
    id: "booking1",
    userId: "1",
    scheduleId: "schedule1",
    bookedSeats: [
      {
        id: "schedule1_1A",
        number: "1A",
        type: "window",
        status: "booked",
        price: 1850,
      },
      {
        id: "schedule1_1B",
        number: "1B",
        type: "aisle",
        status: "booked",
        price: 1800,
      }
    ],
    passengers: [
      {
        name: "John Doe",
        age: 35,
        gender: "male",
        seatNumber: "1A",
      },
      {
        name: "Jane Doe",
        age: 32,
        gender: "female",
        seatNumber: "1B",
      }
    ],
    totalFare: 3650,
    bookingDate: "2025-01-01",
    status: "confirmed",
    paymentStatus: "paid",
    bookingCode: "TRVL78945",
  },
  {
    id: "booking2",
    userId: "1",
    scheduleId: "schedule3",
    bookedSeats: [
      {
        id: "schedule3_5C",
        number: "5C",
        type: "aisle",
        status: "booked",
        price: 850,
      }
    ],
    passengers: [
      {
        name: "John Doe",
        age: 35,
        gender: "male",
        seatNumber: "5C",
      }
    ],
    totalFare: 850,
    bookingDate: "2025-01-05",
    status: "confirmed",
    paymentStatus: "paid",
    bookingCode: "TRVL23456",
  },
  {
    id: "booking3",
    userId: "1",
    scheduleId: "schedule5",
    bookedSeats: [
      {
        id: "schedule5_3A",
        number: "3A",
        type: "window",
        status: "booked",
        price: 700,
      },
      {
        id: "schedule5_3B",
        number: "3B",
        type: "aisle",
        status: "booked",
        price: 650,
      },
      {
        id: "schedule5_4A",
        number: "4A",
        type: "window",
        status: "booked",
        price: 700,
      }
    ],
    passengers: [
      {
        name: "John Doe",
        age: 35,
        gender: "male",
        seatNumber: "3A",
      },
      {
        name: "Sarah Johnson",
        age: 28,
        gender: "female",
        seatNumber: "3B",
      },
      {
        name: "Mike Smith",
        age: 42,
        gender: "male",
        seatNumber: "4A",
      }
    ],
    totalFare: 2050,
    bookingDate: "2025-01-08",
    status: "cancelled",
    paymentStatus: "refunded",
    bookingCode: "TRVL34567",
  }
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