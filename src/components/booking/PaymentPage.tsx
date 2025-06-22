import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, User, Calendar, Lock } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { useState } from 'react';
// import { updateBookingPaymentStatus } from '../../apiConfig/Bus';

interface Seat {
    id: number;
    seatNumber: string;
    seatPrice: number;
    seatType?: string;
}

interface Passenger {
    name: string;
    age: string;
    gender: string;
    seatNumber: string;
    seatPrice: number;
}

const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const {
        bookingId,
        passengers,
        selectedSeats,
        date,
        source,
        destination,
        totalAmount
    } = state as {
        bookingId: string;
        passengers: Passenger[];
        selectedSeats: Seat[];
        date: string;
        source: string;
        destination: string;
        totalAmount: number;
    };

    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!state) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600">Invalid Access</h2>
                    <p className="mt-4">Please complete passenger information before proceeding to payment.</p>
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


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setError(null);

        // Basic validation
        if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvc) {
            setError('Please fill in all card details.');
            setIsProcessing(false);
            return;
        }

        // Validate card number (simple check for demo)
        if (cardDetails.number.replace(/\s/g, '').length !== 16) {
            setError('Please enter a valid 16-digit card number');
            setIsProcessing(false);
            return;
        }

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Update booking payment status in backend
            //   await updateBookingPaymentStatus(bookingId, 'PAID');

            // On successful payment, redirect to confirmation page
            navigate(`/booking/confirmation/${bookingId}`, {
                state: {
                    bookingDetails: {
                        id: bookingId,
                        passengers,
                        selectedSeats,
                        date,
                        source,
                        destination,
                        totalAmount,
                        paymentMethod: 'Credit Card',
                        cardLastFour: cardDetails.number.slice(-4),
                        paymentDate: new Date().toISOString()
                    }
                }
            });
        } catch (err) {
            console.error('Payment failed:', err);
            setError('Payment failed. Please try again or use a different payment method.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4 sm:p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-800">Complete Your Payment</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Securely pay for your booking. You are one step away from confirming your trip.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row">
                        {/* Booking Summary */}
                        <div className="w-full lg:w-1/2 p-4 sm:p-6 bg-gray-50 border-b lg:border-r lg:border-b-0">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Booking Summary</h3>
                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-md border">
                                    <h4 className="font-medium mb-3 text-gray-600">Passenger Details</h4>
                                    <div className="space-y-3">
                                        {passengers.map((passenger, index) => (
                                            <div key={index} className="bg-gray-100 rounded px-3 py-2">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">{passenger.name}</span>
                                                    <span className="text-primary font-bold">Seat {passenger.seatNumber.split('-')[1]}</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-gray-600 mt-1">
                                                    <span>{passenger.age} years, {passenger.gender}</span>
                                                    <span>₹{passenger.seatPrice}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-md border">
                                    <h4 className="font-medium mb-3 text-gray-600">Journey Details</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">From:</span>
                                            <span className="font-semibold text-gray-800">{source}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">To:</span>
                                            <span className="font-semibold text-gray-800">{destination}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Date:</span>
                                            <span className="font-semibold text-gray-800">{date}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-2">
                                    <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t">
                                        <span>Total Amount</span>
                                        <span>₹{totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Form */}
                        <div className="w-full lg:w-1/2 p-4 sm:p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Payment Details</h3>
                            <form onSubmit={handlePayment} className="space-y-4">
                                <Input
                                    label="Card Number"
                                    name="number"
                                    value={cardDetails.number}
                                    onChange={handleInputChange}
                                    placeholder="0000 0000 0000 0000"
                                    required
                                    fullWidth
                                    leftIcon={<CreditCard size={16} className="text-gray-500" />}
                                />
                                <Input
                                    label="Cardholder Name"
                                    name="name"
                                    value={cardDetails.name}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    required
                                    fullWidth
                                    leftIcon={<User size={16} className="text-gray-500" />}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Expiry Date"
                                        name="expiry"
                                        value={cardDetails.expiry}
                                        onChange={handleInputChange}
                                        placeholder="MM/YY"
                                        required
                                        fullWidth
                                        leftIcon={<Calendar size={16} className="text-gray-500" />}
                                    />
                                    <Input
                                        label="CVC"
                                        name="cvc"
                                        value={cardDetails.cvc}
                                        onChange={handleInputChange}
                                        placeholder="123"
                                        required
                                        fullWidth
                                        leftIcon={<Lock size={16} className="text-gray-500" />}
                                    />
                                </div>

                                {error && <p className="text-red-500 text-sm">{error}</p>}

                                <div className="pt-4">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        fullWidth
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? 'Processing...' : `Pay ₹${totalAmount} Now`}
                                    </Button>
                                </div>

                                <div className="text-xs text-gray-500 mt-4 flex items-center justify-center">
                                    <Lock size={12} className="mr-1" />
                                    <span>Your payment is secured by a 256-bit SSL encryption.</span>
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

export default PaymentPage;