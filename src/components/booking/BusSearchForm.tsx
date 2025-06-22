import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { fetchCities } from '../../apiConfig/Bus'; 

interface BusSearchFormProps {
  className?: string;
  compact?: boolean;
  initialSource?: string;
  initialDestination?: string;
  initialDate?: string;
  onSearch?: (source: string, destination: string, date: string) => void;
}

interface City {
  value: string;
  label: string;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const BusSearchForm: React.FC<BusSearchFormProps> = ({ 
  className = '',
  compact = false,
  initialSource = '',
  initialDestination = '',
  initialDate = formatDate(new Date()),
   onSearch
}) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState(initialSource);
  const [destination, setDestination] = useState(initialDestination);
  const [date, setDate] = useState(initialDate);
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadCities = async () => {
      try {
        const cityNames = await fetchCities(); 
        const formattedCities = cityNames.map((city) => ({
          value: city.toLowerCase().replace(/\s+/g, '-'),
          label: city,
        }));

        setCities(formattedCities); 
        setError(null);
      } catch (err) {
        console.error('Error fetching cities:', err);
        setError('Failed to load cities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!source || !destination || !date) {
      setError('Please fill all fields');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      if (onSearch) {
        await onSearch(source, destination, date);
      } else {
        // Fallback if onSearch isn't provided
        navigate(`/search?source=${source}&destination=${destination}&date=${date}`);
      }
    } catch (err) {
      console.error('Error performing search:', err);
      setError('Failed to search buses. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${className}`}>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className={`${compact ? 'grid gap-3' : 'grid gap-5 md:grid-cols-4 md:gap-4'}`}>
        <div>
          <Select
            label={compact ? undefined : "From"}
            placeholder={loading ? "Loading cities..." : "Select departure city"}
            options={cities}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
            fullWidth
            disabled={loading}
          />
        </div>
        <div>
          <Select
            label={compact ? undefined : "To"}
            placeholder={loading ? "Loading cities..." : "Select arrival city"}
            options={cities}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            fullWidth
            disabled={loading}
          />
        </div>
        <div>
          <Input
            label={compact ? undefined : "Date of Journey"}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={formatDate(new Date())}
            required
            fullWidth
            leftIcon={compact ? undefined : <Calendar size={16} className="text-gray-500" />}
          />
        </div>
        <div className="flex items-end">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size={compact ? 'sm' : 'lg'}
            leftIcon={<Search size={compact ? 16 : 18} />}
            disabled={loading || isSearching}
          >
            {compact ? 'Search' : 'Search Buses'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BusSearchForm;