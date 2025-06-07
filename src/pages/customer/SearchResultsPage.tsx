import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import BusSearchForm from '../../components/booking/BusSearchForm';
import BusList from '../../components/booking/BusList';
import SeatLayout from '../../components/booking/SeatLayout'; // Import the SeatLayout component
import { Bus, Route, Schedule, Seat } from '../../types';
import { fetchBuses, fetchRoutes, fetchSchedules } from '../../apiConfig/Bus';

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [source] = useState(queryParams.get('source') || '');
  const [destination] = useState(queryParams.get('destination') || '');
  const [date] = useState(queryParams.get('date') || formatCurrentDate());

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


  const fetchSeats = async (scheduleId: number): Promise<Seat[]> => {
  try {
    const response = await fetch(`http://localhost:8080/bus-seats/view-seats/${scheduleId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch seats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching seats:', error);
    return [];
  }
};

const handleSeatView = async (schedule: Schedule) => {
  setIsLoading(true);
  try {
    const seats = await fetchSeats(schedule.id);
    console.log('seats', seats);
    const updatedSchedule = { ...schedule, seats }; // Add seats to the schedule
    setSelectedSchedule(updatedSchedule);
    setSelectedSeats([]); // Reset selected seats when viewing a new schedule
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

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [schedulesData, busesData, routesData] = await Promise.all([
          fetchSchedules(source, destination, date),
          fetchBuses(),
          fetchRoutes()
        ]);
        setSchedules(schedulesData);
        setBuses(busesData);
        setRoutes(routesData);
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