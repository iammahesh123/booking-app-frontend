import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Bus } from '../../types';
import { busApi } from '../../apiConfig/Bus';
import Select from 'react-select';

interface FormErrors {
  busName?: string;
  busNumber?: string;
  busType?: string;
  totalSeats?: string;
  operator?: string;
}

const BusesPage: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    busName: '',
    busNumber: '',
    busType: 'AC' as 'AC' | 'Non-AC' | 'Sleeper' | 'Semi-Sleeper',
    totalSeats: 40,
    busAmenities: [] as string[],
    operatorName: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const amenityOptions = [
    { value: 'WIFI', label: 'WiFi' },
    { value: 'CHARGING_POINT', label: 'Charging Point' },
    { value: 'REFRESHMENTS', label: 'Refreshments' },
    { value: 'AIR_CONDITIONING', label: 'Air Conditioning' },
    { value: 'RECLINING_SEATS', label: 'Reclining Seats' },
    { value: 'TOILET', label: 'Toilet' },
    { value: 'GPS_TRACKING', label: 'GPS Tracking' },
    { value: 'SLEEPER_BERTH', label: 'Sleeper Berth' },
    { value: 'WATER_BOTTLE', label: 'Water Bottle' },
    { value: 'BLANKET', label: 'Blanket' },
  ];

  // Fetch buses on component mount
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setIsLoading(true);
        const data = await busApi.getAll();
        setBuses(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch buses. Please try again later.');
        console.error('Fetch buses error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuses();
  }, []);

  // Filter buses based on search term
  const filteredBuses = buses.filter(bus => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (bus.busName?.toLowerCase() || '').includes(searchLower) ||
      (bus.busNumber?.toLowerCase() || '').includes(searchLower) ||
      (bus.operatorName?.toLowerCase() || '').includes(searchLower)
    );
  });

  // Validate form fields
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.busName.trim()) {
      errors.busName = 'Bus name is required';
    }

    if (!formData.busNumber.trim()) {
      errors.busNumber = 'Bus number is required';
    }

    if (!formData.operatorName.trim()) {
      errors.operator = 'Operator is required';
    }

    if (!formData.totalSeats || formData.totalSeats <= 0) {
      errors.totalSeats = 'Total seats must be a positive number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission (both add and update)
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (selectedBus) {
        // Update existing bus
        const updatedBus = await busApi.update(selectedBus.id, formData);
        setBuses(buses.map(bus => bus.id === selectedBus.id ? updatedBus : bus));
      } else {
        // Add new bus
        const newBus = await busApi.create(formData);
        setBuses([...buses, newBus]);
      }

      closeModal();
    } catch (err) {
      const action = selectedBus ? 'update' : 'add';
      setError(`Failed to ${action} bus. Please try again.`);
      console.error(`${action} bus error:`, err);
    }
  };

  // Handle bus deletion
  const handleDeleteBus = async (busId: string) => {
    if (!window.confirm('Are you sure you want to delete this bus?')) return;

    try {
      await busApi.delete(busId);
      setBuses(buses.filter(bus => bus.id !== busId));
    } catch (err) {
      setError('Failed to delete bus. Please try again.');
      console.error('Delete bus error:', err);
    }
  };

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      busName: '',
      busNumber: '',
      busType: 'AC',
      totalSeats: 40,
      busAmenities: [],
      operatorName: ''
    });
    setFormErrors({});
  };

  // Close modal and reset form
  const closeModal = () => {
    setShowAddModal(false);
    setSelectedBus(null);
    resetForm();
  };

  // Handle edit button click
  const handleEditClick = (bus: Bus) => {
    setSelectedBus(bus);
    setFormData({
      busName: bus.busName || '',
      busNumber: bus.busNumber || '',
      busType: bus.busType || 'AC',
      totalSeats: bus.totalSeats || 40,
      busAmenities: bus.busAmenities || [],
      operatorName: bus.operatorName || ''
    });
    setShowAddModal(true);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalSeats' ? parseInt(value) || 0 : value
    }));

    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Buses Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your fleet of buses, their details, and amenities
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus size={20} />}
          >
            Add Bus
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
          <button
            className="mt-2 text-red-700 hover:text-red-900"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="mt-6">
        <Input
          type="text"
          placeholder="Search buses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={20} />}
          fullWidth
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="mt-8 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        /* Buses Table */
        <div className="mt-8 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                        Bus Details
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Type
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Seats
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Operator
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Amenities
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredBuses.length > 0 ? (
                      filteredBuses.map((bus) => (
                        <tr key={bus.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                            <div className="font-medium text-gray-900">{bus.busName}</div>
                            <div className="text-gray-500">{bus.busNumber}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {bus.busType}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {bus.totalSeats}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {bus.operatorName}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            <div className="flex flex-wrap gap-1">
                              {(bus.busAmenities || []).map((amenity, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(bus)}
                                className="text-primary hover:text-primary-dark"
                                title="Edit"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteBus(bus.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-sm text-gray-500">
                          No buses found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Bus Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">
              {selectedBus ? 'Edit Bus' : 'Add New Bus'}
            </h3>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              {/* Bus Name */}
              <div>
                <Input
                  label="Bus Name"
                  name="busName"
                  value={formData.busName}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={formErrors.busName}
                />
              </div>

              {/* Bus Number */}
              <div>
                <Input
                  label="Bus Number"
                  name="busNumber"
                  value={formData.busNumber}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={formErrors.busNumber}
                />
              </div>

              {/* Bus Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bus Type
                </label>
                <select
                  name="busType"
                  value={formData.busType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="AC">AC</option>
                  <option value="Non-AC">Non-AC</option>
                  <option value="Sleeper">Sleeper</option>
                  <option value="Semi-Sleeper">Semi-Sleeper</option>
                </select>
              </div>

              {/* Bus Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bus Amenities
                </label>
                <Select
                  isMulti
                  name="busAmenities"
                  options={amenityOptions}
                  value={amenityOptions.filter(option => formData.busAmenities.includes(option.value))}
                  onChange={(selected) => {
                    const selectedValues = selected.map(option => option.value);
                    setFormData(prev => ({
                      ...prev,
                      busAmenities: selectedValues,
                    }));
                  }}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.busAmenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full"
                    >
                      {amenity.replace('_', ' ')}
                    </span>
                  ))}
                </div>

              </div>


              {/* Total Seats */}
              <div>
                <Input
                  label="Total Seats"
                  name="totalSeats"
                  type="number"
                  value={formData.totalSeats.toString()}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={formErrors.totalSeats}
                />
              </div>

              {/* Operator */}
              <div>
                <Input
                  label="Operator"
                  name="operatorName"
                  value={formData.operatorName}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={formErrors.operator}
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  {selectedBus ? 'Save Changes' : 'Add Bus'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusesPage;