import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit, Trash2, Bus as BusIcon, ShieldAlert } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import DataTable, { ColumnDef } from '../../components/ui/DataTable';
import { Bus, OrderBy } from '../../data/types';
import api, { busApi } from '../../apiConfig/Bus';
import Select from 'react-select';
import toast from 'react-hot-toast';

interface FormErrors {
  busName?: string;
  busNumber?: string;
  busType?: string;
  totalSeats?: string;
  operatorName?: string;
}

export const BusesPage: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [busToDelete, setBusToDelete] = useState<Bus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Pagination and sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string>('id');
  const [orderBy, setOrderBy] = useState<OrderBy>(OrderBy.ASC);

  const [formData, setFormData] = useState({
    id: 0,
    busName: '',
    busNumber: '',
    busType: 'AC' as 'AC' | 'NON_AC' | 'SLEEPER' | 'SEMI_SLEEPER',
    totalSeats: 40,
    busAmenities: [] as string[],
    operatorName: '',
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

  const fetchBuses = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/bus', {
        params: {
          pageNumber: currentPage - 1,
          pageSize: itemsPerPage,
          sortColumn,
          orderBy,
          searchTerm,
        },
      });
      setBuses(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalRecords(response.data.totalRecords || 0);
    } catch (err) {
      toast.error('Failed to load fleet buses');
      console.error('Fetch buses error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, sortColumn, orderBy, searchTerm]);

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setOrderBy(orderBy === OrderBy.ASC ? OrderBy.DESC : OrderBy.ASC);
    } else {
      setSortColumn(columnKey);
      setOrderBy(OrderBy.ASC);
    }
    setCurrentPage(1);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.busName.trim()) errors.busName = 'Bus name is required';
    if (!formData.busNumber.trim()) errors.busNumber = 'Registration number is required';
    if (!formData.operatorName.trim()) errors.operatorName = 'Operator name is required';
    if (!formData.totalSeats || formData.totalSeats <= 0) {
      errors.totalSeats = 'Seats must be a positive number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      if (selectedBus?.id) {
        const updated = await busApi.update(selectedBus.id, formData);
        setBuses((prev) => prev.map((b) => (b.id === selectedBus.id ? updated : b)));
        toast.success('Bus updated successfully');
      } else {
        const created = await busApi.create(formData);
        setBuses((prev) => [created, ...prev]);
        setTotalRecords((prev) => prev + 1);
        toast.success('Bus added to fleet');
      }
      closeModal();
    } catch (err: any) {
      toast.error(err?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!busToDelete?.id) return;
    try {
      setIsSubmitting(true);
      await busApi.delete(busToDelete.id);
      setBuses((prev) => prev.filter((b) => b.id !== busToDelete.id));
      setTotalRecords((prev) => Math.max(0, prev - 1));
      toast.success(`Bus ${busToDelete.busNumber} deleted`);
      setBusToDelete(null);
    } catch (err) {
      toast.error('Failed to delete bus. It may have active schedules.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setSelectedBus(null);
    setFormData({
      id: 0,
      busName: '',
      busNumber: '',
      busType: 'AC',
      totalSeats: 40,
      busAmenities: [],
      operatorName: '',
    });
    setFormErrors({});
  };

  const openEdit = (bus: Bus) => {
    setSelectedBus(bus);
    setFormData({
      id: bus.id || 0,
      busName: bus.busName || '',
      busNumber: bus.busNumber || '',
      busType: bus.busType || 'AC',
      totalSeats: bus.totalSeats || 40,
      busAmenities: bus.busAmenities || [],
      operatorName: bus.operatorName || '',
    });
    setShowAddModal(true);
  };

  const columns: ColumnDef<Bus>[] = [
    {
      key: 'busName',
      header: 'Bus Details',
      sortable: true,
      render: (bus) => (
        <div>
          <span className="font-bold text-gray-900 block">{bus.busName}</span>
          <span className="font-mono text-xs text-gray-500">{bus.busNumber}</span>
        </div>
      ),
    },
    {
      key: 'busType',
      header: 'Type',
      sortable: true,
      render: (bus) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800">
          {bus.busType?.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'totalSeats',
      header: 'Capacity',
      sortable: true,
      render: (bus) => (
        <span className="text-gray-900 font-semibold">{bus.totalSeats} seats</span>
      ),
    },
    {
      key: 'operatorName',
      header: 'Operator',
      sortable: true,
      render: (bus) => <span className="font-medium text-gray-800">{bus.operatorName}</span>,
    },
    {
      key: 'busAmenities',
      header: 'Amenities',
      render: (bus) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {(bus.busAmenities || []).slice(0, 3).map((amenity, i) => (
            <span
              key={i}
              className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium"
            >
              {amenity.replace('_', ' ')}
            </span>
          ))}
          {(bus.busAmenities || []).length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
              +{bus.busAmenities!.length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (bus) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEdit(bus)}
            className="h-8 w-8 p-0"
            title="Edit bus"
            aria-label={`Edit ${bus.busName}`}
          >
            <Edit size={16} className="text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setBusToDelete(bus)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Delete bus"
            aria-label={`Delete ${bus.busName}`}
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
            <BusIcon className="w-6 h-6 text-primary" />
            Fleet Buses Management
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Register and configure passenger coaches, seating layout, and amenity profiles.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus size={18} />}
        >
          Add Bus
        </Button>
      </div>

      {/* Enterprise DataTable */}
      <DataTable<Bus>
        data={buses}
        columns={columns}
        totalRecords={totalRecords}
        page={currentPage}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setItemsPerPage(size);
          setCurrentPage(1);
        }}
        sortColumn={sortColumn}
        sortOrder={orderBy === OrderBy.ASC ? 'ASC' : 'DESC'}
        onSort={handleSort}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search by bus name, reg number, or operator..."
        keyExtractor={(bus) => bus.id || bus.busNumber || Math.random()}
        emptyMessage="No buses found in fleet"
        emptySubtext="Add your first bus or adjust search filters."
        emptyAction={
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
            Add First Bus
          </Button>
        }
      />

      {/* Add / Edit Bus Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={closeModal}
        title={selectedBus ? 'Edit Bus Details' : 'Register New Bus'}
        description="Provide vehicle specifications, seating capacity, and onboard amenities."
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Bus Name"
            value={formData.busName}
            onChange={(e) => setFormData({ ...formData, busName: e.target.value })}
            placeholder="e.g. Scania Multi-Axle Diamond"
            error={formErrors.busName}
            required
            fullWidth
          />

          <Input
            label="Registration / Bus Number"
            value={formData.busNumber}
            onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
            placeholder="e.g. KA-01-EQ-9876"
            error={formErrors.busNumber}
            required
            fullWidth
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bus Type
              </label>
              <select
                value={formData.busType}
                onChange={(e) =>
                  setFormData({ ...formData, busType: e.target.value as any })
                }
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-primary focus:border-primary"
              >
                <option value="AC">AC Seater</option>
                <option value="NON_AC">Non-AC Seater</option>
                <option value="SLEEPER">AC Sleeper</option>
                <option value="SEMI_SLEEPER">Semi-Sleeper</option>
              </select>
            </div>

            <Input
              label="Total Seats"
              type="number"
              value={formData.totalSeats.toString()}
              onChange={(e) =>
                setFormData({ ...formData, totalSeats: parseInt(e.target.value) || 0 })
              }
              error={formErrors.totalSeats}
              min="1"
              max="80"
              required
              fullWidth
            />
          </div>

          <Input
            label="Fleet Operator"
            value={formData.operatorName}
            onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })}
            placeholder="e.g. SRS Travels / VRL Logistics"
            error={formErrors.operatorName}
            required
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Onboard Amenities
            </label>
            <Select
              isMulti
              options={amenityOptions}
              value={amenityOptions.filter((opt) =>
                formData.busAmenities.includes(opt.value)
              )}
              onChange={(selected) => {
                setFormData({
                  ...formData,
                  busAmenities: selected ? selected.map((s) => s.value) : [],
                });
              }}
              className="text-sm"
              classNamePrefix="select"
              placeholder="Select available amenities..."
            />
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
              {selectedBus ? 'Save Changes' : 'Register Bus'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!busToDelete}
        onClose={() => setBusToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Fleet Bus"
        message={`Are you sure you want to delete bus "${busToDelete?.busName}" (${busToDelete?.busNumber})? This vehicle will be removed from all future timetable assignments.`}
        confirmText="Delete Bus"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default BusesPage;