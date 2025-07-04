import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import BusSearchForm from '../../components/booking/BusSearchForm';
import BusList from '../../components/booking/BusList';
import SeatLayout from '../../components/booking/SeatLayout';
import { Bus, OrderBy, Route, Schedule, Seat } from '../../data/types';
import { busApi, fetchRoutes, fetchSchedules, fetchSeats } from '../../apiConfig/Bus';

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [source, setSource] = useState(queryParams.get('source') || '');
  const [destination, setDestination] = useState(queryParams.get('destination') || '');
  const [date, setDate] = useState(queryParams.get('date') || formatCurrentDate());

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  function formatCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleSearch = (newSource: string, newDestination: string, newDate: string) => {
    // Update the state
    setSource(newSource);
    setDestination(newDestination);
    setDate(newDate);
    
    // Update the URL
    navigate(`/search?source=${newSource}&destination=${newDestination}&date=${newDate}`, {
      replace: true
    });
    
    // Reset the selected schedule when a new search is performed
    setSelectedSchedule(null);
    setSelectedSeats([]);
  };

  const handleSeatView = async (schedule: Schedule) => {
    setIsLoading(true);
    try {
      const seats = await fetchSeats(schedule.id);
      const updatedSchedule: Schedule = { 
        ...schedule, 
        seats: seats 
      };
      setSelectedSchedule(updatedSchedule);
      setSelectedSeats([]);
    } catch (error) {
      console.error('Error loading seats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeatSelect = (seat: Seat) => {
    setSelectedSeats(prev => [...prev, seat]);
  };

  const handleSeatDeselect = (seat: Seat) => {
    setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
  };

  const handleBackToResults = () => {
    setSelectedSchedule(null);
    setSelectedSeats([]);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [schedulesData, busesData, routesData] = await Promise.all([
          fetchSchedules(source, destination, date),
          busApi.getAll(),
          fetchRoutes(1, 100, 'id', OrderBy.ASC) 
        ]);
        setSchedules(schedulesData);
        setBuses(busesData);
        setRoutes(routesData.data || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [source, destination, date]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-medium mb-4">Modify Search</h2>
            <BusSearchForm
              compact={true}
              initialSource={source}
              initialDestination={destination}
              initialDate={date}
              onSearch={handleSearch}
            />
          </div>

          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-600">Looking for buses...</p>
            </div>
          ) : selectedSchedule ? (
            <SeatLayout
              scheduleId={selectedSchedule.id}
              seats={selectedSchedule.seats || []}
              date={date}
              route={routes.find(r => r.id === selectedSchedule.routeId) || null}
              onSeatSelect={handleSeatSelect}
              onSeatDeselect={handleSeatDeselect}
              selectedSeats={selectedSeats}
              // onBack={handleBackToResults}
            />
          ) : (
            <BusList
              schedules={schedules}
              buses={buses}
              routes={routes}
              date={date}
              onSeatView={handleSeatView}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResultsPage;