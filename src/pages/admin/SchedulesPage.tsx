import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Schedule, Bus, Route, ApiScheduleResponse, OrderBy } from '../../types';
import { busApi, routeApi, scheduleApi } from '../../apiConfig/Bus';



enum ScheduleDuration {
  ONE_MONTH = 'ONE_MONTH',
  TWO_MONTHS = 'TWO_MONTHS',
  THREE_MONTHS = 'THREE_MONTHS',
  FOUR_MONTHS = 'FOUR_MONTHS'
}

const LoadingSpinner: React.FC<{ size?: 'small' | 'medium' | 'large' }> = ({ size = 'medium' }) => {
  const sizes = {
    small: 'h-5 w-5',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${sizes[size]}`}
      ></div>
    </div>
  );
};

const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{message}</h3>
          {onRetry && (
            <div className="mt-2">
              <button
                onClick={onRetry}
                className="text-sm font-medium text-red-800 hover:text-red-700"
              >
                Retry <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapApiResponseToSchedule = (apiResponse: ApiScheduleResponse): Schedule => {
  return {
    id: apiResponse.id,
    busId: apiResponse.busResponseDTO?.id || 0,
    routeId: apiResponse.routeResponseDTO?.id || 0,
    departureTime: apiResponse.departureTime,
    arrivalTime: apiResponse.arrivalTime,
    scheduleDate: apiResponse.scheduleDate,
    totalSeats: apiResponse.totalSeats,
    farePrice: apiResponse.farePrice,
    automationDuration: apiResponse.automationDuration,
    isMasterRecord: apiResponse.isMasterRecord,
    createdAt: apiResponse.createdAt,
    updatedAt: apiResponse.updatedAt,
    updatedBy: apiResponse.updatedBy,
    createdBy: apiResponse.createdBy
  };
};

const SchedulesPage: React.FC = () => {
  // State management
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    busId: 0,
    routeId: 0,
    departureTime: '',
    arrivalTime: '',
    scheduleDate: '',
    totalSeats: 0,
    farePrice: 0,
    automationDuration: ScheduleDuration.ONE_MONTH,
    isMasterRecord: false
  });

  // Pagination and sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortColumn, setSortColumn] = useState<string>('id');
  const [orderBy, setOrderBy] = useState<OrderBy>(OrderBy.ASC);

  // Fetch data from API
const fetchData = async () => {
  try {
    setLoading(true);
    const [schedulesRes, busesRes, routesRes] = await Promise.all([
      scheduleApi.getSchedules({
        pageNumber: currentPage - 1,
        pageSize: itemsPerPage,
        sortColumn: sortColumn,
        orderBY: orderBy
      }),
      busApi.getAll(),
      routeApi.getAllRoutes()
    ]);

    const mappedSchedules = schedulesRes.data.data.map((apiSchedule: ApiScheduleResponse) =>
      mapApiResponseToSchedule(apiSchedule)
    );

    setSchedules(mappedSchedules);
    setBuses(busesRes.data.data);
    setRoutes(routesRes.data.data);
    setTotalPages(schedulesRes.data.totalPages);
    setTotalRecords(schedulesRes.data.totalRecords);
    setError(null);
  } catch (err) {
    setError('Failed to fetch data. Please try again later.');
    console.error('Error fetching data:', err);
  } finally {
    setLoading(false);
  }
};

  // Helper functions
  const getBusDetails = (busId: number): Bus | undefined => {
    return buses.find(bus => Number(bus.id) === Number(busId));
  };

  const getRouteDetails = (routeId: number): Route | undefined => {
    return routes.find(route => route.id === routeId);
  };

  // Filter schedules based on search term
  const filteredSchedules = schedules.filter(schedule => {
    const bus = getBusDetails(schedule.busId);
    const route = getRouteDetails(schedule.routeId);
    const searchString = `${bus?.busName} ${route?.sourceCity || ''} ${route?.destinationCity || ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  // Sorting handler
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setOrderBy(orderBy === OrderBy.ASC ? OrderBy.DESC : OrderBy.ASC);
    } else {
      setSortColumn(column);
      setOrderBy(OrderBy.ASC);
    }
    setCurrentPage(1);
  };

  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) return null;
    return orderBy === OrderBy.ASC ? (
      <ArrowUp className="ml-1 h-3 w-3 inline" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 inline" />
    );
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

  // CRUD operations
