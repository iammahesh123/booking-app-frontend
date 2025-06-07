import React, { useState } from 'react';
import { Search, Filter, Eye, Calendar, Bus } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { mockSchedules, mockBuses, mockRoutes, generateSeats } from '../../components/utils/MockData'; // Adjust the import path as necessary

const SeatManagementPage: React.FC = () => {
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [showSeatDetails, setShowSeatDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);

  const seats = selectedSchedule ? generateSeats(selectedSchedule) : [];
  const schedule = mockSchedules.find(s => s.id === selectedSchedule);
  const bus = schedule ? mockBuses.find(b => b.id === schedule.busId) : null;
  const route = schedule ? mockRoutes.find(r => r.id === schedule.routeId) : null;

  const handleScheduleSelect = (scheduleId: string) => {
    setSelectedSchedule(scheduleId);
    setShowSeatDetails(true);
    setSelectedSeats(generateSeats(scheduleId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'booked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Seat Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage seat availability and bookings for all schedules
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="text"
            placeholder="Search schedules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={20} />}
            fullWidth
          />
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            leftIcon={<Calendar size={20} />}
            fullWidth
          />
          <Select
            options={mockSchedules.map(schedule => ({
              value: schedule.id,
              label: `${mockBuses.find(b => b.id === schedule.busId)?.name} - ${schedule.departureTime}`
            }))}
            value={selectedSchedule}
            onChange={(e) => handleScheduleSelect(e.target.value)}
            placeholder="Select Schedule"
            fullWidth
          />
        </div>
      </div>

      {showSeatDetails && schedule && bus && route && (
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Bus Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Bus Name:</span> {bus.name}</p>
                  <p><span className="font-medium">Bus Number:</span> {bus.busNumber}</p>
                  <p><span className="font-medium">Type:</span> {bus.busType}</p>
                  <p><span className="font-medium">Total Seats:</span> {bus.totalSeats}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Route Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">From:</span> {route.source}</p>
                  <p><span className="font-medium">To:</span> {route.destination}</p>
                  <p><span className="font-medium">Duration:</span> {route.duration}</p>
                  <p><span className="font-medium">Distance:</span> {route.distance} km</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Schedule Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Date:</span> {schedule.date}</p>
                  <p><span className="font-medium">Departure:</span> {schedule.departureTime}</p>
                  <p><span className="font-medium">Arrival:</span> {schedule.arrivalTime}</p>
                  <p><span className="font-medium">Available Seats:</span> {schedule.availableSeats}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">Seat Layout</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {seats.map((seat) => (
                <div
                  key={seat.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Seat {seat.number}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(seat.status)}`}>
                      {seat.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Type: {seat.type}</p>
                    <p>Price: ₹{seat.price}</p>
                  </div>
                  {seat.status === 'booked' && (
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => {
                        // Show passenger details modal
                      }}
                    >
                      View Passenger
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Seat Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-green-800 font-medium">Available Seats</p>
                  <p className="text-2xl font-bold text-green-600">
                    {seats.filter(seat => seat.status === 'available').length}
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-red-800 font-medium">Booked Seats</p>
                  <p className="text-2xl font-bold text-red-600">
                    {seats.filter(seat => seat.status === 'booked').length}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ₹{seats.filter(seat => seat.status === 'booked').reduce((sum, seat) => sum + seat.price, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatManagementPage;