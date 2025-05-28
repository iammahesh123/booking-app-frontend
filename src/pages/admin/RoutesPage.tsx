import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, MapPin, Clock, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Route, Stop } from '../../types';
import api from '../../apiConfig/axios';

const RoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState({
    id: 0,
    sourceCity: '',
    destinationCity: '',
    distance: 0,
    duration: '',
    stops: [] as Stop[]
  });

  // Fetch routes on component mount
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const response = await api.get('/bus-route');
        setRoutes(response.data);
      } catch (err) {
        setError('Failed to fetch routes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const filteredRoutes = routes.filter(route => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (route.sourceCity?.toLowerCase() || '').includes(searchLower) ||
      (route.destinationCity?.toLowerCase() || '').includes(searchLower)
    );
  });

  const handleAddStop = () => {
    setFormData({
      ...formData,
      stops: [
        ...formData.stops,
        {
          id: 0, // Temporary ID, will be replaced when saved
          stopName: '',
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

  const saveStops = async (stops: Stop[]): Promise<number[]> => {
    const stopIds: number[] = [];
    
    for (const stop of stops) {
      try {
        const stopData = {
          stopName: stop.stopName,
          arrivalTime: stop.arrivalTime,
          departureTime: stop.departureTime,
          distance: stop.distance
        };

        let stopId;
        if (stop.id && stop.id > 0) {
          // Update existing stop
          await api.put(`/bus-stop/${stop.id}`, stopData);
          stopId = stop.id;
        } else {
          // Create new stop
          const response = await api.post('/bus-stop', stopData);
          stopId = response.data.id;
        }
        stopIds.push(stopId);
      } catch (err) {
        console.error('Error saving stop:', err);
        throw new Error('Failed to save stop');
      }
    }
    
    return stopIds;
  };

  const handleAddRoute = async () => {
    try {
      // First save all stops
      const stopIds = await saveStops(formData.stops);

      // Then create/update the route
      const routeData = {
        id: formData.id || 0,
        sourceCity: formData.sourceCity,
        destinationCity: formData.destinationCity,
        totalDistance: formData.distance,
        totalDuration: formData.duration,
        stopIds: stopIds
      };

      if (selectedRoute && selectedRoute.id) {
        // Update existing route
        const response = await api.put(`/bus-route/${selectedRoute.id}`, routeData);
        setRoutes(routes.map(route =>
          route.id === selectedRoute.id ? response.data : route
        ));
      } else {
        // Create new route
        const response = await api.post('/bus-route', routeData);
        setRoutes([...routes, response.data]);
      }

      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving route:', err);
      setError('Failed to save route');
    }
  };

  const handleDeleteRoute = async (routeId: number) => {
    try {
      await api.delete(`/bus-route/${routeId}`);
      setRoutes(routes.filter(route => route.id !== routeId));
    } catch (err) {
      console.error('Error deleting route:', err);
      setError('Failed to delete route');
    }
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      sourceCity: '',
      destinationCity: '',
      distance: 0,
      duration: '',
      stops: []
    });
    setSelectedRoute(null);
  };

  const handleEditRoute = (route: Route) => {
    setSelectedRoute(route);
    setFormData({
      id: route.id || 0,
      sourceCity: route.sourceCity || '',
      destinationCity: route.destinationCity || '',
      distance: route.totalDistance || 0,
      duration: route.totalDuration || '',
      stops: route.stops?.map(stop => ({
        id: stop.id || 0,
        stopName: stop.stopName || '',
        arrivalTime: stop.arrivalTime || '',
        departureTime: stop.departureTime || '',
        distance: stop.distance || 0
      })) || []
    });
    setShowAddModal(true);
  };

  if (loading) return <div>Loading routes...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

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
                            <div className="font-medium text-gray-900">{route.sourceCity}</div>
                            <ArrowRight className="h-4 w-4 text-gray-400 inline mx-1" />
                            <div className="font-medium text-gray-900 inline">{route.destinationCity}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="flex flex-col gap-1">
                          {route.stops?.map((stop, index) => (
                            <div key={index} className="flex items-center text-xs">
                              <span className="w-20 truncate">{stop.stopName}</span>
                              <Clock className="h-3 w-3 mx-1" />
                              <span>{stop.arrivalTime} - {stop.departureTime}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {route.totalDistance} km
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {route.totalDuration}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditRoute(route)}
                            className="text-primary hover:text-primary-dark"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this route?')) {
                                handleDeleteRoute(route.id);
                              }
                            }}
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
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">
              {selectedRoute ? 'Edit Route' : 'Add New Route'}
            </h3>
            <form className="space-y-4" onSubmit={async (e) => {
    e.preventDefault();
    await handleAddRoute();
  }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Source City"
                  value={formData.sourceCity}
                  onChange={(e) => setFormData({ ...formData, sourceCity: e.target.value })}
                  required
                  fullWidth
                  leftIcon={<MapPin size={16} />}
                />
                <Input
                  label="Destination City"
                  value={formData.destinationCity}
                  onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
                  required
                  fullWidth
                  leftIcon={<MapPin size={16} />}
                />
                <Input
                  label="Total Distance (km)"
                  type="number"
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: Number(e.target.value) })}
                  required
                  fullWidth
                  min="0"
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

                {formData.stops.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No stops added yet. Click "Add Stop" to add stops to this route.
                  </div>
                )}

                {formData.stops.map((stop, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4 items-end">
                    <Input
                      label="Stop Name"
                      value={stop.stopName}
                      onChange={(e) => handleStopChange(index, 'stopName', e.target.value)}
                      required
                      fullWidth
                    />
                    <Input
                      label="Arrival Time"
                      type="time"
                      value={stop.arrivalTime}
                      onChange={(e) => handleStopChange(index, 'arrivalTime', e.target.value)}
                      required
                      fullWidth
                    />
                    <Input
                      label="Departure Time"
                      type="time"
                      value={stop.departureTime}
                      onChange={(e) => handleStopChange(index, 'departureTime', e.target.value)}
                      required
                      fullWidth
                    />
                    <div className="flex gap-2 items-end">
                      <Input
                        label="Distance (km)"
                        type="number"
                        value={stop.distance}
                        onChange={(e) => handleStopChange(index, 'distance', Number(e.target.value))}
                        required
                        fullWidth
                        min="0"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveStop(index)}
                        className="text-red-600 hover:text-red-900 mb-1"
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
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  onClick={handleAddRoute}
                  disabled={!formData.sourceCity || !formData.destinationCity || !formData.duration}
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