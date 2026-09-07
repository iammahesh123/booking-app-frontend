import React, { useEffect, useState, useCallback } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Clock,
  ArrowRight,
  Route as RouteIcon,
  Eye,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import DataTable, { ColumnDef } from '../../components/ui/DataTable';
import { Route, Stop, OrderBy } from '../../data/types';
import {
  createRoute,
  createStop,
  deleteRoute,
  fetchRoutes,
  updateRoute,
  updateStop,
} from '../../apiConfig/Bus';
import toast from 'react-hot-toast';

export const RoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [routeToDelete, setRouteToDelete] = useState<Route | null>(null);
  const [viewingStopsRoute, setViewingStopsRoute] = useState<Route | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination & sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortColumn, setSortColumn] = useState<string>('sourceCity');
  const [orderBy, setOrderBy] = useState<OrderBy>(OrderBy.ASC);

  const [formData, setFormData] = useState({
    id: 0,
    sourceCity: '',
    destinationCity: '',
    distance: 0,
    duration: '',
    stops: [] as Stop[],
  });

  const fetchRoutesData = useCallback(async () => {
    try {
      setLoading(true);
      const { data, totalPages: pages, totalRecords: records } = await fetchRoutes(
        currentPage - 1,
        itemsPerPage,
        sortColumn,
        orderBy
      );
      setRoutes(data || []);
      setTotalPages(pages || 1);
      setTotalRecords(records || 0);
    } catch (err) {
      toast.error('Failed to load transit routes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, sortColumn, orderBy]);

  useEffect(() => {
    fetchRoutesData();
  }, [fetchRoutesData]);

  // Client-side search match fallback across active pages
  const displayRoutes = searchTerm
    ? routes.filter(
        (r) =>
          r.sourceCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.destinationCity.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : routes;

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setOrderBy(orderBy === OrderBy.ASC ? OrderBy.DESC : OrderBy.ASC);
    } else {
      setSortColumn(columnKey);
      setOrderBy(OrderBy.ASC);
    }
    setCurrentPage(1);
  };

  const handleStopChange = (index: number, field: keyof Stop, value: string | number) => {
    const updated = [...formData.stops];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setFormData({ ...formData, stops: updated });
  };

  const handleAddStop = () => {
    setFormData({
      ...formData,
      stops: [
        ...formData.stops,
        {
          id: 0,
          stopName: '',
          arrivalTime: '',
          departureTime: '',
          distance: 0,
        },
      ],
    });
  };

  const handleRemoveStop = (index: number) => {
    setFormData({
      ...formData,
      stops: formData.stops.filter((_, i) => i !== index),
    });
  };

  const saveStopsConcurrent = async (stops: Stop[]): Promise<number[]> => {
    const promises = stops.map(async (stop) => {
      const stopData = {
        stopName: stop.stopName,
        arrivalTime: stop.arrivalTime,
        departureTime: stop.departureTime,
        distance: stop.distance,
      };

      if (stop.id && stop.id > 0) {
        const res = await updateStop(stop.id, stopData);
        return res.id;
      } else {
        const res = await createStop(stopData);
        return res.id;
      }
    });

    return Promise.all(promises);
  };

  const handleSaveRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sourceCity.trim() || !formData.destinationCity.trim()) {
      toast.error('Source and Destination cities are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const stopIds = await saveStopsConcurrent(formData.stops);

      const routeData = {
        id: formData.id || 0,
        sourceCity: formData.sourceCity.trim(),
        destinationCity: formData.destinationCity.trim(),
        totalDistance: formData.distance,
        totalDuration: formData.duration,
        stopIds,
      };

      if (selectedRoute?.id) {
        const updated = await updateRoute(selectedRoute.id, routeData);
        setRoutes((prev) => prev.map((r) => (r.id === selectedRoute.id ? updated : r)));
        toast.success('Route updated successfully');
      } else {
        const created = await createRoute(routeData);
        setRoutes((prev) => [created, ...prev]);
        setTotalRecords((prev) => prev + 1);
        toast.success('New corridor route registered');
      }

      closeModal();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save route');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!routeToDelete?.id) return;
    try {
      setIsSubmitting(true);
      await deleteRoute(routeToDelete.id);
      setRoutes((prev) => prev.filter((r) => r.id !== routeToDelete.id));
      setTotalRecords((prev) => Math.max(0, prev - 1));
      toast.success('Route deleted successfully');
      setRouteToDelete(null);
    } catch (err) {
      toast.error('Failed to delete route. Active schedules may depend on it.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setSelectedRoute(null);
    setFormData({
      id: 0,
      sourceCity: '',
      destinationCity: '',
      distance: 0,
      duration: '',
      stops: [],
    });
  };

  const openEdit = (route: Route) => {
    setSelectedRoute(route);
    setFormData({
      id: route.id || 0,
      sourceCity: route.sourceCity || '',
      destinationCity: route.destinationCity || '',
      distance: route.totalDistance || 0,
      duration: route.totalDuration || '',
      stops:
        route.stops?.map((s) => ({
          id: s.id || 0,
          stopName: s.stopName || '',
          arrivalTime: s.arrivalTime || '',
          departureTime: s.departureTime || '',
          distance: s.distance || 0,
        })) || [],
    });
    setShowAddModal(true);
  };

  const columns: ColumnDef<Route>[] = [
    {
      key: 'sourceCity',
      header: 'Route Corridor',
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-primary flex-shrink-0" />
          <div className="font-semibold text-gray-900 text-sm">
            {r.sourceCity}{' '}
            <span className="text-gray-400 font-normal mx-1">→</span>{' '}
            {r.destinationCity}
          </div>
        </div>
      ),
    },
    {
      key: 'stops',
      header: 'Waypoints',
      render: (r) => {
        const count = r.stops?.length || 0;
        return (
          <button
            onClick={() => setViewingStopsRoute(r)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <Eye size={12} />
            <span>{count === 0 ? 'Direct (No stops)' : `${count} Stop${count > 1 ? 's' : ''}`}</span>
          </button>
        );
      },
    },
    {
      key: 'totalDistance',
      header: 'Distance',
      sortable: true,
      render: (r) => <span className="font-medium text-gray-800">{r.totalDistance} km</span>,
    },
    {
      key: 'totalDuration',
      header: 'Est. Duration',
      sortable: true,
      render: (r) => (
        <span className="inline-flex items-center gap-1 text-gray-700 text-xs font-medium">
          <Clock size={13} className="text-gray-400" />
          {r.totalDuration}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEdit(r)}
            className="h-8 w-8 p-0"
            title="Edit route"
            aria-label="Edit route"
          >
            <Edit size={16} className="text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRouteToDelete(r)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Delete route"
            aria-label="Delete route"
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
            <RouteIcon className="w-6 h-6 text-primary" />
            Transit Routes & Corridors
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Configure origin/destination cities, intermediate pickup waypoints, and distance calculations.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus size={18} />}
        >
          Add Route
        </Button>
      </div>

      <DataTable<Route>
        data={displayRoutes}
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
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search routes by origin or destination city..."
        keyExtractor={(r) => r.id}
        emptyMessage="No routes found"
        emptySubtext="Add your first transit route or adjust query filters."
        emptyAction={
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
            Add First Route
          </Button>
        }
      />

      {/* Add / Edit Route Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={closeModal}
        title={selectedRoute ? 'Edit Route Corridor' : 'Register New Route'}
        description="Specify start/end cities, driving distance, and sequential waypoints."
        size="lg"
      >
        <form onSubmit={handleSaveRoute} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Source / Origin City"
              value={formData.sourceCity}
              onChange={(e) => setFormData({ ...formData, sourceCity: e.target.value })}
              placeholder="e.g. Bengaluru"
              required
              fullWidth
            />
            <Input
              label="Destination City"
              value={formData.destinationCity}
              onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
              placeholder="e.g. Hyderabad"
              required
              fullWidth
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Total Distance (km)"
              type="number"
              value={formData.distance.toString()}
              onChange={(e) =>
                setFormData({ ...formData, distance: parseFloat(e.target.value) || 0 })
              }
              placeholder="e.g. 560"
              required
              fullWidth
            />
            <Input
              label="Estimated Duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g. 8h 30m"
              required
              fullWidth
            />
          </div>

          {/* Intermediate Stops Section */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-gray-900">
                Intermediate Waypoints & Stops ({formData.stops.length})
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddStop}
                leftIcon={<Plus size={14} />}
              >
                Add Stop
              </Button>
            </div>

            {formData.stops.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-2">
                No intermediate stops added. Route is direct.
              </p>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {formData.stops.map((stop, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-center text-xs"
                  >
                    <div className="sm:col-span-1">
                      <input
                        type="text"
                        value={stop.stopName}
                        onChange={(e) => handleStopChange(idx, 'stopName', e.target.value)}
                        placeholder="Stop name"
                        className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="time"
                        value={stop.arrivalTime}
                        onChange={(e) => handleStopChange(idx, 'arrivalTime', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <input
                        type="time"
                        value={stop.departureTime}
                        onChange={(e) => handleStopChange(idx, 'departureTime', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <input
                        type="number"
                        value={stop.distance}
                        onChange={(e) =>
                          handleStopChange(idx, 'distance', parseFloat(e.target.value) || 0)
                        }
                        placeholder="km"
                        className="w-16 px-2 py-1.5 border border-gray-300 rounded bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveStop(idx)}
                        className="text-red-500 hover:text-red-700 ml-2"
                        title="Remove stop"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              {selectedRoute ? 'Save Changes' : 'Create Route'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Inspect Stops Modal */}
      <Modal
        isOpen={!!viewingStopsRoute}
        onClose={() => setViewingStopsRoute(null)}
        title={`Waypoints: ${viewingStopsRoute?.sourceCity} → ${viewingStopsRoute?.destinationCity}`}
        size="md"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 pb-2 border-b border-gray-100">
            <span>Total Distance: {viewingStopsRoute?.totalDistance} km</span>
            <span>•</span>
            <span>Est. Duration: {viewingStopsRoute?.totalDuration}</span>
          </div>

          {(viewingStopsRoute?.stops || []).length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">
              This route runs direct without intermediate waypoints.
            </p>
          ) : (
            <div className="relative pl-6 space-y-4 border-l-2 border-primary/30 my-3">
              {viewingStopsRoute?.stops?.map((stop, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-primary border-2 border-white shadow-xs" />
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                    <p className="font-bold text-gray-900 text-sm">{stop.stopName}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>Arr: {stop.arrivalTime || 'N/A'}</span>
                      <span>Dep: {stop.departureTime || 'N/A'}</span>
                      <span>Offset: {stop.distance} km</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => setViewingStopsRoute(null)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!routeToDelete}
        onClose={() => setRouteToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Route Corridor"
        message={`Are you sure you want to delete the route "${routeToDelete?.sourceCity} → ${routeToDelete?.destinationCity}"? Active timetable schedules associated with this route must be updated.`}
        confirmText="Delete Route"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default RoutesPage;