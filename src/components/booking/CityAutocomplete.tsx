import React, { useState, useRef, useEffect, useId } from 'react';
import { MapPin, X, ChevronDown, Check, Sparkles } from 'lucide-react';

export interface CityOption {
  value: string;
  label: string;
  state?: string;
  isPopular?: boolean;
}

interface CityAutocompleteProps {
  id?: string;
  label: string;
  sublabel?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  cities: CityOption[];
  loading?: boolean;
  error?: string;
  type?: 'origin' | 'destination';
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const POPULAR_DEFAULT_CITIES: CityOption[] = [
  { value: 'Hyderabad', label: 'Hyderabad', state: 'Telangana', isPopular: true },
  { value: 'Bangalore', label: 'Bangalore', state: 'Karnataka', isPopular: true },
  { value: 'Chennai', label: 'Chennai', state: 'Tamil Nadu', isPopular: true },
  { value: 'Mumbai', label: 'Mumbai', state: 'Maharashtra', isPopular: true },
  { value: 'Pune', label: 'Pune', state: 'Maharashtra', isPopular: true },
  { value: 'Delhi', label: 'Delhi', state: 'Delhi NCR', isPopular: true },
  { value: 'Visakhapatnam', label: 'Visakhapatnam', state: 'Andhra Pradesh', isPopular: true },
  { value: 'Vijayawada', label: 'Vijayawada', state: 'Andhra Pradesh', isPopular: true },
  { value: 'Coimbatore', label: 'Coimbatore', state: 'Tamil Nadu', isPopular: true },
  { value: 'Jaipur', label: 'Jaipur', state: 'Rajasthan', isPopular: true },
  { value: 'Goa', label: 'Goa', state: 'Goa', isPopular: true },
  { value: 'Kolkata', label: 'Kolkata', state: 'West Bengal', isPopular: true },
];

const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  id,
  label,
  sublabel,
  placeholder = 'Enter city...',
  value,
  onChange,
  cities = [],
  loading = false,
  error,
  type = 'origin',
  required = false,
  disabled = false,
  className = '',
}) => {
  const generatedId = useId();
  const inputId = id || `city-autocomplete-${generatedId}`;
  const listboxId = `city-listbox-${generatedId}`;
  const labelId = `city-label-${generatedId}`;

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // Fallback to default popular cities if list is empty
  const cityPool: CityOption[] = cities.length > 0 ? cities : POPULAR_DEFAULT_CITIES;

  // Selected city object to get state info
  const selectedCityObj = React.useMemo(() => {
    if (!value) return null;
    return cityPool.find((c) => c.value.toLowerCase() === value.toLowerCase());
  }, [value, cityPool]);

  // Sync internal searchTerm when value changes externally
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Filter cities by search term
  const filteredCities = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return cityPool;
    }
    const query = searchTerm.toLowerCase().trim();
    return cityPool.filter(
      (c) =>
        c.label.toLowerCase().includes(query) ||
        (c.state && c.state.toLowerCase().includes(query))
    );
  }, [searchTerm, cityPool]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
        if (value && searchTerm !== value) {
          setSearchTerm(value);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value, searchTerm]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listboxRef.current) {
      const activeEl = listboxRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setIsOpen(true);
    setActiveIndex(0);
    if (!val) {
      onChange('');
    }
  };

  const handleSelectCity = (city: CityOption) => {
    onChange(city.value);
    setSearchTerm(city.label);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
    setIsOpen(true);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(0);
        } else {
          setActiveIndex((prev) => (prev < filteredCities.length - 1 ? prev + 1 : 0));
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(filteredCities.length - 1);
        } else {
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredCities.length - 1));
        }
        break;

      case 'Enter':
        if (isOpen && activeIndex >= 0 && filteredCities[activeIndex]) {
          e.preventDefault();
          handleSelectCity(filteredCities[activeIndex]);
        }
        break;

      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
          setActiveIndex(-1);
          setSearchTerm(value);
        }
        break;

      case 'Tab':
        if (isOpen && activeIndex >= 0 && filteredCities[activeIndex]) {
          handleSelectCity(filteredCities[activeIndex]);
        } else {
          setIsOpen(false);
        }
        break;

      default:
        break;
    }
  };

  const isOrigin = type === 'origin';
  const iconBg = isOrigin ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600';
  const dotColor = isOrigin ? 'bg-emerald-500 ring-emerald-200' : 'bg-rose-500 ring-rose-200';

  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="font-bold text-primary underline decoration-primary/30">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div ref={containerRef} className={`relative flex flex-col ${className}`}>
      {/* Clickable Tile Container */}
      <div
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            inputRef.current?.focus();
          }
        }}
        className={`
          relative rounded-2xl p-3 sm:p-3.5 transition-all duration-200 cursor-text
          border ${error ? 'border-red-400 bg-red-50/20' : isOpen ? 'border-primary ring-2 ring-primary/20 bg-blue-50/20' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-slate-50/60'}
          shadow-xs
        `}
      >
        {/* Label & Indicator Row */}
        <div className="flex items-center justify-between mb-1">
          <label
            id={labelId}
            htmlFor={inputId}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 cursor-pointer"
          >
            <span
              className={`w-2 h-2 rounded-full ${dotColor} inline-block ring-2 shadow-xs`}
              aria-hidden="true"
            />
            {label}
            {required && <span className="text-red-500" aria-hidden="true">*</span>}
          </label>

          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            {isOrigin ? 'Boarding' : 'Dropping'}
          </span>
        </div>

        {/* Input & Icon Row */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}
            aria-hidden="true"
          >
            <MapPin size={16} />
          </div>

          <div className="flex-1 min-w-0">
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              role="combobox"
              aria-expanded={isOpen}
              aria-autocomplete="list"
              aria-controls={isOpen ? listboxId : undefined}
              aria-activedescendant={
                isOpen && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
              }
              aria-labelledby={labelId}
              aria-required={required}
              aria-invalid={Boolean(error)}
              placeholder={loading ? 'Loading...' : placeholder}
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => {
                setIsOpen(true);
                if (filteredCities.length > 0 && activeIndex === -1) {
                  setActiveIndex(0);
                }
              }}
              onKeyDown={handleKeyDown}
              disabled={disabled || loading}
              autoComplete="off"
              className="w-full bg-transparent p-0 text-base sm:text-lg font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none truncate"
            />

            {/* Subtitle / State hint */}
            <div className="text-[11px] text-gray-400 truncate mt-0.5">
              {selectedCityObj?.state
                ? `${selectedCityObj.state}, India`
                : sublabel || (isOrigin ? 'Select departure city' : 'Select arrival destination')}
            </div>
          </div>

          {/* Action buttons (Clear / Dropdown) */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {searchTerm && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                aria-label={`Clear ${label}`}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={15} />
              </button>
            )}
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`}
            />
          </div>
        </div>
      </div>

      {/* Screen Reader Announcement */}
      <div className="sr-only" aria-live="polite">
        {isOpen ? `${filteredCities.length} cities available.` : ''}
      </div>

      {/* Error text */}
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium px-1" role="alert">
          {error}
        </p>
      )}

      {/* Floating Suggestions Dropdown */}
      {isOpen && !disabled && (
        <div
          className="absolute z-50 left-0 right-0 top-[calc(100%+6px)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-80 flex flex-col animate-fadeIn"
          style={{ minWidth: '280px' }}
        >
          {/* Quick Popular Pills (When query is short) */}
          {searchTerm.length <= 1 && (
            <div className="p-3 bg-slate-50 border-b border-gray-100">
              <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                <Sparkles size={13} className="text-amber-500" /> Popular Cities
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_DEFAULT_CITIES.slice(0, 6).map((city) => (
                  <button
                    key={`pop-${city.value}`}
                    type="button"
                    onClick={() => handleSelectCity(city)}
                    className="px-2.5 py-1 text-xs font-semibold bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all shadow-2xs"
                  >
                    {city.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtered Cities List */}
          <ul
            id={listboxId}
            ref={listboxRef}
            role="listbox"
            aria-label={`${label} options`}
            className="overflow-y-auto divide-y divide-gray-50 py-1.5"
          >
            {filteredCities.length === 0 ? (
              <li className="px-5 py-6 text-center text-sm text-gray-500">
                <p className="font-semibold text-gray-700">No matching cities found</p>
                <p className="text-xs text-gray-400 mt-1">Try searching another city name</p>
              </li>
            ) : (
              filteredCities.map((city, index) => {
                const isSelected = value.toLowerCase() === city.value.toLowerCase();
                const isHighlighted = index === activeIndex;

                return (
                  <li
                    key={`${city.value}-${index}`}
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectCity(city)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`
                      px-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors text-sm
                      ${isHighlighted ? 'bg-blue-50/80 text-primary' : 'text-gray-800 hover:bg-gray-50'}
                      ${isSelected ? 'font-bold text-primary bg-blue-50/60' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isSelected
                            ? 'bg-primary text-white'
                            : isHighlighted
                            ? 'bg-blue-100 text-primary'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <MapPin size={13} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-medium">
                          {renderHighlightedText(city.label, searchTerm)}
                        </span>
                        {city.state && (
                          <span className="text-[11px] text-gray-400">{city.state}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {city.isPopular && (
                        <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">
                          Popular
                        </span>
                      )}
                      {isSelected && (
                        <Check size={16} className="text-primary font-bold" aria-hidden="true" />
                      )}
                    </div>
                  </li>
                );
              })
            )}
          </ul>

          {/* Keyboard navigation footer */}
          <div className="px-4 py-2 bg-slate-50 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
            <span>↑ ↓ to navigate</span>
            <span>↵ Select • Esc Close</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityAutocomplete;
