import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
  Clock,
  ArrowRight,
  Bus as BusIcon,
  IndianRupee,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import DataTable, { ColumnDef } from '../../components/ui/DataTable';
import { Schedule, Bus, Route, ApiScheduleResponse, OrderBy } from '../../data/types';
import { busApi, routeApi, scheduleApi } from '../../apiConfig/Bus';
import toast from 'react-hot-toast';

enum ScheduleDuration {
  ONE_MONTH = 'ONE_MONTH',
  TWO_MONTHS = 'TWO_MONTHS',
  THREE_MONTHS = 'THREE_MONTHS',
  FOUR_MONTHS = 'FOUR_MONTHS',
}

const mapApiResponseToSchedule = (apiResponse: ApiScheduleResponse): Schedule => ({
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
  createdBy: apiResponse.createdBy,
});

export const SchedulesPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination & sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortColumn, setSortColumn] = useState<string>('id');
  const [orderBy, setOrderBy] = useState<OrderBy>(OrderBy.ASC);

  const [formData, setFormData] = useState({
    busId: 0,
    routeId: 0,
    departureTime: '',
    arrivalTime: '',
    scheduleDate: '',
    totalSeats: 40,
    farePrice: 850,
    automationDuration: ScheduleDuration.ONE_MONTH,
    isMasterRecord: true,
  });

  // 1. Fetch Buses and Routes ONCE on mount (cached in state)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [busesRes, routesRes] = await Promise.all([
          busApi.getAll(),
          routeApi.getAllRoutes(),
        ]);
        setBuses(busesRes || []);
        setRoutes(routesRes.data?.data || routesRes.data || []);
      } catch (err) {
        console.error('Error fetching buses and routes for schedules:', err);
      }
    };
    fetchMetadata();
  }, []);

  // 2. Fetch paginated schedules on page/sort change
  const fetchSchedulesData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await scheduleApi.getSchedules({
        pageNumber: currentPage - 1,
        pageSize: itemsPerPage,
        sortColumn,
        orderBY: orderBy,
      });

      const mapped = (res.data?.data || []).map(mapApiResponseToSchedule);
      setSchedules(mapped);
      setTotalPages(res.data?.totalPages || 1);
      setTotalRecords(res.data?.totalRecords || 0);
    } catch (err) {
      toast.error('Failed to load dispatch schedules');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, sortColumn, orderBy]);

  useEffect(() => {
    fetchSchedulesData();
  }, [fetchSchedulesData]);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setOrderBy(orderBy === OrderBy.ASC ? OrderBy.DESC : OrderBy.ASC);
    } else {
      setSortColumn(columnKey);
      setOrderBy(OrderBy.ASC);
    }
    setCurrentPage(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.busId || !formData.routeId || !formData.departureTime || !formData.arrivalTime) {
      toast.error('Please fill all required schedule details.');
      return;
    }

    try {
      setIsSubmitting(true);
      const schedulePayload = {
        busId: Number(formData.busId),
        routeId: Number(formData.routeId),
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        scheduleDate: formData.scheduleDate || new Date().toISOString().split('T')[0],
        totalSeats: Number(formData.totalSeats),
        farePrice: Number(formData.farePrice),
        automationDuration: formData.automationDuration,
        isMasterRecord: formData.isMasterRecord,
      };

      if (selectedSchedule?.id) {
        await scheduleApi.updateSchedule(selectedSchedule.id, schedulePayload);
        toast.success('Schedule updated successfully');
      } else {
        await scheduleApi.createSchedule(schedulePayload);
        toast.success('Schedule created successfully');
      }

      closeModal();
      fetchSchedulesData();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!scheduleToDelete?.id) return;
    try {
      setIsSubmitting(true);
      await scheduleApi.deleteSchedule(scheduleToDelete.id);
      toast.success('Schedule deleted');
      setScheduleToDelete(null);
      fetchSchedulesData();
    } catch (err) {
      toast.error('Failed to delete schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setSelectedSchedule(null);
    setFormData({
      busId: 0,
      routeId: 0,
      departureTime: '',
      arrivalTime: '',
      scheduleDate: '',
      totalSeats: 40,
      farePrice: 850,
      automationDuration: ScheduleDuration.ONE_MONTH,
      isMasterRecord: true,
    });
  };

  const openEdit = (s: Schedule) => {
    setSelectedSchedule(s);
    setFormData({
      busId: s.busId,
      routeId: s.routeId,
      departureTime: s.departureTime,
      arrivalTime: s.arrivalTime,
      scheduleDate: s.scheduleDate?.split('T')[0] || '',
      totalSeats: s.totalSeats,
      farePrice: s.farePrice,
      automationDuration: s.automationDuration || ScheduleDuration.ONE_MONTH,
      isMasterRecord: s.isMasterRecord,
    });
    setShowAddModal(true);
  };

  const columns: ColumnDef<Schedule>[] = [
    {
      key: 'id',
      header: 'ID / Route',
      sortable: true,
      render: (s) => {
        const route = routes.find((r) => r.id === s.routeId);
        return (
          <div>
            <span className="font-mono text-xs font-bold text-primary block">SCH-{s.id}</span>
            <span className="font-semibold text-gray-900 text-sm">
              {route ? `${route.sourceCity} → ${route.destinationCity}` : `Route #${s.routeId}`}
            </span>
          </div>
        );
      },
    },
    {
      key: 'busId',
      header: 'Assigned Bus',
      render: (s) => {
        const bus = buses.find((b) => b.id === s.busId);
        return (
          <div>
            <p className="font-medium text-gray-800 text-xs">{bus?.busName || `Bus #${s.busId}`}</p>
            <p className="font-mono text-[11px] text-gray-400">{bus?.busNumber || bus?.busType}</p>
          </div>
        );
      },
    },
    {
      key: 'scheduleDate',
      header: 'Date & Timings',
      sortable: true,
      render: (s) => (
        <div>
          <div className="flex items-center gap-1 text-xs font-semibold text-gray-900">
            <CalendarIcon size={12} className="text-gray-400" />
            <span>{s.scheduleDate ? new Date(s.scheduleDate).toLocaleDateString() : 'Recurring'}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
            <Clock size={11} className="text-gray-400" />
            <span>{s.departureTime} - {s.arrivalTime}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'farePrice',
      header: 'Fare & Capacity',
      sortable: true,
      render: (s) => (
        <div>
          <span className="font-bold text-emerald-700 text-xs block">₹{s.farePrice}</span>
          <span className="text-[11px] text-gray-500">{s.totalSeats} Total Seats</span>
        </div>
      ),
    },
    {
      key: 'automationDuration',
      header: 'Recurrence',
      render: (s) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800">
          {s.automationDuration?.replace('_', ' ') || '1 MONTH'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (s) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEdit(s)}
            className="h-8 w-8 p-0"
            title="Edit schedule"
            aria-label="Edit schedule"
          >
            <Edit size={16} className="text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScheduleToDelete(s)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Delete schedule"
            aria-label="Delete schedule"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary" />
            Trip Schedules & Dispatch
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Configure transit timetables, bus-route linkage, fares, and recurring dispatch rules.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus size={18} />}
        >
          Create Schedule
        </Button>
      </div>

      <DataTable<Schedule>
        data={schedules}
        columns={columns}
        totalRecords={totalRecords}
        page={currentPage}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={(sz) => {
          setItemsPerPage(sz);
          setCurrentPage(1);
        }}
        sortColumn={sortColumn}
        sortOrder={orderBy === OrderBy.ASC ? 'ASC' : 'DESC'}
        onSort={handleSort}
        isLoading={loading}
        keyExtractor={(s) => s.id}
        emptyMessage="No schedules found"
        emptySubtext="Create your first timetable schedule or configure automatic recurring dispatches."
        emptyAction={
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
            Create First Schedule
          </Button>
        }
      />

      {/* Add / Edit Schedule Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={closeModal}
        title={selectedSchedule ? 'Edit Trip Schedule' : 'Create New Trip Schedule'}
        description="Link a vehicle to a transit route, set departure and arrival timings, and fare pricing."
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Route Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Route Corridor
              </label>
              <select
                value={formData.routeId}
                onChange={(e) => setFormData({ ...formData, routeId: Number(e.target.value) })}
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-primary focus:border-primary"
                required
              >
                <option value="">-- Choose Route --</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.sourceCity} → {r.destinationCity} ({r.totalDistance} km)
                  </option>
                ))}
              </select>
            </div>

            {/* Bus Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign Vehicle / Bus
              </label>
              <select
                value={formData.busId}
                onChange={(e) => {
                  const bId = Number(e.target.value);
                  const found = buses.find((b) => b.id === bId);
                  setFormData({
                    ...formData,
                    busId: bId,
                    totalSeats: found?.totalSeats || formData.totalSeats,
                  });
                }}
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-primary focus:border-primary"
                required
              >
                <option value="">-- Choose Bus --</option>
                {buses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.busName} ({b.busNumber}) - {b.busType}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Schedule Date"
              type="date"
              value={formData.scheduleDate}
              onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
              required
              fullWidth
            />
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Base Fare Price (₹)"
              type="number"
              value={formData.farePrice.toString()}
              onChange={(e) =>
                setFormData({ ...formData, farePrice: parseFloat(e.target.value) || 0 })
              }
              min="100"
              required
              fullWidth
            />
            <Input
              label="Total Seats"
              type="number"
              value={formData.totalSeats.toString()}
              onChange={(e) =>
                setFormData({ ...formData, totalSeats: parseInt(e.target.value) || 40 })
              }
              min="1"
              required
              fullWidth
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Automation Duration
              </label>
              <select
                value={formData.automationDuration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    automationDuration: e.target.value as ScheduleDuration,
                  })
                }
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-primary focus:border-primary"
              >
                <option value={ScheduleDuration.ONE_MONTH}>1 Month</option>
                <option value={ScheduleDuration.TWO_MONTHS}>2 Months</option>
                <option value={ScheduleDuration.THREE_MONTHS}>3 Months</option>
                <option value={ScheduleDuration.FOUR_MONTHS}>4 Months</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" size="sm" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              {selectedSchedule ? 'Save Changes' : 'Create Schedule'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!scheduleToDelete}
        onClose={() => setScheduleToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Trip Schedule"
        message={`Are you sure you want to delete Schedule #SCH-${scheduleToDelete?.id}? Any booked passenger tickets for this schedule will require cancellation or reassignment.`}
        confirmText="Delete Schedule"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default SchedulesPage;