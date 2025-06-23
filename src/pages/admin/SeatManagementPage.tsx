import React, { useState, useEffect } from 'react';
import { Search, Eye, Calendar, Bus, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Seat, Schedule, Bus as BusType, Route } from '../../data/types';
import { fetchAllBuses, fetchAllRoutes, fetchAllSchedules, fetchSeats } from '../../apiConfig/Bus';

const SeatManagementPage: React.FC = () => {
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
  const [showSeatDetails, setShowSeatDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [buses, setBuses] = useState<BusType[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState({
    schedules: false,
    buses: false,
    routes: false,
    seats: false
  });
  const [error, setError] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Fetch all required data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(prev => ({ ...prev, schedules: true, buses: true, routes: true }));
        
        const [scheduleData, busData, routeData] = await Promise.all([
          fetchAllSchedules(),
          fetchAllBuses(),
          fetchAllRoutes()
        ]);

        setSchedules(scheduleData);
        setBuses(busData);
        setRoutes(routeData);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load initial data');
      } finally {
        setLoading(prev => ({
          ...prev,
          schedules: false,
          buses: false,
          routes: false
        }));
      }
    };

    fetchInitialData();
  }, []);

  const handleScheduleSelect = async (scheduleId: number) => {
    try {
      setLoading(prev => ({ ...prev, seats: true }));
      setSelectedSchedule(scheduleId);
      const seats = await fetchSeats(scheduleId);
      setSelectedSeats(seats);
      setShowSeatDetails(true);
    } catch (error) {
      console.error('Error handling schedule selection:', error);
      setError('Failed to load seat data');
    } finally {
      setLoading(prev => ({ ...prev, seats: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'booked':
        return 'bg-red-100 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter schedules based on search term and date
  const filteredSchedules = schedules.filter(schedule => {
    const bus = buses.find(b => b.id === schedule.busId);
    const matchesSearch = searchTerm === '' || 
      (bus?.busName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.departureTime.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDate = dateFilter === '' || 
      new Date(schedule.scheduleDate).toISOString().split('T')[0] === dateFilter;
    
    return matchesSearch && matchesDate;
  });

  const schedule = schedules.find(s => s.id === selectedSchedule);
  const bus = buses.find(b => b.id === schedule?.busId);
  const route = routes.find(r => r.id === schedule?.routeId);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Seat Management</h1>
          <p className="text-sm text-gray-600">
            View and manage seat availability and bookings
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <Input
            type="text"
            placeholder="Search schedules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={18} />}
            fullWidth
          />
          
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              leftIcon={<Calendar size={18} />}
              fullWidth
            />
            <Button
              variant="outline"
              onClick={() => setDateFilter('')}
              fullWidth
            >
              Clear Date
            </Button>
          </div>
          
          <Select
            options={filteredSchedules.map(schedule => ({
              value: schedule.id.toString(),
              label: `${buses.find(b => b.id === schedule.busId)?.busName || 'Unknown Bus'} - ${schedule.departureTime}`
            }))}
            value={selectedSchedule !== null ? selectedSchedule.toString() : ''}
            onChange={(e) => handleScheduleSelect(Number(e.target.value))}
            placeholder="Select Schedule"
            fullWidth
            disabled={loading.schedules}
          />
        </div>
      </div>

      {loading.seats && (
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {showSeatDetails && schedule && bus && route && !loading.seats && (
        <div className="mt-6 space-y-4">
          {/* Schedule Summary Card - Mobile Collapsible */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleSection('summary')}
              className="w-full flex justify-between items-center p-4 text-left"
            >
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Bus className="text-blue-500" size={18} />
                Schedule Summary
              </h3>
              {expandedSection === 'summary' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {expandedSection === 'summary' && (
              <div className="p-4 pt-0 border-t">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Bus Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {bus.busName}</p>
                      <p><span className="font-medium">Number:</span> {bus.busNumber}</p>
                      <p><span className="font-medium">Type:</span> {bus.busType}</p>
                      <p><span className="font-medium">Capacity:</span> {bus.totalSeats} seats</p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Route Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Route:</span> {route.sourceCity} → {route.destinationCity}</p>
                      <p><span className="font-medium">Distance:</span> {route.totalDistance} km</p>
                      <p><span className="font-medium">Duration:</span> {route.totalDuration}</p>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">Schedule Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Date:</span> {new Date(schedule.scheduleDate).toLocaleDateString()}</p>
                      <p><span className="font-medium">Departure:</span> {schedule.departureTime}</p>
                      <p><span className="font-medium">Arrival:</span> {schedule.arrivalTime}</p>
                      <p className="flex items-center">
                        <span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${new Date(schedule.scheduleDate) > new Date() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {new Date(schedule.scheduleDate) > new Date() ? 'Upcoming' : 'Departed'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Seat Layout Section - Mobile Collapsible */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleSection('seats')}
              className="w-full flex justify-between items-center p-4 text-left"
            >
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Eye className="text-blue-500" size={18} />
                Seat Layout ({selectedSeats.length} seats)
              </h3>
              {expandedSection === 'seats' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {expandedSection === 'seats' && (
              <div className="p-4 pt-0 border-t">
                {selectedSeats.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No seat information available
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedSeats.map((seat) => (
                        <div
                          key={seat.id}
                          className={`border rounded-lg p-3 space-y-1 ${
                            seat.seatStatus === 'BOOKED' ? 'bg-red-50 border-red-200' : 
                            seat.seatStatus === 'AVAILABLE' ? 'bg-green-50 border-green-200' :
                            'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">Seat {seat.seatNumber}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(seat.seatStatus)}`}>
                              {seat.seatStatus}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">
                            <p>Type: {seat.seatType}</p>
                            <p>Price: ₹{seat.seatPrice.toFixed(2)}</p>
                          </div>
                          {seat.seatStatus === 'BOOKED' && (
                            <Button
                              variant="outline"
                              // size="xs"
                              fullWidth
                              className="mt-1"
                              onClick={() => {
                                // TODO: Implement passenger details modal
                              }}
                            >
                              Passenger
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Seat Statistics - Mobile */}
                    <div className="mt-6 space-y-3">
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <p className="text-green-800 font-medium text-sm">Available Seats</p>
                        <p className="text-xl font-bold text-green-600">
                          {selectedSeats.filter(seat => seat.seatStatus === 'AVAILABLE').length}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          {((selectedSeats.filter(seat => seat.seatStatus === 'AVAILABLE').length / selectedSeats.length) * 100).toFixed(1)}% of total
                        </p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <p className="text-red-800 font-medium text-sm">Booked Seats</p>
                        <p className="text-xl font-bold text-red-600">
                          {selectedSeats.filter(seat => seat.seatStatus === 'BOOKED').length}
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          {((selectedSeats.filter(seat => seat.seatStatus === 'BOOKED').length / selectedSeats.length) * 100).toFixed(1)}% of total
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <p className="text-blue-800 font-medium text-sm">Total Revenue</p>
                        <p className="text-xl font-bold text-blue-600">
                          ₹{selectedSeats
                            .filter(seat => seat.seatStatus === 'BOOKED')
                            .reduce((sum, seat) => sum + seat.seatPrice, 0)
                            .toFixed(2)}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Potential: ₹{selectedSeats.reduce((sum, seat) => sum + seat.seatPrice, 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatManagementPage;