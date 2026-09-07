import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, ArrowLeftRight, Sparkles } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { fetchCities } from '../../apiConfig/Bus';
import toast from 'react-hot-toast';

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
          value: city,
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

  // Synchronize when initial props change
  useEffect(() => {
    if (initialSource) setSource(initialSource);
    if (initialDestination) setDestination(initialDestination);
    if (initialDate) setDate(initialDate);
  }, [initialSource, initialDestination, initialDate]);

  const handleSwapCities = (e: React.MouseEvent) => {
    e.preventDefault();
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const setQuickDate = (daysFromToday: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromToday);
    setDate(formatDate(d));
  };

  const todayStr = formatDate(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = formatDate(tomorrow);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!source || !destination || !date) {
      toast.error('Please select source, destination, and travel date.');
      return;
    }

    if (source.toLowerCase() === destination.toLowerCase()) {
      toast.error('Source and Destination cannot be the same city.');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      if (onSearch) {
        await onSearch(source, destination, date);
      } else {
        navigate(`/search?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&date=${date}`);
      }
    } catch (err) {
      console.error('Error performing search:', err);
      toast.error('Failed to search buses. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${className} space-y-3`}>
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className={`relative ${compact ? 'flex flex-col gap-3' : 'grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-end'}`}>
        {/* Source City */}
        <div className={compact ? 'w-full' : 'md:col-span-3'}>
          <Select
            label={compact ? undefined : "From"}
            placeholder={loading ? "Loading..." : "Departure City"}
            options={cities}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
            fullWidth
            disabled={loading}
          />
        </div>

        {/* Swap Button */}
        <div className={compact ? 'flex justify-center -my-1' : 'md:col-span-1 flex justify-center pb-2'}>
          <button
            type="button"
            onClick={handleSwapCities}
            title="Swap departure and arrival cities"
            className="p-2.5 rounded-full border border-gray-200 bg-white hover:bg-blue-50 text-gray-500 hover:text-primary transition-all shadow-sm hover:scale-110 active:scale-95"
          >
            <ArrowLeftRight size={16} className="transition-transform duration-200" />
          </button>
        </div>

        {/* Destination City */}
        <div className={compact ? 'w-full' : 'md:col-span-3'}>
          <Select
            label={compact ? undefined : "To"}
            placeholder={loading ? "Loading..." : "Arrival City"}
            options={cities}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            fullWidth
            disabled={loading}
          />
        </div>

        {/* Journey Date */}
        <div className={compact ? 'w-full' : 'md:col-span-3'}>
          <Input
            label={compact ? undefined : "Date of Journey"}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={todayStr}
            required
            fullWidth
            leftIcon={<Calendar size={16} className="text-gray-400" />}
          />
        </div>

        {/* Search Submit */}
        <div className={compact ? 'w-full pt-1' : 'md:col-span-2'}>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size={compact ? 'sm' : 'lg'}
            leftIcon={<Search size={compact ? 16 : 18} />}
            disabled={loading || isSearching}
            className="shadow-md hover:shadow-lg transition-all"
          >
            {isSearching ? 'Searching...' : compact ? 'Search' : 'Find Buses'}
          </Button>
        </div>
      </div>

      {/* Quick Date Chips */}
      {!compact && (
        <div className="flex items-center gap-2 pt-1 text-xs text-gray-600">
          <span className="flex items-center gap-1 text-gray-400 font-medium">
            <Sparkles size={13} /> Quick dates:
          </span>
          <button
            type="button"
            onClick={() => setQuickDate(0)}
            className={`px-2.5 py-1 rounded-md transition-colors border ${
              date === todayStr
                ? 'bg-blue-50 border-primary text-primary font-semibold'
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setQuickDate(1)}
            className={`px-2.5 py-1 rounded-md transition-colors border ${
              date === tomorrowStr
                ? 'bg-blue-50 border-primary text-primary font-semibold'
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
            }`}
          >
            Tomorrow
          </button>
        </div>
      )}
    </form>
  );
};

export default BusSearchForm;