const handleAddSchedule = async () => {
  try {
    setLoading(true);
    const scheduleData = {
      busId: formData.busId,
      routeId: formData.routeId,
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime,
      scheduleDate: formData.scheduleDate,
      totalSeats: formData.totalSeats,
      farePrice: formData.farePrice,
      automationDuration: formData.automationDuration,
      isMasterRecord: formData.isMasterRecord
    };

    let response;
    if (selectedSchedule) {
      // Update existing schedule
      response = await scheduleApi.updateSchedule(selectedSchedule.id, scheduleData);
      setSchedules(schedules.map(s =>
        s.id === selectedSchedule.id ? mapApiResponseToSchedule(response.data) : s
      ));
    } else {
      // Create new schedule
      response = await scheduleApi.createSchedule(scheduleData);
      setSchedules([...schedules, mapApiResponseToSchedule(response.data)]);
    }
    setShowAddModal(false);
    resetForm();
    setError(null);
    fetchData();
  } catch (err) {
    setError('Failed to save schedule. Please try again.');
    console.error('Error saving schedule:', err);
  } finally {
    setLoading(false);
  }
};


const handleDeleteSchedule = async (scheduleId: number) => {
  try {
    setLoading(true);
    await scheduleApi.deleteSchedule(scheduleId);
    setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));
    setError(null);
    fetchData();
  } catch (err) {
    setError('Failed to delete schedule. Please try again.');
    console.error('Error deleting schedule:', err);
  } finally {
    setLoading(false);
  }
};

  // Form helpers
  const resetForm = () => {
    setFormData({
      busId: 0,
      routeId: 0,
      departureTime: '',
      arrivalTime: '',
      scheduleDate: '',
      totalSeats: 0,
      farePrice: 0,
      automationDuration: ScheduleDuration.ONE_MONTH,
      isMasterRecord: false
    });
    setSelectedSchedule(null);
  };

  const handleEditClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      busId: schedule.busId,
      routeId: schedule.routeId,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      scheduleDate: schedule.scheduleDate,
      totalSeats: schedule.totalSeats,
      farePrice: schedule.farePrice,
      automationDuration: schedule.automationDuration,
      isMasterRecord: schedule.isMasterRecord
    });
    setShowAddModal(true);
  };

  // Render loading or error states
  if (loading && schedules.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="p-6">
      {/* Header section */}
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
            disabled={loading}
          >
            Add Schedule
          </Button>
        </div>
      </div>

      {/* Search and pagination controls */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          placeholder="Search schedules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={20} />}
          fullWidth
          disabled={loading}
        />
        <div className="flex items-center gap-2">
          <label htmlFor="itemsPerPage" className="text-sm text-gray-700">
            Items per page:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            disabled={loading}
          >
            {[5, 10, 20, 50].map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Schedules table */}
      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('busName')}
                    >
                      <div className="flex items-center">
                        Bus & Route
                        {renderSortIndicator('busName')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('scheduleDate')}
                    >
                      <div className="flex items-center">
                        Date
                        {renderSortIndicator('scheduleDate')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('departureTime')}
                    >
                      <div className="flex items-center">
                        Time
                        {renderSortIndicator('departureTime')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('totalSeats')}
                    >
                      <div className="flex items-center">
                        Seats
                        {renderSortIndicator('totalSeats')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('farePrice')}
                    >
                      <div className="flex items-center">
                        Fare
                        {renderSortIndicator('farePrice')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('automationDuration')}
                    >
                      <div className="flex items-center">
                        Duration
                        {renderSortIndicator('automationDuration')}
                      </div>
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredSchedules.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-sm text-gray-500">
                        {searchTerm ? 'No matching schedules found' : 'No schedules available'}
                      </td>
                    </tr>
                  ) : (
                    filteredSchedules.map((schedule) => {
                      const bus = getBusDetails(schedule.busId);
                      const route = getRouteDetails(schedule.routeId);

                      return (
                        <tr key={schedule.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                            <div className="font-medium text-gray-900">{bus?.busName}</div>
                            {route ? (
                              <div className="text-gray-500">
                                {route.sourceCity} → {route.destinationCity}
                              </div>
                            ) : (
                              <div className="text-gray-500">Route not assigned</div>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(schedule.scheduleDate).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {schedule.departureTime} - {schedule.arrivalTime}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {schedule.totalSeats} available
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                            ₹{schedule.farePrice.toLocaleString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {schedule.automationDuration}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(schedule)}
                                className="text-primary hover:text-primary-dark"
                                disabled={loading}
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteSchedule(schedule.id)}
                                className="text-red-600 hover:text-red-900"
                                disabled={loading}
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
        <div className="text-sm text-gray-700">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords} entries
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={goToPreviousPage}
            disabled={currentPage === 1 || loading}
            leftIcon={<ChevronLeft size={16} />}
            size="sm"
          >
            Previous
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'primary' : 'outline'}
                onClick={() => goToPage(pageNum)}
                disabled={loading}
                className="w-10 h-10 p-0 flex items-center justify-center"
                size="sm"
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="outline"
            onClick={goToNextPage}
            disabled={currentPage === totalPages || loading}
            rightIcon={<ChevronRight size={16} />}
            size="sm"
          >
            Next
          </Button>
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
                  onChange={(e) => setFormData({ ...formData, busId: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  disabled={loading}
                  required
                >
                  <option value="0">Select a bus</option>
                  {buses.map(bus => (
                    <option key={bus.id} value={bus.id}>
                      {bus.busName} - {bus.busNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Route</label>
                <select
                  value={formData.routeId}
                  onChange={(e) => setFormData({ ...formData, routeId: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  disabled={loading}
                  required
                >
                  <option value="0">Select a route</option>
                  {routes.map(route => (
                    <option key={route.id} value={route.id}>
                      {route.sourceCity} to {route.destinationCity}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Date"
                type="date"
                value={formData.scheduleDate}
                onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                required
                fullWidth
                disabled={loading}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Departure Time"
                  type="time"
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                  required
                  fullWidth
                  disabled={loading}
                />

                <Input
                  label="Arrival Time"
                  type="time"
                  value={formData.arrivalTime}
                  onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                  required
                  fullWidth
                  disabled={loading}
                />
              </div>

              <Input
                label="Available Seats"
                type="number"
                value={formData.totalSeats.toString()}
                onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value) || 0 })}
                required
                fullWidth
                disabled={loading}
                min="1"
              />

              <Input
                label="Fare (₹)"
                type="number"
                value={formData.farePrice.toString()}
                onChange={(e) => setFormData({ ...formData, farePrice: parseInt(e.target.value) || 0 })}
                required
                fullWidth
                disabled={loading}
                min="1"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700">Automation Duration</label>
                <select
                  value={formData.automationDuration}
                  onChange={(e) => setFormData({ ...formData, automationDuration: e.target.value as ScheduleDuration })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  disabled={loading}
                  required
                >
                  {Object.values(ScheduleDuration).map(duration => (
                    <option key={duration} value={duration}>
                      {duration.replace('_', ' ').toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isMasterRecord"
                  checked={formData.isMasterRecord}
                  onChange={(e) => setFormData({ ...formData, isMasterRecord: e.target.checked })}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  disabled={loading}
                />
                <label htmlFor="isMasterRecord" className="ml-2 block text-sm text-gray-700">
                  Is Master Record
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAddSchedule}
                  disabled={loading || !formData.busId || !formData.routeId || !formData.scheduleDate || !formData.departureTime || !formData.arrivalTime}
                >
                  {loading ? (
                    <LoadingSpinner size="small" />
                  ) : selectedSchedule ? (
                    'Save Changes'
                  ) : (
                    'Add Schedule'
                  )}
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