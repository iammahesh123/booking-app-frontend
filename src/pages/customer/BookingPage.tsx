import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Info, MapPin, Calendar, Clock } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SeatLayout from '../../components/booking/SeatLayout';
import { Seat, Schedule, Bus, Route } from '../../types';
import { mockSchedules, mockBuses, mockRoutes, generateSeats } from '../../components/utils/MockData';

const BookingPage: React.FC = () => {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date') || '';
  
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [bus, setBus] = useState<Bus | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch schedule details (in a real app, this would be an API call)
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      if (scheduleId) {
        const foundSchedule = mockSchedules.find(s => s.id === scheduleId);
        setSchedule(foundSchedule || null);
        
        if (foundSchedule) {
          const foundBus = mockBuses.find(b => b.id === foundSchedule.busId);
          setBus(foundBus || null);
          
          const foundRoute = mockRoutes.find(r => r.id === foundSchedule.routeId);
          if (!foundRoute) {
            setError('Route information not found for this schedule.');
          }
          setRoute(foundRoute || null);
          
          // Generate seats for this schedule
          const generatedSeats = generateSeats(scheduleId);
          setSeats(generatedSeats);
        } else {
          setError('Schedule not found.');
        }
      }
      
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [scheduleId]);
  
  const handleSeatSelect = (seat: Seat) => {
    setSelectedSeats(prev => [...prev, seat]);
  };
  
  const handleSeatDeselect = (seat: Seat) => {
    setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
  };
  
  // Format time for display
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link to="/search" className="inline-flex items-center text-primary hover:underline">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to search results
            </Link>
          </div>
          
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-600">Loading bus and seat information...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-lg text-gray-700 mb-2">{error}</p>
              <p className="text-sm text-gray-500 mb-6">Please try selecting a different schedule.</p>
              <Link 
                to="/search" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
              >
                Back to Search
              </Link>
            </div>
          ) : schedule && bus && route ? (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">{bus.name}</h1>
                    <p className="text-gray-500">{bus.busType} • {bus.busNumber}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-8">
                    <div className="text-center">
                      <p className="text-lg font-semibold">{formatTime(schedule.departureTime)}</p>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin size={14} className="mr-1" />
                        {route.source}
                      </div>
                    </div>
                    
                    <div className="hidden md:block text-center">
                      <div className="flex items-center gap-1">
                        <div className="h-1 w-1 rounded-full bg-gray-400"></div>
                        <div className="h-1 w-16 bg-gray-300"></div>
                        <div className="h-1 w-1 rounded-full bg-gray-400"></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{route.duration}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-lg font-semibold">{formatTime(schedule.arrivalTime)}</p>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin size={14} className="mr-1" />
                        {route.destination}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center bg-blue-50 p-3 rounded-md">
                    <div className="flex items-center text-gray-700 text-sm mb-1">
                      <Calendar size={14} className="mr-1" />
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <Clock size={14} className="mr-1" />
                      Journey: {route.duration}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {bus.amenities.map((amenity, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <SeatLayout
                scheduleId={scheduleId || ''}
                seats={seats}
                date={date}
                route={route}
                onSeatSelect={handleSeatSelect}
                onSeatDeselect={handleSeatDeselect}
                selectedSeats={selectedSeats}
              />
              
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Important Information</h4>
                    <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside">
                      <li>Please arrive at the boarding point at least 15 minutes before departure.</li>
                      <li>Carry a valid ID proof for verification.</li>
                      <li>Cancellation charges apply as per the cancellation policy.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-lg text-gray-700 mb-2">Bus not found</p>
              <p className="text-sm text-gray-500 mb-6">The bus you're looking for might not exist or has been removed.</p>
              <Link 
                to="/search" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
              >
                Back to Search
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookingPage;