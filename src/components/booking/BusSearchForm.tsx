import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';

// Popular Indian cities for demo
const CITIES = [
  { value: 'delhi', label: 'Delhi' },
  { value: 'mumbai', label: 'Mumbai' },
  { value: 'bangalore', label: 'Bangalore' },
  { value: 'hyderabad', label: 'Hyderabad' },
  { value: 'chennai', label: 'Chennai' },
  { value: 'kolkata', label: 'Kolkata' },
  { value: 'pune', label: 'Pune' },
  { value: 'jaipur', label: 'Jaipur' },
  { value: 'ahmedabad', label: 'Ahmedabad' },
  { value: 'kochi', label: 'Kochi' },
];

interface BusSearchFormProps {
  className?: string;
  compact?: boolean;
}

const BusSearchForm: React.FC<BusSearchFormProps> = ({ 
  className = '',
  compact = false
}) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(formatDate(new Date()));
  
  const navigate = useNavigate();
  
  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?source=${source}&destination=${destination}&date=${date}`);
  };
  
  return (
    <form onSubmit={handleSubmit} className={`${className}`}>
      <div className={`${compact ? 'grid gap-3' : 'grid gap-5 md:grid-cols-4 md:gap-4'}`}>
        <div className={`${compact ? '' : 'md:col-span-1'}`}>
          <Select
            label={compact ? undefined : "From"}
            placeholder="Select departure city"
            options={CITIES}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
            fullWidth
          />
        </div>
        
        <div className={`${compact ? '' : 'md:col-span-1'}`}>
          <Select
            label={compact ? undefined : "To"}
            placeholder="Select arrival city"
            options={CITIES}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            fullWidth
          />
        </div>
        
        <div className={`${compact ? '' : 'md:col-span-1'}`}>
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
        
        <div className={`${compact ? '' : 'md:col-span-1'} flex items-end`}>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size={compact ? 'sm' : 'lg'}
            leftIcon={<Search size={compact ? 16 : 18} />}
          >
            {compact ? 'Search' : 'Search Buses'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BusSearchForm;