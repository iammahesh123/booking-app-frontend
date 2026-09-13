import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, ArrowLeftRight, Sparkles, Clock, History, AlertCircle, Bus } from 'lucide-react';
import Button from '../ui/Button';
import CityAutocomplete, { CityOption, POPULAR_DEFAULT_CITIES } from './CityAutocomplete';
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

interface RecentSearchItem {
  source: string;
  destination: string;
  date: string;
}

const POPULAR_ROUTE_SHORTCUTS = [
  { source: 'Hyderabad', destination: 'Bangalore' },
  { source: 'Bangalore', destination: 'Chennai' },
  { source: 'Mumbai', destination: 'Pune' },
  { source: 'Delhi', destination: 'Jaipur' },
  { source: 'Visakhapatnam', destination: 'Hyderabad' },
];

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDayDetails(dateStr: string): { dayMonth: string; weekday: string } {
  if (!dateStr) return { dayMonth: '', weekday: '' };
  const d = new Date(dateStr + 'T00:00:00');
  const dayMonth = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
  return { dayMonth, weekday };
}

const RECENT_SEARCHES_KEY = 'bluebus_recent_searches';

const BusSearchForm: React.FC<BusSearchFormProps> = ({
  className = '',
  compact = false,
  initialSource = '',
  initialDestination = '',
  initialDate = formatDate(new Date()),
  onSearch,
}) => {
  const [cityOptions, setCityOptions] = useState<CityOption[]>(POPULAR_DEFAULT_CITIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState(initialSource);
  const [destination, setDestination] = useState(initialDestination);
  const [date, setDate] = useState(initialDate);
  const [isSearching, setIsSearching] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);

  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 3));
      }
    } catch {
      // Ignore local storage errors
    }
  }, []);

  const saveRecentSearch = (src: string, dest: string, travelDate: string) => {
    try {
      const newSearch: RecentSearchItem = { source: src, destination: dest, date: travelDate };
      const filtered = recentSearches.filter(
        (item) => !(item.source.toLowerCase() === src.toLowerCase() && item.destination.toLowerCase() === dest.toLowerCase())
      );
      const updated = [newSearch, ...filtered].slice(0, 4);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore local storage errors
    }
  };

  // Load cities from API
  useEffect(() => {
    let isMounted = true;
    const loadCities = async () => {
      try {
        const cityNames = await fetchCities();
        if (isMounted && cityNames && cityNames.length > 0) {
          const uniqueNames = Array.from(new Set([...cityNames, ...POPULAR_DEFAULT_CITIES.map((c) => c.value)]));
          const formatted: CityOption[] = uniqueNames.map((city) => {
            const match = POPULAR_DEFAULT_CITIES.find((p) => p.value.toLowerCase() === city.toLowerCase());
            return {
              value: city,
              label: city,
              state: match?.state,
              isPopular: match?.isPopular || false,
            };
          });
          setCityOptions(formatted);
          setError(null);
        }
      } catch (err) {
        console.warn('API cities unavailable, utilizing default network hubs:', err);
        if (isMounted) {
          setCityOptions(POPULAR_DEFAULT_CITIES);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCities();
    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronize when initial props change
  useEffect(() => {
    if (initialSource) setSource(initialSource);
    if (initialDestination) setDestination(initialDestination);
    if (initialDate) setDate(initialDate);
  }, [initialSource, initialDestination, initialDate]);

  const handleSwapCities = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSwapping(true);
    const temp = source;
    setSource(destination);
    setDestination(temp);
    setTimeout(() => setIsSwapping(false), 350);
  };

  const setQuickDate = (daysFromToday: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromToday);
    setDate(formatDate(d));
  };

  const handleSelectRouteShortcut = (src: string, dest: string) => {
    setSource(src);
    setDestination(dest);
    toast.success(`Selected route: ${src} → ${dest}`, { id: 'route-shortcut', duration: 2000 });
  };

  const todayStr = formatDate(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = formatDate(tomorrow);

  const { dayMonth, weekday } = formatDayDetails(date);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!source.trim()) {
      toast.error('Please enter departure city (From).');
      return;
    }

    if (!destination.trim()) {
      toast.error('Please enter arrival city (To).');
      return;
    }

    if (!date) {
      toast.error('Please select journey date.');
      return;
    }

    if (source.trim().toLowerCase() === destination.trim().toLowerCase()) {
      toast.error('Departure and arrival cities cannot be the same. Please choose different cities.');
      return;
    }

    setIsSearching(true);
    setError(null);
    saveRecentSearch(source.trim(), destination.trim(), date);

    try {
      if (onSearch) {
        await onSearch(source.trim(), destination.trim(), date);
      } else {
        navigate(
          `/search?source=${encodeURIComponent(source.trim())}&destination=${encodeURIComponent(
            destination.trim()
          )}&date=${date}`
        );
      }
    } catch (err) {
      console.error('Error performing search:', err);
      toast.error('Failed to search buses. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Bus route search"
      className={`${className} space-y-3.5`}
    >
      {error && (
        <div
          role="alert"
          className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl flex items-center gap-2"
        >
          <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Search Console Grid */}
      <div
        className={`relative ${
          compact
            ? 'flex flex-col gap-3'
            : 'grid grid-cols-1 lg:grid-cols-12 gap-2.5 lg:gap-3 items-center'
        }`}
      >
        {/* Source City Tile */}
        <div className={compact ? 'w-full' : 'lg:col-span-4 relative'}>
          <CityAutocomplete
            id="search-source-city"
            label="From"
            sublabel="Boarding Point"
            type="origin"
            placeholder="Enter origin city"
            cities={cityOptions}
            value={source}
            onChange={(val) => setSource(val)}
            loading={loading}
            required
          />
        </div>

        {/* Swap Button (Floating Overlap) */}
        <div
          className={
            compact
              ? 'flex justify-center -my-2.5 relative z-20'
              : 'lg:hidden flex justify-center -my-2 relative z-20'
          }
        >
          <button
            type="button"
            onClick={handleSwapCities}
            aria-label="Swap departure and arrival cities"
            title="Swap departure and arrival cities"
            className={`
              p-2.5 rounded-full border border-gray-200 bg-white text-gray-700 
              shadow-md hover:shadow-lg hover:bg-blue-50 hover:text-primary hover:border-primary/40
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              transition-all duration-300 active:scale-90
              ${isSwapping ? 'rotate-180 text-primary bg-blue-50 border-primary' : ''}
            `}
          >
            <ArrowLeftRight size={16} />
          </button>
        </div>

        {/* Destination City Tile */}
        <div className={compact ? 'w-full' : 'lg:col-span-4 relative'}>
          {/* Desktop Overlay Swap Button */}
          {!compact && (
            <div className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-30">
              <button
                type="button"
                onClick={handleSwapCities}
                aria-label="Swap departure and arrival cities"
                title="Swap cities"
                className={`
                  w-9 h-9 rounded-full border-2 border-white bg-white text-gray-700 
                  shadow-md hover:shadow-xl hover:bg-blue-50 hover:text-primary hover:scale-110
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                  flex items-center justify-center transition-all duration-300 active:scale-95
                  ${isSwapping ? 'rotate-180 text-primary bg-blue-50' : ''}
                `}
              >
                <ArrowLeftRight size={15} />
              </button>
            </div>
          )}

          <CityAutocomplete
            id="search-dest-city"
            label="To"
            sublabel="Dropping Point"
            type="destination"
            placeholder="Enter destination city"
            cities={cityOptions}
            value={destination}
            onChange={(val) => setDestination(val)}
            loading={loading}
            required
          />
        </div>

        {/* Journey Date Tile */}
        <div className={compact ? 'w-full' : 'lg:col-span-2'}>
          <div className="relative rounded-2xl p-3 sm:p-3.5 border border-gray-200 bg-white hover:border-gray-300 hover:bg-slate-50/60 shadow-xs transition-all duration-200 cursor-pointer group">
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="search-journey-date"
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 cursor-pointer"
              >
                <Calendar size={13} className="text-primary" />
                Date
                <span className="text-red-500">*</span>
              </label>

              {/* Quick shortcut indicator */}
              <span className="text-[10px] font-bold text-primary bg-blue-50 px-1.5 py-0.2 rounded">
                {date === todayStr ? 'Today' : date === tomorrowStr ? 'Tomorrow' : 'Custom'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-primary flex items-center justify-center flex-shrink-0">
                <Calendar size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base sm:text-lg font-bold text-gray-900 truncate">
                  {dayMonth || 'Pick Date'}
                </div>
                <div className="text-[11px] text-gray-400 truncate">
                  {weekday || 'Select day'}
                </div>
              </div>
            </div>

            {/* Hidden overlay date input for accessible native picker */}
            <input
              id="search-journey-date"
              type="date"
              min={todayStr}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              aria-label="Date of Journey"
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>
        </div>

        {/* Search Submit Button */}
        <div className={compact ? 'w-full pt-1' : 'lg:col-span-2 flex items-stretch h-full'}>
          <button
            type="submit"
            disabled={isSearching}
            className="w-full h-full min-h-[58px] rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {isSearching ? (
              <span>Searching...</span>
            ) : (
              <>
                <Bus size={19} className="transition-transform group-hover:scale-110" />
                <span>SEARCH BUSES</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Date Presets + Popular Routes Strip */}
      {!compact && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-gray-100/80">
          {/* Quick Dates */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 mr-1">
              <Clock size={12} /> Quick Date:
            </span>
            <button
              type="button"
              onClick={() => setQuickDate(0)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all border ${
                date === todayStr
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-slate-50'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setQuickDate(1)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all border ${
                date === tomorrowStr
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-slate-50'
              }`}
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => setQuickDate(2)}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-slate-50 transition-all"
            >
              +2 Days
            </button>
          </div>

          {/* Popular Route Shortcuts */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 mr-1">
              <Sparkles size={12} className="text-amber-500" /> Top Routes:
            </span>
            {POPULAR_ROUTE_SHORTCUTS.slice(0, 3).map((route) => (
              <button
                key={`${route.source}-${route.destination}`}
                type="button"
                onClick={() => handleSelectRouteShortcut(route.source, route.destination)}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-primary border border-slate-200 hover:border-blue-300 transition-all"
              >
                {route.source} → {route.destination}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches (if available) */}
      {!compact && recentSearches.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
            <History size={12} /> Recent:
          </span>
          {recentSearches.map((item, idx) => (
            <button
              key={`recent-${idx}`}
              type="button"
              onClick={() => {
                setSource(item.source);
                setDestination(item.destination);
                if (item.date >= todayStr) setDate(item.date);
                toast.success(`Selected ${item.source} → ${item.destination}`);
              }}
              className="px-2 py-0.5 text-[11px] font-medium rounded bg-blue-50 text-primary border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              {item.source} → {item.destination}
            </button>
          ))}
        </div>
      )}
    </form>
  );
};

export default BusSearchForm;