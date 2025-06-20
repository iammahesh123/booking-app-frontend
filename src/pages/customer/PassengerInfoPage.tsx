import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { createPassenger, createBooking } from '../../apiConfig/Booking';

interface Passenger {
  name: string;
  age: string;
  gender: string;
}

interface LocationState {
  selectedSeats: Array<{
    id: number;
    seatNumber: string;
    seatPrice: number;
  }>;
  date: string;
  source: string;
  destination: string;
  totalAmount: number;
}

const PassengerInfoPage: React.FC = () => {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const location = useLocation();
  const state = location.state as LocationState;
  const navigate = useNavigate();
  
  const [passengers, setPassengers] = useState<Passenger[]>([
    { name: '', age: '', gender: 'male' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const handleAddPassenger = () => {
    setPassengers([...passengers, { name: '', age: '', gender: 'male' }]);
  };

  const handleRemovePassenger = (index: number) => {
    const updatedPassengers = passengers.filter((_, i) => i !== index);
    setPassengers(updatedPassengers);
  };

  if (!state?.selectedSeats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Invalid Access</h2>
          <p className="mt-4">Please select seats before filling passenger information.</p>
          <Button 
            variant="primary" 
            className="mt-6" 
            onClick={() => navigate('/')}
          >
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validate passenger data
    if (passengers.length !== state.selectedSeats.length) {
      setError('Number of passengers must match number of selected seats');
      setIsSubmitting(false);
      return;
    }

    for (const passenger of passengers) {
      if (!passenger.name || !passenger.age) {
        setError('Please fill all passenger details');
        setIsSubmitting(false);
        return;
      }
      
      // const age = parseInt(passenger.age);
      // if (isNaN(age) {
      //   setError('Please enter a valid age');
      //   setIsSubmitting(false);
      //   return;
      // }
    }

    try {
      // Create passengers and collect their IDs
      const passengerIds = [];
      for (let i = 0; i < passengers.length; i++) {
        const passengerData = {
          passengerName: passengers[i].name,
          age: parseInt(passengers[i].age),
          gender: passengers[i].gender,
          seatNumber: state.selectedSeats[i].seatNumber,
          busId: parseInt(scheduleId || '0')
        };

        const response = await createPassenger(passengerData);
        passengerIds.push(response.id);
      }

      // Create booking
      const bookingData = {
        userId: 'current-user-id', // TODO: Replace with actual user ID from auth context
        bookingDate: state.date,
        totalPrice: state.totalAmount,
        bookingStatus: "CONFIRMED",
        paymentStatus: 'PAID',
        seatIds: state.selectedSeats.map(seat => seat.id),
        passengerIds: passengerIds,
        busScheduleId: parseInt(scheduleId || '0')
      };

      const bookingResponse = await createBooking(bookingData);
      
      // Navigate to confirmation page with booking details
      navigate(`/booking/confirmation/${bookingResponse.id}`, {
        state: {
          bookingDetails: {
            ...bookingResponse,
            passengers: passengers.map((p, i) => ({
              ...p,
              seatNumber: state.selectedSeats[i].seatNumber,
              seatPrice: state.selectedSeats[i].seatPrice
            })),
            source: state.source,
            destination: state.destination,
            date: state.date,
            totalAmount: state.totalAmount
          }
        }
      });
    } catch (err) {
      console.error('Booking failed:', err);
      setError('Failed to complete booking. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Passenger Information</h2>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="font-medium">Selected Seats: {state.selectedSeats.map(seat => seat.seatNumber.split('-')[1]).join(', ')}</p>
                <p className="text-sm text-gray-600 mt-1">Total Amount: ₹{state.totalAmount}</p>
              </div>

              <form onSubmit={handleSubmit}>
                {passengers.map((passenger, index) => (
                  <div key={index} className="mb-8 p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Passenger {index + 1} - Seat {state.selectedSeats[index]?.seatNumber.split('-')[1]}
                      </h3>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePassenger(index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Input
                          label="Full Name"
                          type="text"
                          value={passenger.name}
                          onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                          required
                          placeholder="Enter full name"
                        />
                      </div>
                      
                      <div>
                        <Input
                          label="Age"
                          type="number"
                          value={passenger.age}
                          onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                          required
                          min="1"
                          max="120"
                          placeholder="Enter age"
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender
                        </label>
                        <div className="flex gap-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="form-radio text-primary"
                              name={`gender-${index}`}
                              value="male"
                              checked={passenger.gender === 'male'}
                              onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                            />
                            <span className="ml-2">Male</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="form-radio text-primary"
                              name={`gender-${index}`}
                              value="female"
                              checked={passenger.gender === 'female'}
                              onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                            />
                            <span className="ml-2">Female</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {passengers.length < state.selectedSeats.length && (
                  <div className="mt-4 mb-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddPassenger}
                      className="w-full"
                    >
                      Add Another Passenger
                    </Button>
                  </div>
                )}
                
                <div className="border-t pt-6">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    leftIcon={<CreditCard size={20} />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PassengerInfoPage;