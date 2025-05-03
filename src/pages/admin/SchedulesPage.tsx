import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Schedule, Bus, Route } from '../../types';
import { mockSchedules, mockBuses, mockRoutes } from '../../components/utils/MockData';

const SchedulesPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    busId: '',
    routeId: '',
    departureTime: '',
    arrivalTime: '',
    date: '',
    availableSeats: 0,
    fare: 0
  });

  const filteredSchedules = schedules.filter(schedule => {
    const bus = mockBuses.find(b => b.id === schedule.busId);
    const route = mockRoutes.find(r => r.id === schedule.routeId);
    const searchString = `${bus?.name} ${route?.source} ${route?.destination}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const handleAddSchedule = () => {
    const newSchedule: Schedule = {
      id: `schedule${Date.now()}`,
      ...formData
    };
    setSchedules([...schedules, newSchedule]);
    setShowAddModal(false);
    setFormData({
      busId: '',
      routeId: '',
      departureTime: '',
      arrivalTime: '',
      date: '',
      availableSeats: 0,
      fare: 0
    });
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));
  };

  const getBusDetails = (busId: string): Bus | undefined => {
    return mockBuses.find(bus => bus.id === busId);
  };

  const getRouteDetails = (routeId: string): Route | undefined => {
    return mockRoutes.find(route => route.id === routeId);
  };

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Schedules Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage bus schedules, timings, and fares
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus size={20} />}
          >
            Add Schedule
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <Input
          type="text"
          placeholder="Search schedules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={20} />}
          fullWidth
        />
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Bus & Route
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date & Time
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Seats
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Fare
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredSchedules.map((schedule) => {
                    const bus = getBusDetails(schedule.busId);
                    const route = getRouteDetails(schedule.routeId);
                    
                    return (
                      <tr key={schedule.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                          <div className="font-medium text-gray-900">{bus?.name}</div>
                          <div className="text-gray-500">
                            {route?.source} → {route?.destination}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>{new Date(schedule.date).toLocaleDateString()}</div>
                          <div>{schedule.departureTime} - {schedule.arrivalTime}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {schedule.availableSeats} available
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                          ₹{schedule.fare}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedSchedule(schedule);
                                setFormData({
                                  busId: schedule.busId,
                                  routeId: schedule.routeId,
                                  departureTime: schedule.departureTime,
                                  arrivalTime: schedule.arrivalTime,
                                  date: schedule.date,
                                  availableSeats: schedule.availableSeats,
                                  fare: schedule.fare
                                });
                                setShowAddModal(true);
                              }}
                              className="text-primary hover:text-primary-dark"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">
              {selectedSchedule ? 'Edit Schedule' : 'Add New Schedule'}
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bus</label>
                <select
                  value={formData.busId}
                  onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="">Select a bus</option>
                  {mockBuses.map(bus => (
                    <option key={bus.id} value={bus.id}>
                      {bus.name} - {bus.busNumber}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Route</label>
                <select
                  value={formData.routeId}
                  onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="">Select a route</option>
                  {mockRoutes.map(route => (
                    <option key={route.id} value={route.id}>
                      {route.source} to {route.destination}
                    </option>
                  ))}
                </select>
              </div>
              
              <Input
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                fullWidth
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Departure Time"
                  type="time"
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                  required
                  fullWidth
                />
                
                <Input
                  label="Arrival Time"
                  type="time"
                  value={formData.arrivalTime}
                  onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                  required
                  fullWidth
                />
              </div>
              
              <Input
                label="Available Seats"
                type="number"
                value={formData.availableSeats}
                onChange={(e) => setFormData({ ...formData, availableSeats: parseInt(e.target.value) })}
                required
                fullWidth
              />
              
              <Input
                label="Fare (₹)"
                type="number"
                value={formData.fare}
                onChange={(e) => setFormData({ ...formData, fare: parseInt(e.target.value) })}
                required
                fullWidth
              />
              
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAddSchedule}
                >
                  {selectedSchedule ? 'Save Changes' : 'Add Schedule'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulesPage;