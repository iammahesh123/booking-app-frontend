import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Filter, ChevronsUpDown, Clock, Coffee, Wifi, PlugZap, Snowflake, MapPin } from 'lucide-react';
import Button from '../ui/Button';
import { Schedule, Bus, Route } from '../../types';

const busTypes = [
  { value: 'all', label: 'All Buses' },
  { value: 'AC', label: 'AC' },
  { value: 'Non-AC', label: 'Non-AC' },
  { value: 'Sleeper', label: 'Sleeper' },
  { value: 'Semi-Sleeper', label: 'Semi-Sleeper' },
];

const departureTimings = [
  { value: 'all', label: 'All Timings' },
  { value: 'morning', label: 'Morning (6AM - 12PM)' },
  { value: 'afternoon', label: 'Afternoon (12PM - 4PM)' },
  { value: 'evening', label: 'Evening (4PM - 8PM)' },
  { value: 'night', label: 'Night (8PM - 6AM)' },
];

interface BusListProps {
  schedules: Schedule[];
  buses: Bus[];
  routes: Route[];
  date: string;
}

const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const getBusDetails = (busId: number, buses: Bus[]): Bus | null => {
  return buses.find(bus => bus.id === busId) || null;
};

const getRouteDetails = (routeId: number, routes: Route[]): Route | null => {
  return routes.find(route => route.id) || null;
};

const BusList: React.FC<BusListProps> = ({ schedules, buses, routes, date }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [busType, setBusType] = useState('all');
  const [departureTime, setDepartureTime] = useState('all');
  const [sortBy, setSortBy] = useState('departure');
  const [showStops, setShowStops] = useState<number | null>(null);

  const navigate = useNavigate();
  
  const filteredSchedules = schedules.filter(schedule => {
    const bus = getBusDetails(schedule.busId, buses);
    
    // Filter by bus type
    if (busType !== 'all' && bus?.busType !== busType) {
      return false;
    }
    
    // Filter by departure time
    if (departureTime !== 'all') {
      const hour = parseInt(schedule.departureTime.split(':')[0]);
      
      if (departureTime === 'morning' && (hour < 6 || hour >= 12)) {
        return false;
      } else if (departureTime === 'afternoon' && (hour < 12 || hour >= 16)) {
        return false;
      } else if (departureTime === 'evening' && (hour < 16 || hour >= 20)) {
        return false;
      } else if (departureTime === 'night' && (hour >= 6 && hour < 20)) {
        return false;
      }
    }
    
    return true;
  });
  
  const sortedSchedules = [...filteredSchedules].sort((a, b) => {
    if (sortBy === 'departure') {
      return a.departureTime.localeCompare(b.departureTime);
    } else if (sortBy === 'arrival') {
      return a.arrivalTime.localeCompare(b.arrivalTime);
    } else if (sortBy === 'duration') {
      const routeA = getRouteDetails(a.routeId, routes);
      const routeB = getRouteDetails(b.routeId, routes);
      return (routeA?.totalDuration || '').localeCompare(routeB?.totalDuration || '');
    } else if (sortBy === 'price') {
      return a.farePrice - b.farePrice;
    } else if (sortBy === 'seats') {
      return b.totalSeats - a.totalSeats;
    }
    return 0;
  });
  
  const handleViewSeats = (scheduleId: number) => {
    navigate(`/booking/${scheduleId}?date=${date}`);
  };
  
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi size={16} />;
      case 'charging point':
        return <PlugZap size={16} />;
      case 'refreshments':
        return <Coffee size={16} />;
      case 'air conditioning':
        return <Snowflake size={16} />;
      default:
        return null;
    }
  };

  const toggleShowStops = (scheduleId: number) => {
    setShowStops(showStops === scheduleId ? null : scheduleId);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {filteredSchedules.length} {filteredSchedules.length === 1 ? 'Bus' : 'Buses'} Found
            </h3>
            <p className="text-sm text-gray-500">
              For {new Date(date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterOpen(!filterOpen)}
            leftIcon={<Filter size={16} />}
          >
            Filter & Sort
          </Button>
        </div>
        
        {filterOpen && (
          <div className="mt-4 border-t pt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bus Type</label>
              <div className="space-y-2">
                {busTypes.map((type) => (
                  <label key={type.value} className="flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      checked={busType === type.value}
                      onChange={() => setBusType(type.value)}
                    />
                    <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
              <div className="space-y-2">
                {departureTimings.map((timing) => (
                  <label key={timing.value} className="flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      checked={departureTime === timing.value}
                      onChange={() => setDepartureTime(timing.value)}
                    />
                    <span className="ml-2 text-sm text-gray-700">{timing.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    checked={sortBy === 'departure'}
                    onChange={() => setSortBy('departure')}
                  />
                  <span className="ml-2 text-sm text-gray-700">Departure Time</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    checked={sortBy === 'arrival'}
                    onChange={() => setSortBy('arrival')}
                  />
                  <span className="ml-2 text-sm text-gray-700">Arrival Time</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    checked={sortBy === 'duration'}
                    onChange={() => setSortBy('duration')}
                  />
                  <span className="ml-2 text-sm text-gray-700">Duration</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    checked={sortBy === 'price'}
                    onChange={() => setSortBy('price')}
                  />
                  <span className="ml-2 text-sm text-gray-700">Price (Low to High)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    checked={sortBy === 'seats'}
                    onChange={() => setSortBy('seats')}
                  />
                  <span className="ml-2 text-sm text-gray-700">Available Seats</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {sortedSchedules.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-lg text-gray-700 mb-2">No buses found matching your criteria.</p>
          <p className="text-sm text-gray-500">Try changing your filters or selecting a different date.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedSchedules.map((schedule) => {
            const bus = getBusDetails(schedule.busId, buses);
            const route = getRouteDetails(schedule.routeId, routes);
            
            if (!bus || !route) return null;

            return (
              <div key={schedule.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg font-semibold">{bus.busName}</h3>
                      <p className="text-sm text-gray-500">{bus.busType} • {bus.busNumber}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-8">
                      <div className="text-center">
                        <p className="text-lg font-semibold">{formatTime(schedule.departureTime)}</p>
                        <p className="text-sm text-gray-500">{route.sourceCity}</p>
                      </div>
                      
                      <div className="hidden md:block text-center">
                        <div className="flex items-center gap-1">
                          <div className="h-1 w-1 rounded-full bg-gray-400"></div>
                          <div className="h-1 w-16 bg-gray-300"></div>
                          <ArrowRight size={14} className="text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{route.totalDuration}</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-lg font-semibold">{formatTime(schedule.arrivalTime)}</p>
                        <p className="text-sm text-gray-500">{route.destinationCity}</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-lg font-semibold text-green-600">₹{schedule.farePrice}</p>
                        <p className="text-sm text-gray-500">{schedule.totalSeats} seats</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-3 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-gray-200">
                  <div className="flex flex-wrap gap-2 mb-3 sm:mb-0">
                    {bus.busAmenities.map((amenity, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {getAmenityIcon(amenity)}
                        <span className="ml-1">{amenity}</span>
                      </span>
                    ))}
                  </div>
                  
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleViewSeats(schedule.id)}
                  >
                    View Seats
                  </Button>
                </div>

                {route.stops.length > 0 && (
                  <div className="px-4 py-2 bg-gray-50 border-t">
                    <button
                      onClick={() => toggleShowStops(schedule.id)}
                      className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                      <MapPin size={16} className="mr-1" />
                      {route.stops.length} stops
                      <ChevronsUpDown size={16} className="ml-1" />
                    </button>
                    
                    {showStops === schedule.id && (
                      <div className="mt-2 space-y-2">
                        {route.stops.map((stop, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <div className="w-24 text-gray-500">{stop.stopName}</div>
                            <div className="flex items-center text-gray-600">
                              <Clock size={14} className="mr-1" />
                              {stop.arrivalTime} - {stop.departureTime}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BusList;