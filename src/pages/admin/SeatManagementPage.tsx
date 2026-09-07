import React, { useState, useEffect } from 'react';
import {
  Armchair,
  Bus as BusIcon,
  Calendar,
  Eye,
  Lock,
  Unlock,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { Seat, Schedule, Bus as BusType, Route } from '../../data/types';
import { fetchAllBuses, fetchAllRoutes, fetchAllSchedules, fetchSeats } from '../../apiConfig/Bus';
import toast from 'react-hot-toast';

export const SeatManagementPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [buses, setBuses] = useState<BusType[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeatForManifest, setSelectedSeatForManifest] = useState<Seat | null>(null);

  // Fetch initial schedules, buses, routes
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const [schedData, busData, routeData] = await Promise.all([
          fetchAllSchedules(),
          fetchAllBuses(),
          fetchAllRoutes(),
        ]);
        setSchedules(schedData || []);
        setBuses(busData || []);
        setRoutes(routeData || []);

        if (schedData && schedData.length > 0) {
          handleSelectSchedule(schedData[0].id);
        }
      } catch (err) {
        toast.error('Failed to load seat dispatch data');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSelectSchedule = async (scheduleId: number) => {
    setSelectedScheduleId(scheduleId);
    try {
      setLoadingSeats(true);
      const seatList = await fetchSeats(scheduleId);
      setSeats(seatList || []);
    } catch (err) {
      toast.error('Failed to load seats for schedule');
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleToggleSeatBlock = (seatId: number) => {
    setSeats((prev) =>
      prev.map((s) => {
        if (s.id === seatId) {
          const nextStatus = s.seatStatus === 'BLOCKED' ? 'AVAILABLE' : 'BLOCKED';
          toast.success(
            `Seat ${s.seatNumber} is now ${nextStatus === 'BLOCKED' ? 'Blocked / Held' : 'Released for booking'}`
          );
          return { ...s, seatStatus: nextStatus as any };
        }
        return s;
      })
    );
  };

  const activeSchedule = schedules.find((s) => s.id === selectedScheduleId);
  const activeBus = buses.find((b) => b.id === activeSchedule?.busId);
  const activeRoute = routes.find((r) => r.id === activeSchedule?.routeId);

  // Statistics
  const totalSeatsCount = seats.length || activeSchedule?.totalSeats || 40;
  const bookedCount = seats.filter((s) => s.seatStatus === 'BOOKED').length;
  const blockedCount = seats.filter((s) => s.seatStatus === 'BLOCKED').length;
  const availableCount = Math.max(0, totalSeatsCount - bookedCount - blockedCount);
  const occupancyRate = totalSeatsCount > 0 ? Math.round((bookedCount / totalSeatsCount) * 100) : 0;

  // Organize seats into rows for realistic bus deck
  const organizedRows = () => {
    const rowsMap: { [key: number]: Seat[] } = {};
    seats.forEach((seat, idx) => {
      const rowIdx = Math.floor(idx / 4) + 1;
      if (!rowsMap[rowIdx]) rowsMap[rowIdx] = [];
      rowsMap[rowIdx].push(seat);
    });
    return Object.entries(rowsMap);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Armchair className="w-6 h-6 text-primary" />
          Seat Inventory & Passenger Manifest
        </h1>
        <p className="text-xs md:text-sm text-gray-500 mt-0.5">
          Inspect real-time bus deck occupancy, view passenger details, and hold/release operational seats.
        </p>
      </div>

      {/* Schedule Selector & Overview Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Select Trip Schedule
            </label>
            <select
              value={selectedScheduleId || ''}
              onChange={(e) => handleSelectSchedule(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm font-semibold text-gray-900 focus:ring-primary focus:border-primary"
            >
              {schedules.map((s) => {
                const b = buses.find((item) => item.id === s.busId);
                const r = routes.find((item) => item.id === s.routeId);
                return (
                  <option key={s.id} value={s.id}>
                    SCH-{s.id} : {r ? `${r.sourceCity} → ${r.destinationCity}` : `Route ${s.routeId}`} ({b?.busName || 'Bus'}) - {s.departureTime}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 text-xs">
            <span className="text-gray-500">Trip Date:</span>
            <span className="font-bold text-gray-900">
              {activeSchedule?.scheduleDate
                ? new Date(activeSchedule.scheduleDate).toLocaleDateString()
                : 'Today'}
            </span>
          </div>
        </div>
      </div>

      {/* Trip Metrics Row */}
      {activeSchedule && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
            <p className="text-xs text-gray-500 font-medium">Occupancy Rate</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{occupancyRate}%</p>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
              <div
                className="bg-primary h-1.5 rounded-full"
                style={{ width: `${occupancyRate}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
            <p className="text-xs text-emerald-600 font-medium">Available Seats</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{availableCount}</p>
            <p className="text-[11px] text-gray-400 mt-2">Open for booking</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
            <p className="text-xs text-red-600 font-medium">Booked Seats</p>
            <p className="text-2xl font-bold text-red-700 mt-1">{bookedCount}</p>
            <p className="text-[11px] text-gray-400 mt-2">Paid reservations</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
            <p className="text-xs text-amber-600 font-medium">Blocked / Held</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{blockedCount}</p>
            <p className="text-[11px] text-gray-400 mt-2">Operational hold</p>
          </div>
        </div>
      )}

      {/* Main Bus Deck Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Spatial 2D Bus Deck */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {activeBus?.busName || 'Bus Deck Layout'}
              </h3>
              <p className="text-xs text-gray-500 font-mono">
                {activeBus?.busNumber} • {activeBus?.busType} (2+2 Layout)
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-emerald-50 border border-emerald-300" />
                <span className="text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
                <span className="text-gray-600">Booked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-amber-100 border border-amber-300" />
                <span className="text-gray-600">Blocked</span>
              </div>
            </div>
          </div>

          {loadingSeats ? (
            <div className="py-20 text-center text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
              <p className="text-xs">Loading seat grid...</p>
            </div>
          ) : (
            <div className="border-2 border-gray-300 rounded-3xl p-6 bg-gray-50 max-w-md w-full relative shadow-inner">
              {/* Bus Driver Front Cabin */}
              <div className="flex justify-between items-center pb-6 mb-6 border-b border-dashed border-gray-300">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  <BusIcon size={16} /> Front Entrance
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-200 border border-gray-400 flex items-center justify-center text-[10px] font-bold text-gray-600">
                  Driver
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-4">
                {organizedRows().map(([rowKey, rowSeats]) => (
                  <div key={rowKey} className="flex justify-between items-center">
                    {/* Left Column (Seats A & B) */}
                    <div className="flex gap-2">
                      {rowSeats.slice(0, 2).map((seat) => {
                        const isBooked = seat.seatStatus === 'BOOKED';
                        const isBlocked = seat.seatStatus === 'BLOCKED';
                        const seatLabel = seat.seatNumber.includes('-')
                          ? seat.seatNumber.split('-')[1]
                          : seat.seatNumber;

                        return (
                          <button
                            key={seat.id}
                            type="button"
                            onClick={() => {
                              if (isBooked) {
                                setSelectedSeatForManifest(seat);
                              } else {
                                handleToggleSeatBlock(seat.id);
                              }
                            }}
                            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all shadow-xs border ${
                              isBooked
                                ? 'bg-red-50 border-red-300 text-red-700 hover:ring-2 hover:ring-red-400'
                                : isBlocked
                                ? 'bg-amber-50 border-amber-300 text-amber-700 hover:ring-2 hover:ring-amber-400'
                                : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 hover:scale-105'
                            }`}
                            title={`Seat ${seat.seatNumber} (${seat.seatStatus})`}
                          >
                            <span>{seatLabel}</span>
                            <span className="text-[9px] font-normal opacity-75">
                              {isBooked ? 'Booked' : isBlocked ? 'Hold' : '₹' + seat.seatPrice}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Central Walking Aisle */}
                    <div className="text-[10px] text-gray-300 font-mono tracking-widest uppercase">
                      Aisle
                    </div>

                    {/* Right Column (Seats C & D) */}
                    <div className="flex gap-2">
                      {rowSeats.slice(2, 4).map((seat) => {
                        const isBooked = seat.seatStatus === 'BOOKED';
                        const isBlocked = seat.seatStatus === 'BLOCKED';
                        const seatLabel = seat.seatNumber.includes('-')
                          ? seat.seatNumber.split('-')[1]
                          : seat.seatNumber;

                        return (
                          <button
                            key={seat.id}
                            type="button"
                            onClick={() => {
                              if (isBooked) {
                                setSelectedSeatForManifest(seat);
                              } else {
                                handleToggleSeatBlock(seat.id);
                              }
                            }}
                            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all shadow-xs border ${
                              isBooked
                                ? 'bg-red-50 border-red-300 text-red-700 hover:ring-2 hover:ring-red-400'
                                : isBlocked
                                ? 'bg-amber-50 border-amber-300 text-amber-700 hover:ring-2 hover:ring-amber-400'
                                : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 hover:scale-105'
                            }`}
                            title={`Seat ${seat.seatNumber} (${seat.seatStatus})`}
                          >
                            <span>{seatLabel}</span>
                            <span className="text-[9px] font-normal opacity-75">
                              {isBooked ? 'Booked' : isBlocked ? 'Hold' : '₹' + seat.seatPrice}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info & Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Operational Instructions</h3>
            <ul className="text-xs text-gray-600 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Click an <strong>Available seat</strong> to instantly hold/block it from customer purchase.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Click a <strong>Blocked seat</strong> to release it back into the live reservation pool.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Click any <strong>Booked seat</strong> to inspect the traveler name, contact number, and boarding stop.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Passenger Manifest Inspection Modal */}
      <Modal
        isOpen={!!selectedSeatForManifest}
        onClose={() => setSelectedSeatForManifest(null)}
        title={`Passenger Manifest — Seat ${selectedSeatForManifest?.seatNumber}`}
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2.5 text-xs">
            <div className="flex justify-between pb-2 border-b border-gray-200">
              <span className="text-gray-500">Ticket Reference:</span>
              <span className="font-mono font-bold text-primary">PNR-77821</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Primary Passenger:</span>
              <span className="font-bold text-gray-900">Ravi Shankar Verma (38, Male)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Contact Number:</span>
              <span className="font-mono font-medium text-gray-800">+91 98450 11234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Boarding Point:</span>
              <span className="font-medium text-gray-800">{activeRoute?.sourceCity} Main Depot</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ticket Fare Paid:</span>
              <span className="font-bold text-emerald-700">₹{selectedSeatForManifest?.seatPrice}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-500">Booking Status:</span>
              <StatusBadge status="confirmed" size="sm" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedSeatForManifest(null)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                toast.success('Passenger check-in confirmed');
                setSelectedSeatForManifest(null);
              }}
            >
              Confirm Boarding
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SeatManagementPage;