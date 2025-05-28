import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, MapPin } from 'lucide-react';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { Seat, Route } from '../../types';

interface SeatLayoutProps {
  scheduleId: string;
  seats: Seat[];
  date: string;
  route: Route;
  onSeatSelect: (seat: Seat) => void;
  onSeatDeselect: (seat: Seat) => void;
  selectedSeats: Seat[];
}

const SeatLayout: React.FC<SeatLayoutProps> = ({
  scheduleId,
  seats,
  date,
  route,
  onSeatSelect,
  onSeatDeselect,
  selectedSeats
}) => {
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [sourceStop, setSourceStop] = useState<string>(route?.sourceCity || '');
  const [destinationStop, setDestinationStop] = useState<string>(route?.destinationCity || '');
  const navigate = useNavigate();
  
  if (!route) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-lg text-gray-700 mb-2">Route information not available</p>
        <p className="text-sm text-gray-500">Please try selecting a different schedule.</p>
      </div>
    );
  }
  
  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'available') {
      if (selectedSeats.find(s => s.id === seat.id)) {
        onSeatDeselect(seat);
      } else {
        onSeatSelect({...seat, status: 'selected'});
      }
    }
  };
  
  const handleProceed = () => {
    if (selectedSeats.length === 0) return;
    if (!sourceStop || !destinationStop) {
      alert('Please select both source and destination stops');
      return;
    }
    if (sourceStop === destinationStop) {
      alert('Source and destination stops cannot be the same');
      return;
    }
    
    navigate(`/booking/${scheduleId}/passengers?date=${date}&source=${sourceStop}&destination=${destinationStop}`);
  };
  
  // Group seats by rows for better layout
  const seatRows: { [key: string]: Seat[] } = {};
  seats.forEach(seat => {
    const rowNumber = seat.number.charAt(0);
    if (!seatRows[rowNumber]) {
      seatRows[rowNumber] = [];
    }
    seatRows[rowNumber].push(seat);
  });
  
  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  // Create options array including source, destination, and all stops
  const stopOptions = [
    { value: route.sourceCity, label: route.sourceCity },
    ...route.stops.map(stop => ({ value: stop.stopName, label: stop.stopName })),
    { value: route.destinationCity, label: route.destinationCity }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Select Your Seats</h3>
        <p className="text-sm text-gray-500">Click on a seat to select it</p>
      </div>
      
      <div className="p-4 border-b bg-gray-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Boarding Point"
            options={stopOptions}
            value={sourceStop}
            onChange={(e) => setSourceStop(e.target.value)}
            required
            fullWidth
            leftIcon={<MapPin size={16} className="text-gray-500" />}
          />
          <Select
            label="Dropping Point"
            options={stopOptions}
            value={destinationStop}
            onChange={(e) => setDestinationStop(e.target.value)}
            required
            fullWidth
            leftIcon={<MapPin size={16} className="text-gray-500" />}
          />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row">
        <div className="p-4 md:w-3/5">
          <div className="mb-4 flex justify-center">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-sm border border-gray-300 bg-white mr-2"></div>
                <span className="text-sm text-gray-700">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-sm bg-primary mr-2"></div>
                <span className="text-sm text-gray-700">Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-sm bg-gray-300 mr-2"></div>
                <span className="text-sm text-gray-700">Booked</span>
              </div>
            </div>
          </div>
          
          <div className="mx-auto max-w-sm">
            {/* Bus layout */}
            <div className="relative">
              {/* Driver's cabin */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="w-20 h-12 border-2 border-gray-400 rounded-t-2xl flex items-center justify-center">
                  <span className="text-xs text-gray-500">Driver</span>
                </div>
              </div>
              
              {/* Main bus body */}
              <div className="border-2 border-gray-400 rounded-lg p-6">
                {/* Door */}
                <div className="absolute -left-3 top-8 w-3 h-8 border-2 border-l-0 border-gray-400 rounded-r-lg"></div>
                
                {/* Seats container */}
                <div className="grid gap-8">
                  {Object.keys(seatRows).map(rowNumber => (
                    <div key={rowNumber} className="flex justify-center gap-8">
                      {/* Left side seats */}
                      <div className="flex gap-2">
                        {seatRows[rowNumber].slice(0, 2).map(seat => (
                          <button
                            key={seat.id}
                            className={`
                              w-10 h-10 flex items-center justify-center rounded-t-lg
                              text-sm font-medium transition-colors relative
                              ${seat.status === 'booked' ? 'bg-gray-300 cursor-not-allowed' : ''}
                              ${selectedSeats.some(s => s.id === seat.id) ? 'bg-primary text-white' : ''}
                              ${seat.status === 'available' && !selectedSeats.some(s => s.id === seat.id) ? 'bg-white border-2 border-gray-300 hover:border-primary' : ''}
                            `}
                            onClick={() => handleSeatClick(seat)}
                            onMouseEnter={() => setHoveredSeat(seat)}
                            onMouseLeave={() => setHoveredSeat(null)}
                          >
                            {seat.number}
                            {hoveredSeat?.id === seat.id && seat.status === 'available' && (
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-24 bg-black text-white text-xs py-1 px-2 rounded shadow-lg z-10">
                                ₹{seat.price}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-t-4 border-x-transparent border-t-black"></div>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                      
                      {/* Aisle */}
                      <div className="w-8"></div>
                      
                      {/* Right side seats */}
                      <div className="flex gap-2">
                        {seatRows[rowNumber].slice(2, 4).map(seat => (
                          <button
                            key={seat.id}
                            className={`
                              w-10 h-10 flex items-center justify-center rounded-t-lg
                              text-sm font-medium transition-colors relative
                              ${seat.status === 'booked' ? 'bg-gray-300 cursor-not-allowed' : ''}
                              ${selectedSeats.some(s => s.id === seat.id) ? 'bg-primary text-white' : ''}
                              ${seat.status === 'available' && !selectedSeats.some(s => s.id === seat.id) ? 'bg-white border-2 border-gray-300 hover:border-primary' : ''}
                            `}
                            onClick={() => handleSeatClick(seat)}
                            onMouseEnter={() => setHoveredSeat(seat)}
                            onMouseLeave={() => setHoveredSeat(null)}
                          >
                            {seat.number}
                            {hoveredSeat?.id === seat.id && seat.status === 'available' && (
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-24 bg-black text-white text-xs py-1 px-2 rounded shadow-lg z-10">
                                ₹{seat.price}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-t-4 border-x-transparent border-t-black"></div>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 md:w-2/5 bg-gray-50">
          <div className="space-y-4">
            <h4 className="font-medium">Booking Summary</h4>
            
            {selectedSeats.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No seats selected</p>
                <p className="text-sm text-gray-400 mt-1">Click on available seats to select</p>
              </div>
            ) : (
              <>
                <div className="bg-white p-3 rounded-md border">
                  <h5 className="font-medium mb-2">Selected Seats ({selectedSeats.length})</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map(seat => (
                      <div key={seat.id} className="flex items-center justify-between bg-gray-100 rounded px-3 py-1.5 text-sm w-full">
                        <div>
                          <span className="font-medium">{seat.number}</span>
                          <span className="text-gray-500 ml-2">{seat.type}</span>
                        </div>
                        <span className="text-primary font-medium">₹{seat.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-md border">
                  <h5 className="font-medium mb-2">Journey Details</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Boarding at:</span>
                      <span className="font-medium">{sourceStop}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Dropping at:</span>
                      <span className="font-medium">{destinationStop}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Base Fare</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Service Fee</span>
                    <span>₹50</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>GST (5%)</span>
                    <span>₹{Math.round(totalAmount * 0.05)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total Amount</span>
                    <span>₹{totalAmount + 50 + Math.round(totalAmount * 0.05)}</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-md flex items-start text-sm text-blue-800">
                  <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                  <p>You'll need to enter passenger details in the next step before confirming your booking.</p>
                </div>
                
                <Button 
                  variant="primary" 
                  fullWidth
                  onClick={handleProceed}
                >
                  Proceed with {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;