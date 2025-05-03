import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, MapPin, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Route, Stop } from '../../types';
import { mockRoutes } from '../../components/utils/MockData';

const RoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    distance: 0,
    duration: '',
    stops: [] as Stop[]
  });

  const filteredRoutes = routes.filter(route =>
    route.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStop = () => {
    setFormData({
      ...formData,
      stops: [
        ...formData.stops,
        {
          name: '',
          arrivalTime: '',
          departureTime: '',
          distance: 0
        }
      ]
    });
  };

  const handleRemoveStop = (index: number) => {
    setFormData({
      ...formData,
      stops: formData.stops.filter((_, i) => i !== index)
    });
  };

  const handleStopChange = (index: number, field: keyof Stop, value: string | number) => {
    const newStops = [...formData.stops];
    newStops[index] = {
      ...newStops[index],
      [field]: value
    };
    setFormData({ ...formData, stops: newStops });
  };

  const handleAddRoute = () => {
    const newRoute: Route = {
      id: `route${Date.now()}`,
      ...formData
    };
    setRoutes([...routes, newRoute]);
    setShowAddModal(false);
    setFormData({
      source: '',
      destination: '',
      distance: 0,
      duration: '',
      stops: []
    });
  };

  const handleDeleteRoute = (routeId: string) => {
    setRoutes(routes.filter(route => route.id !== routeId));
  };

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Routes Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage bus routes, stops, and their details
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus size={20} />}
          >
            Add Route
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <Input
          type="text"
          placeholder="Search routes..."
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
                      Route Details
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Stops
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Distance
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Duration
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredRoutes.map((route) => (
                    <tr key={route.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="font-medium text-gray-900">{route.source}</div>
                            <div className="text-gray-500">{route.destination}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="flex flex-col gap-1">
                          {route.stops.map((stop, index) => (
                            <div key={index} className="flex items-center text-xs">
                              <span className="w-20">{stop.name}</span>
                              <Clock className="h-3 w-3 mx-1" />
                              <span>{stop.arrivalTime} - {stop.departureTime}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {route.distance} km
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {route.duration}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedRoute(route);
                              setFormData({
                                source: route.source,
                                destination: route.destination,
                                distance: route.distance,
                                duration: route.duration,
                                stops: route.stops
                              });
                              setShowAddModal(true);
                            }}
                            className="text-primary hover:text-primary-dark"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoute(route.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Route Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-medium mb-4">
              {selectedRoute ? 'Edit Route' : 'Add New Route'}
            </h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Source City"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  required
                  fullWidth
                  leftIcon={<MapPin size={16} />}
                />
                <Input
                  label="Destination City"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  required
                  fullWidth
                  leftIcon={<MapPin size={16} />}
                />
                <Input
                  label="Total Distance (km)"
                  type="number"
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: parseInt(e.target.value) })}
                  required
                  fullWidth
                />
                <Input
                  label="Total Duration (e.g., 5h 30m)"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                  fullWidth
                  placeholder="5h 30m"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-gray-900">Stops</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddStop}
                    leftIcon={<Plus size={16} />}
                  >
                    Add Stop
                  </Button>
                </div>

                {formData.stops.map((stop, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                    <Input
                      placeholder="Stop Name"
                      value={stop.name}
                      onChange={(e) => handleStopChange(index, 'name', e.target.value)}
                      required
                      fullWidth
                    />
                    <Input
                      type="time"
                      placeholder="Arrival Time"
                      value={stop.arrivalTime}
                      onChange={(e) => handleStopChange(index, 'arrivalTime', e.target.value)}
                      required
                      fullWidth
                    />
                    <Input
                      type="time"
                      placeholder="Departure Time"
                      value={stop.departureTime}
                      onChange={(e) => handleStopChange(index, 'departureTime', e.target.value)}
                      required
                      fullWidth
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Distance (km)"
                        value={stop.distance}
                        onChange={(e) => handleStopChange(index, 'distance', parseInt(e.target.value))}
                        required
                        fullWidth
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveStop(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAddRoute}
                >
                  {selectedRoute ? 'Save Changes' : 'Add Route'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutesPage;