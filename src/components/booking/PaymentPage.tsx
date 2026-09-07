import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  User,
  Calendar,
  Lock,
  QrCode,
  Smartphone,
  Building2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { confirmDemoPayment, initiateDemoPayment } from '../../apiConfig/Bus';

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

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    bookingId: string;
    passengers: Passenger[];
    selectedSeats: Seat[];
    date: string;
    source: string;
    destination: string;
    totalAmount: number;
  } | null;

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(599); // 10 minutes hold

  // Countdown timer for seat reservation hold
  useEffect(() => {
    if (!state) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [state]);

  if (!state?.bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-900">Session Expired or Invalid</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please complete passenger information before proceeding to payment.
          </p>
          <Button variant="primary" className="mt-6" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const {
    bookingId,
    passengers,
    selectedSeats,
    date,
    source,
    destination,
    totalAmount,
  } = state;

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardDetails((prev) => ({ ...prev, number: formatted }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardDetails((prev) => ({ ...prev, expiry: val }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    // Validation
    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g. yourname@okhdfcbank)');
      setIsProcessing(false);
      return;
    }

    if (paymentMethod === 'card') {
      const rawCardNum = cardDetails.number.replace(/\s/g, '');
      if (rawCardNum.length < 15 || !cardDetails.name || !cardDetails.expiry || cardDetails.cvc.length < 3) {
        setError('Please enter complete and valid card information.');
        setIsProcessing(false);
        return;
      }
    }

    try {
      // Step 1: Initiate payment simulation
      await initiateDemoPayment(bookingId);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Step 2: Confirm payment with backend
      const paymentResult = await confirmDemoPayment(bookingId);

      // Redirect to confirmation page with complete data
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
            paymentMethod:
              paymentMethod === 'upi'
                ? `UPI (${upiId})`
                : paymentMethod === 'card'
                ? `Card Ending •••• ${cardDetails.number.slice(-4)}`
                : `NetBanking (${selectedBank})`,
            paymentDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            paymentId: paymentResult?.razorpayPaymentId || `PAY-${Date.now()}`,
          },
        },
      });

      // Save to localStorage so My Bookings displays the newly booked trip
      try {
        const storedRecord = {
          id: String(bookingId),
          bookingCode: `BB-${Math.floor(100000 + Math.random() * 900000)}`,
          sourceCity: source || 'Mumbai',
          destinationCity: destination || 'Pune',
          bookingDate: date || new Date().toISOString().split('T')[0],
          totalFare: totalAmount,
          status: 'confirmed',
          paymentStatus: 'paid',
          passengers: passengers || [],
          selectedSeats: selectedSeats || [],
          busName: 'Royal Cruiser AC Multi-Axle',
          busNumber: 'KA-01-F-7777',
        };
        const existing = JSON.parse(localStorage.getItem('bluebus_user_bookings') || '[]');
        localStorage.setItem('bluebus_user_bookings', JSON.stringify([storedRecord, ...existing]));
      } catch (saveErr) {
        console.warn('Could not save booking locally:', saveErr);
      }
    } catch (err: any) {
      console.error('Payment failed:', err);
      setError(err?.message || 'Payment confirmation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header bar with security badge and timer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Checkout & Payment</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Booking Reference: <span className="font-mono font-bold text-gray-800">{bookingId}</span>
              </p>
            </div>
            <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-bit Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Expires in {formatTimer(timeLeft)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left side: Payment Method Selector & Form */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              {/* Payment Tab Navigation */}
              <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-50/70 p-1.5 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('upi');
                    setError(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-white text-primary shadow-sm border border-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('card');
                    setError(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-white text-primary shadow-sm border border-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Debit / Credit</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('netbanking');
                    setError(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'bg-white text-primary shadow-sm border border-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Net Banking</span>
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handlePayment} className="p-6 flex-1 flex flex-col justify-between">
                {error && (
                  <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* 1. UPI Payment Mode */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-5">
                    <div className="border border-blue-100 bg-blue-50/50 p-4 rounded-xl flex items-center gap-4">
                      <div className="w-16 h-16 bg-white border border-blue-200 rounded-lg flex items-center justify-center text-primary shadow-sm">
                        <QrCode className="w-10 h-10" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">Scan & Pay via any UPI App</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Google Pay, PhonePe, Paytm, BHIM, or any banking UPI app.
                        </p>
                      </div>
                    </div>

                    <div>
                      <Input
                        label="Or Enter UPI ID / VPA"
                        type="text"
                        placeholder="username@bank (e.g. mobile@upi)"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        fullWidth
                        leftIcon={<Smartphone size={16} className="text-gray-400" />}
                        helperText="A payment request will be sent to your UPI app for authorization."
                      />
                    </div>
                  </div>
                )}

                {/* 2. Card Payment Mode */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <Input
                      label="Card Number"
                      type="text"
                      placeholder="4532 0000 0000 0000"
                      value={cardDetails.number}
                      onChange={handleCardNumberChange}
                      fullWidth
                      maxLength={19}
                      leftIcon={<CreditCard size={16} className="text-gray-400" />}
                    />

                    <Input
                      label="Cardholder Name"
                      type="text"
                      placeholder="Name as printed on card"
                      value={cardDetails.name}
                      onChange={(e) =>
                        setCardDetails((prev) => ({ ...prev, name: e.target.value }))
                      }
                      fullWidth
                      leftIcon={<User size={16} className="text-gray-400" />}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date"
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={handleExpiryChange}
                        maxLength={5}
                        fullWidth
                        leftIcon={<Calendar size={16} className="text-gray-400" />}
                      />
                      <Input
                        label="CVV / CVC"
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={cardDetails.cvc}
                        onChange={(e) =>
                          setCardDetails((prev) => ({
                            ...prev,
                            cvc: e.target.value.replace(/\D/g, '').slice(0, 4),
                          }))
                        }
                        fullWidth
                        leftIcon={<Lock size={16} className="text-gray-400" />}
                      />
                    </div>
                  </div>
                )}

                {/* 3. Net Banking Mode */}
                {paymentMethod === 'netbanking' && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Popular Bank
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {['HDFC', 'SBI', 'ICICI', 'Axis'].map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`py-3 px-3 rounded-lg border text-center font-bold text-xs transition-all ${
                            selectedBank === bank
                              ? 'border-primary bg-primary-50 text-primary shadow-sm ring-2 ring-primary/20'
                              : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {bank} Bank
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      You will be redirected to the official {selectedBank} NetBanking gateway to authorize the transaction.
                    </p>
                  </div>
                )}

                {/* Submit button */}
                <div className="mt-8 pt-4 border-t border-gray-100">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isProcessing}
                  >
                    Pay ₹{totalAmount.toLocaleString()} Securely
                  </Button>
                  <p className="text-center text-xs text-gray-400 mt-2.5 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Instant confirmation and SMS/Email ticket delivery
                  </p>
                </div>
              </form>
            </div>

            {/* Right side: Journey & Fare Summary */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Trip Summary
                </h3>

                <div className="py-3.5 border-b border-gray-100">
                  <div className="flex items-center justify-between font-bold text-gray-900 text-sm">
                    <span>{source}</span>
                    <span className="text-gray-400">→</span>
                    <span>{destination}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Date of Journey: {date}</p>
                </div>

                <div className="py-3.5 border-b border-gray-100 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Passengers ({passengers.length})
                  </p>
                  {passengers.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-800">
                        {p.name || `Passenger ${idx + 1}`} ({p.age}y, {p.gender})
                      </span>
                      <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        Seat {p.seatNumber.includes('-') ? p.seatNumber.split('-')[1] : p.seatNumber}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing Table */}
                <div className="pt-3.5 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Base Fare ({selectedSeats.length} seats)</span>
                    <span>₹{(totalAmount - 50 - Math.round((totalAmount - 50) * 0.05 / 1.05)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Platform & Service Fee</span>
                    <span>₹50</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (5%)</span>
                    <span>₹{Math.round((totalAmount - 50) * 0.05 / 1.05).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total Payable</span>
                    <span className="text-primary">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentPage;