import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, MapPin } from 'lucide-react';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { Seat, Route } from '../../data/types';
import { fetchCities } from '../../apiConfig/Bus';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';

interface SeatLayoutProps {
  scheduleId: number;
  seats: Seat[];
  date: string;
  route: Route | null;
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
  const [sourceStop, setSourceStop] = useState<string>('');
  const [destinationStop, setDestinationStop] = useState<string>('');
  const [cities, setCities] = useState<Array<{value: string, label: string}>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
   const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Organize seats into rows
  const seatRows = useMemo(() => {
    const rows: { [key: string]: Seat[] } = {};

    console.log("Seats data:", seats);
    
    seats.forEach(seat => {
      // Extract row number from format "1-1A" (the number after the dash)
      const seatParts = seat.seatNumber.split('-');
      if (seatParts.length !== 2) return; // Skip invalid formats
      
      const seatLabel = seatParts[1];
      const rowNumber = seatLabel.replace(/[A-Za-z]/g, ''); // Get just the number
      
      if (!rows[rowNumber]) {
        rows[rowNumber] = [];
      }
      rows[rowNumber].push(seat);
    });

    // Sort rows numerically (1, 2, 3, ...)
    const sortedRowNumbers = Object.keys(rows).sort((a, b) => parseInt(a) - parseInt(b));
    
    // Sort seats in each row by their letter (A, B, C, D)
    const sortedRows: { [key: string]: Seat[] } = {};
    sortedRowNumbers.forEach(rowNumber => {
      sortedRows[rowNumber] = rows[rowNumber].sort((a, b) => {
        // Get the letter part of the seat number (last character)
        const letterA = a.seatNumber.slice(-1);
        const letterB = b.seatNumber.slice(-1);
        return letterA.localeCompare(letterB);
      });
    });

    return sortedRows;
  }, [seats]);

  useEffect(() => {
    if (route) {
      setSourceStop(route.sourceCity);
      setDestinationStop(route.destinationCity);
    }
  }, [route]);

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

  const handleSeatClick = (seat: Seat) => {
    if (seat.seatStatus === 'AVAILABLE') {
      if (selectedSeats.find(s => s.id === seat.id)) {
        onSeatDeselect(seat);
      } else {
        onSeatSelect(seat);
      }
    }
  };

  const handleProceed = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      setAuthModalType('login');
      return;
    }
  
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to proceed.');
      return;
    }
    if (!sourceStop || !destinationStop) {
      alert('Please select both boarding and dropping points.');
      return;
    }
    if (sourceStop === destinationStop) {
      alert('Boarding and dropping points cannot be the same.');
      return;
    }

   navigate(`/booking/${scheduleId}/passengers`, {
    state: {
      selectedSeats,
      date,
      source: sourceStop,
      destination: destinationStop,
      totalAmount: finalTotalAmount
    }
  });

  //  navigate(`/payment`, {
  //     state: {
  //       selectedSeats,
  //       date,
  //       source: sourceStop,
  //       destination: destinationStop,
  //       totalAmount: finalTotalAmount
  //     }
  //   });
  };


const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  const handleSwitchAuthType = (type: 'login' | 'register') => {
    setAuthModalType(type);
  };


  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.seatPrice, 0);
  const serviceFee = 50;
  const gstPercentage = 0.05;
  const gstAmount = Math.round(totalAmount * gstPercentage);
  const finalTotalAmount = totalAmount + serviceFee + gstAmount;

  // Get boarding and dropping point options
  const boardingOptions = [
    { value: route?.sourceCity || '', label: route?.sourceCity || '' },
    ...cities.filter(city => city.value !== route?.sourceCity?.toLowerCase().replace(/\s+/g, '-'))
  ];

  const droppingOptions = [
    { value: route?.destinationCity || '', label: route?.destinationCity || '' },
    ...cities.filter(city => city.value !== route?.destinationCity?.toLowerCase().replace(/\s+/g, '-'))
  ];

  if (!route) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-lg text-gray-700 mb-2">Route information not available</p>
        <p className="text-sm text-gray-500">Please try selecting a different schedule or refresh the page.</p>
      </div>
    );
  }

  return (
    <>
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Select Your Seats</h3>
        <p className="text-sm text-gray-500">Click on an available seat to select it</p>
      </div>

      <div className="p-4 border-b bg-gray-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Boarding Point"
            options={boardingOptions}
            value={sourceStop}
            onChange={(e) => setSourceStop(e.target.value)}
            required
            fullWidth
            leftIcon={<MapPin size={16} className="text-gray-500" />}
          />
          <Select
            label="Dropping Point"
            options={droppingOptions}
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
            <div className="relative">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="w-20 h-12 border-2 border-gray-400 rounded-t-2xl flex items-center justify-center bg-gray-100">
                  <span className="text-xs text-gray-500">Driver</span>
                </div>
              </div>

              <div className="border-2 border-gray-400 rounded-lg p-6 bg-gray-50 min-h-[300px] flex flex-col justify-between">
                <div className="absolute -left-3 top-8 w-3 h-8 border-2 border-l-0 border-gray-400 rounded-r-lg bg-white"></div>

                <div className="grid gap-8">
                  {Object.keys(seatRows).map(rowNumber => (
                    <div key={rowNumber} className="flex justify-center gap-8">
                      <div className="flex gap-2">
                        {seatRows[rowNumber]
                          .filter(seat => ['A', 'B'].includes(seat.seatNumber.slice(-1)))
                          .map(seat => {
                            const isSelected = selectedSeats.some(s => s.id === seat.id);
                            const isBooked = seat.seatStatus !== 'AVAILABLE';
                            const displayNumber = seat.seatNumber.split('-')[1];
                            
                            return (
                              <button
                                key={seat.id}
                                className={`
                                  w-10 h-10 flex items-center justify-center rounded-t-lg
                                  text-sm font-medium transition-colors relative
                                  ${isBooked ? 'bg-gray-300 cursor-not-allowed' : ''}
                                  ${isSelected ? 'bg-primary text-white' : ''}
                                  ${!isBooked && !isSelected ? 'bg-white border-2 border-gray-300 hover:border-primary text-gray-800' : ''}
                                `}
                                onClick={() => handleSeatClick(seat)}
                                onMouseEnter={() => setHoveredSeat(seat)}
                                onMouseLeave={() => setHoveredSeat(null)}
                                disabled={isBooked}
                              >
                                {displayNumber}
                                {hoveredSeat?.id === seat.id && !isBooked && (
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-24 bg-black text-white text-xs py-1 px-2 rounded shadow-lg z-10 text-center">
                                    ₹{seat.seatPrice}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-t-4 border-x-transparent border-t-black"></div>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                      </div>

                      <div className="w-8"></div>

                      <div className="flex gap-2">
                        {seatRows[rowNumber]
                          .filter(seat => ['C', 'D'].includes(seat.seatNumber.slice(-1)))
                          .map(seat => {
                            const isSelected = selectedSeats.some(s => s.id === seat.id);
                            const isBooked = seat.seatStatus !== 'AVAILABLE';
                            const displayNumber = seat.seatNumber.split('-')[1];
                            
                            return (
                              <button
                                key={seat.id}
                                className={`
                                  w-10 h-10 flex items-center justify-center rounded-t-lg
                                  text-sm font-medium transition-colors relative
                                  ${isBooked ? 'bg-gray-300 cursor-not-allowed' : ''}
                                  ${isSelected ? 'bg-primary text-white' : ''}
                                  ${!isBooked && !isSelected ? 'bg-white border-2 border-gray-300 hover:border-primary text-gray-800' : ''}
                                `}
                                onClick={() => handleSeatClick(seat)}
                                onMouseEnter={() => setHoveredSeat(seat)}
                                onMouseLeave={() => setHoveredSeat(null)}
                                disabled={isBooked}
                              >
                                {displayNumber}
                                {hoveredSeat?.id === seat.id && !isBooked && (
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-24 bg-black text-white text-xs py-1 px-2 rounded shadow-lg z-10 text-center">
                                    ₹{seat.seatPrice}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-t-4 border-x-transparent border-t-black"></div>
                                  </div>
                                )}
                              </button>
                            );
                          })}
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
                  <div className="flex flex-col gap-2">
                    {selectedSeats.map(seat => (
                      <div key={seat.id} className="flex items-center justify-between bg-gray-100 rounded px-3 py-1.5 text-sm w-full">
                        <div>
                          <span className="font-medium">{seat.seatNumber.split('-')[1]}</span>
                          <span className="text-gray-500 ml-2">{seat.seatType}</span>
                        </div>
                        <span className="text-primary font-medium">₹{seat.seatPrice}</span>
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
                    <span>₹{serviceFee}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>GST ({gstPercentage * 100}%)</span>
                    <span>₹{gstAmount}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total Amount</span>
                    <span>₹{finalTotalAmount}</span>
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
    {showAuthModal && (
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthModalClose}
        type={authModalType}
        onSwitchType={handleSwitchAuthType}
      />
    )}
    </>
  );
};

export default SeatLayout;