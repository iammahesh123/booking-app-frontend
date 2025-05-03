import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import BusSearchForm from '../../components/booking/BusSearchForm';
import BusList from '../../components/booking/BusList';
import { Schedule, Bus, Route } from '../../types';
import { mockSchedules, mockBuses, mockRoutes } from '../../components/utils/MockData';

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [source, setSource] = useState(queryParams.get('source') || '');
  const [destination, setDestination] = useState(queryParams.get('destination') || '');
  const [date, setDate] = useState(queryParams.get('date') || formatCurrentDate());
  
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  function formatCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Fetch schedules (in a real app, this would be an API call)
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      // Filter schedules by source and destination
      const filteredSchedules = mockSchedules.filter(schedule => {
        if (!source && !destination) return true;
        
        const route = mockRoutes.find(r => r.id === schedule.routeId);
        
        const sourceMatches = !source || route?.source.toLowerCase() === source.toLowerCase();
        const destinationMatches = !destination || route?.destination.toLowerCase() === destination.toLowerCase();
        
        return sourceMatches && destinationMatches;
      });
      
      setSchedules(filteredSchedules);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
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
            />
          </div>
          
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-600">Looking for buses...</p>
            </div>
          ) : (
            <BusList 
              schedules={schedules} 
              buses={mockBuses} 
              routes={mockRoutes}
              date={date} 
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResultsPage;