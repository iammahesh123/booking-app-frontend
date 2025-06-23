import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Bus, OrderBy } from '../../data/types';
import api, { busApi } from '../../apiConfig/Bus';
import Select from 'react-select';
import { useMediaQuery } from 'react-responsive';

interface FormErrors {
  busName?: string;
  busNumber?: string;
  busType?: string;
  totalSeats?: string;
  operatorName?: string;
}

const BusesPage: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: 0,
    busName: '',
    busNumber: '',
    busType: 'AC' as 'AC' | 'NON_AC' | 'SLEEPER' | 'SEMI_SLEEPER',
    totalSeats: 40,
    busAmenities: [] as string[],
    operatorName: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(isMobile ? 5 : 10);
  const [sortColumn, setSortColumn] = useState<string>('id');
  const [orderBy, setOrderBy] = useState<OrderBy>(OrderBy.ASC);

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

  // Fetch buses on component mount and when pagination changes
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/bus', {
          params: {
            pageNumber: currentPage - 1,
            pageSize: itemsPerPage,
            sortColumn: sortColumn,
            orderBy: orderBy,
            searchTerm: searchTerm
          }
        });
        setBuses(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);
      } catch (err) {
        setError('Failed to fetch buses. Please try again later.');
        console.error('Fetch buses error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuses();
  }, [currentPage, itemsPerPage, sortColumn, orderBy, searchTerm]);

  // Adjust items per page when screen size changes
  useEffect(() => {
    setItemsPerPage(isMobile ? 5 : 10);
  }, [isMobile]);

  const filteredBuses = buses?.filter(bus => {
    if (!bus) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      (bus.busName?.toLowerCase() || '').includes(searchLower) ||
      (bus.busNumber?.toLowerCase() || '').includes(searchLower) ||
      (bus.operatorName?.toLowerCase() || '').includes(searchLower)
    );
  }) || [];

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
      errors.operatorName = 'Operator is required';
    }

    if (!formData.totalSeats || formData.totalSeats <= 0) {
      errors.totalSeats = 'Total seats must be a positive number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Pagination controls
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle form submission (both add and update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  const handleDeleteBus = async (busId: number) => {
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
      id: 0,
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
      id: bus.id,
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

  if (isLoading && buses.length === 0) return <div className="p-6">Loading Buses...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Buses Management</h1>
          <p className="mt-1 md:mt-2 text-sm text-gray-700">
            Manage your fleet of buses, their details, and amenities
          </p>
        </div>
        <div>
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus size={18} />}
            fullWidth={isMobile}
          >
            Add Bus
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
          <button
            className="mt-2 text-sm text-red-700 hover:text-red-900"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search and Pagination Controls */}
      <div className="mt-4 md:mt-6 flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search buses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={18} />}
            fullWidth
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="itemsPerPage" className="text-sm text-gray-700 whitespace-nowrap">
            Items per page:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm py-1"
          >
            {[5, 10, 20, 50].map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="mt-8 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        /* Buses Table - Mobile Cards or Desktop Table */
        isMobile ? (
          <div className="mt-6 space-y-3">
            {filteredBuses.length > 0 ? (
              filteredBuses.map((bus) => (
                <div key={bus.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{bus.busName}</h3>
                      <p className="text-gray-500 text-sm">{bus.busNumber}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(bus)}
                        className="text-primary hover:text-primary-dark p-1"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBus(bus.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span> {bus.busType}
                    </div>
                    <div>
                      <span className="text-gray-500">Seats:</span> {bus.totalSeats}
                    </div>
                    <div>
                      <span className="text-gray-500">Operator:</span> {bus.operatorName}
                    </div>
                  </div>
                  {bus.busAmenities && bus.busAmenities.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-1">Amenities:</p>
                      <div className="flex flex-wrap gap-1">
                        {bus.busAmenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {amenity.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-sm text-gray-500 bg-white rounded-lg shadow">
                No buses found
              </div>
            )}
          </div>
        ) : (
          /* Desktop Table */
          <div className="mt-6 flex flex-col">
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
                                    {amenity.replace('_', ' ')}
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
        )
      )}

      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
        <div className="text-sm text-gray-700">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords} entries
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={goToPreviousPage}
            disabled={currentPage === 1 || isLoading}
            leftIcon={<ChevronLeft size={16} />}
            size="sm"
          >
            {!isMobile && 'Previous'}
          </Button>
          
          {Array.from({ length: Math.min(isMobile ? 3 : 5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= (isMobile ? 3 : 5)) {
              pageNum = i + 1;
            } else if (currentPage <= (isMobile ? 2 : 3)) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - (isMobile ? 1 : 2)) {
              pageNum = totalPages - (isMobile ? 2 : 4) + i;
            } else {
              pageNum = currentPage - (isMobile ? 1 : 2) + i;
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'primary' : 'outline'}
                onClick={() => goToPage(pageNum)}
                disabled={isLoading}
                className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} p-0 flex items-center justify-center`}
                size="sm"
              >
                {pageNum}
              </Button>
            );
          })}
          
          <Button
            variant="outline"
            onClick={goToNextPage}
            disabled={currentPage === totalPages || isLoading}
            rightIcon={<ChevronRight size={16} />}
            size="sm"
          >
            {!isMobile && 'Next'}
          </Button>
        </div>
      </div>

      {/* Add/Edit Bus Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {selectedBus ? 'Edit Bus' : 'Add New Bus'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                  <option value="NON_AC">Non-AC</option>
                  <option value="SLEEPER">Sleeper</option>
                  <option value="SEMI_SLEEPER">Semi-Sleeper</option>
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
                    const selectedValues = selected ? selected.map(option => option.value) : [];
                    setFormData(prev => ({
                      ...prev,
                      busAmenities: selectedValues,
                    }));
                  }}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
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
                  min="1"
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
                  error={formErrors.operatorName}
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