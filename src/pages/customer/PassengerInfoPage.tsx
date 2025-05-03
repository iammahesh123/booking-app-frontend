import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, CreditCard } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

interface Passenger {
  name: string;
  age: string;
  gender: string;
}

const PassengerInfoPage: React.FC = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState<Passenger[]>([
    { name: '', age: '', gender: 'male' }
  ]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically validate and submit the passenger information
    // For now, we'll just navigate to the confirmation page
    navigate(`/booking/confirmation/${scheduleId}`);
  };

  return (
    <>
            <Navbar />
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">

      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Passenger Information</h2>
            
            <form onSubmit={handleSubmit}>
              {passengers.map((passenger, index) => (
                <div key={index} className="mb-8 p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Passenger {index + 1}
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
                        icon={<User size={20} />}
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
              
              <div className="border-t pt-6">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  leftIcon={<CreditCard size={20} />}
                >
                  Proceed to Payment
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