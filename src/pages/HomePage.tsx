import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  Shield,
  Clock,
  Users,
  ArrowRight,
  CheckCircle2,
  Zap,
  PhoneCall,
  Copy,
  Check,
  ChevronDown,
  Sparkles,
  Navigation,
  Bus,
  Ticket,
  Percent,
  Compass,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BusSearchForm from '../components/booking/BusSearchForm';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

interface PromoOffer {
  code: string;
  discount: string;
  title: string;
  description: string;
  badge: string;
  bgGradient: string;
}

const PROMO_OFFERS: PromoOffer[] = [
  {
    code: 'FIRSTBUS',
    discount: '15% OFF',
    title: 'First Time Traveler',
    description: 'Save up to ₹150 on your very first bus booking with BlueBus.',
    badge: 'NEW USER',
    bgGradient: 'from-blue-600 to-indigo-700',
  },
  {
    code: 'WEEKEND200',
    discount: '₹200 OFF',
    title: 'Weekend Getaway',
    description: 'Enjoy instant ₹200 savings on any intercity weekend departure.',
    badge: 'POPULAR',
    bgGradient: 'from-emerald-600 to-teal-700',
  },
  {
    code: 'FESTIVE50',
    discount: 'FLAT ₹100',
    title: 'Round Trip Saver',
    description: 'Book return journeys together and unlock guaranteed cashback.',
    badge: 'LIMITED TIME',
    bgGradient: 'from-amber-600 to-orange-700',
  },
];

interface PopularRouteCard {
  source: string;
  destination: string;
  fare: number;
  duration: string;
  dailyBuses: number;
  tags: string[];
}

const ENHANCED_POPULAR_ROUTES: PopularRouteCard[] = [
  {
    source: 'Hyderabad',
    destination: 'Bangalore',
    fare: 650,
    duration: '8h 30m',
    dailyBuses: 45,
    tags: ['AC Sleeper', 'Volvo Multi-Axle'],
  },
  {
    source: 'Bangalore',
    destination: 'Chennai',
    fare: 450,
    duration: '6h 15m',
    dailyBuses: 38,
    tags: ['Electric AC', 'Scania'],
  },
  {
    source: 'Mumbai',
    destination: 'Pune',
    fare: 280,
    duration: '3h 45m',
    dailyBuses: 72,
    tags: ['Expressway', 'Non-Stop'],
  },
  {
    source: 'Delhi',
    destination: 'Jaipur',
    fare: 350,
    duration: '5h 30m',
    dailyBuses: 50,
    tags: ['Mercedes AC', 'Sleeper'],
  },
  {
    source: 'Chennai',
    destination: 'Coimbatore',
    fare: 550,
    duration: '7h 45m',
    dailyBuses: 32,
    tags: ['Single Berth', 'Snacks'],
  },
  {
    source: 'Visakhapatnam',
    destination: 'Hyderabad',
    fare: 720,
    duration: '11h 00m',
    dailyBuses: 28,
    tags: ['BharatBenz AC', 'Wi-Fi'],
  },
];

const FAQS = [
  {
    question: 'How do I book a bus ticket on BlueBus?',
    answer:
      'Simply enter your departure city (From), arrival city (To), and travel date in the search box above. Click "Find Buses", pick your bus based on timing and amenities, choose your preferred seat, and complete payment safely. Your e-ticket is sent instantly to your WhatsApp, SMS, and Email.',
  },
  {
    question: 'Can I cancel or reschedule my ticket after booking?',
    answer:
      'Yes, you can easily cancel or reschedule your ticket under "My Bookings" with your booking reference ID. Depending on the operator cancellation window, refunds are processed directly to your original payment method within 24 to 48 hours.',
  },
  {
    question: 'Do I need to carry a physical printout of my ticket?',
    answer:
      'No physical printout is necessary! All bus operators on the BlueBus network accept the digital M-Ticket on your smartphone along with any government-issued photo ID (Aadhaar, Driving License, or Passport).',
  },
  {
    question: 'How does Live Bus Tracking work?',
    answer:
      'Once your bus departs, you will receive an SMS and WhatsApp message with a real-time GPS tracking link. You can see the bus location, estimated boarding time, and nearby stops directly on your map.',
  },
  {
    question: 'Are there separate or reserved seats for female solo travelers?',
    answer:
      'Yes, BlueBus provides dedicated female safety seating indicators. Whenever a seat is booked by a solo female traveler, adjacent seats are highlighted so female passengers can choose comfortable adjacent seating.',
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleCopyPromo = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied to clipboard!`, { id: 'copy-promo', duration: 2500 });
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleQuickBookRoute = (source: string, destination: string) => {
    const today = new Date().toISOString().split('T')[0];
    navigate(`/search?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&date=${today}`);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 selection:bg-primary/20 selection:text-primary">
      {/* Skip to Main Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-white px-4 py-2 rounded-md shadow-lg outline-none ring-2 ring-white"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" className="flex-grow">
        {/* ================= HERO SECTION ================= */}
        <section
          aria-label="Bus Search Hero"
          className="relative bg-cover bg-center text-white pt-14 pb-20 lg:pt-20 lg:pb-28 overflow-hidden"
          style={{
            backgroundImage: "url('/hero-bus.jpg')",
          }}
        >
          {/* Layered Gradient Overlay for Crystal Clear Contrast */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/80 to-slate-950/95"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Trust Pill Badge */}
            <div className="flex justify-center mb-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-white shadow-lg">
                <Sparkles size={15} className="text-amber-400" />
                <span>India&apos;s Most Trusted Bus Booking Platform</span>
                <span className="w-1 h-1 rounded-full bg-white/40 hidden sm:inline" />
                <span className="text-amber-300 font-bold hidden sm:inline">★ 4.8 Rating</span>
                <span className="text-white/80 hidden sm:inline">• 2500+ Routes</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-3">
                Book Bus Tickets{' '}
                <span className="bg-gradient-to-r from-blue-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                  with Confidence
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
                Connect between thousands of cities with premium AC Sleepers, live GPS tracking, and instant WhatsApp boarding passes.
              </p>
            </div>

            {/* Elevated Segmented Search Card */}
            <div className="w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-lg text-slate-900 rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-7 border border-white/80 relative">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-xs">
                    <Bus size={17} />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    Search Intercity Buses
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 size={12} /> Instant Confirmation
                  </span>
                </div>
              </div>

              {/* Accessible Search Console */}
              <BusSearchForm />
            </div>

            {/* Trust Badges Strip */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-5xl mx-auto">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-blue-500/25 text-blue-300 flex items-center justify-center flex-shrink-0 font-bold">
                  <Zap size={18} />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-white">Instant M-Tickets</div>
                  <div className="text-[11px] text-slate-300">On WhatsApp & SMS</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/25 text-emerald-300 flex items-center justify-center flex-shrink-0 font-bold">
                  <Shield size={18} />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-white">Zero Extra Fees</div>
                  <div className="text-[11px] text-slate-300">Transparent fares</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-amber-500/25 text-amber-300 flex items-center justify-center flex-shrink-0 font-bold">
                  <Navigation size={18} />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-white">Live GPS Tracking</div>
                  <div className="text-[11px] text-slate-300">Track bus in real-time</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-purple-500/25 text-purple-300 flex items-center justify-center flex-shrink-0 font-bold">
                  <PhoneCall size={18} />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-white">24/7 Helpline</div>
                  <div className="text-[11px] text-slate-300">Dedicated support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PROMO OFFERS & COUPONS ================= */}
        <section aria-label="Exclusive Offers" className="py-12 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-primary bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  Save More
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                  Special Travel Deals & Offers
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Click any coupon to copy code and apply at checkout.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PROMO_OFFERS.map((offer) => {
                const isCopied = copiedCode === offer.code;
                return (
                  <div
                    key={offer.code}
                    className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all group bg-white flex flex-col justify-between"
                  >
                    {/* Header Banner */}
                    <div className={`p-5 bg-gradient-to-r ${offer.bgGradient} text-white flex justify-between items-start`}>
                      <div>
                        <span className="inline-block text-[10px] font-extrabold tracking-widest px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm mb-1.5 uppercase">
                          {offer.badge}
                        </span>
                        <h3 className="text-xl font-black">{offer.discount}</h3>
                        <p className="text-xs text-white/90 font-medium">{offer.title}</p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                        <Percent size={18} className="text-white" />
                      </div>
                    </div>

                    {/* Body & Code Action */}
                    <div className="p-5 flex flex-col justify-between flex-grow gap-4">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {offer.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-200">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-gray-400">Coupon Code</span>
                          <span className="font-mono font-bold text-sm text-primary tracking-wider">
                            {offer.code}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyPromo(offer.code)}
                          aria-label={`Copy coupon code ${offer.code}`}
                          className={`
                            px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all
                            ${
                              isCopied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-blue-50 text-primary border border-blue-200 hover:bg-primary hover:text-white'
                            }
                          `}
                        >
                          {isCopied ? (
                            <>
                              <Check size={14} /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={14} /> Copy Code
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= POPULAR ROUTES SHOWCASE ================= */}
        <section aria-label="Popular Routes" className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-primary bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  Most Booked
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                  Popular Bus Routes Across India
                </h2>
                <p className="text-sm text-gray-600 mt-1 max-w-xl">
                  Compare schedules, premium Volvo buses, and lowest ticket fares on our top traveled corridors.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/routes')}
                rightIcon={<ArrowRight size={16} />}
                className="self-start md:self-auto border-gray-300 hover:border-primary text-gray-700 hover:text-primary"
              >
                View All Routes
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ENHANCED_POPULAR_ROUTES.map((route, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: Origin & Destination */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                          From
                        </span>
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
                          {route.source}
                        </h3>
                      </div>

                      <div className="px-3 flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <ArrowRight size={16} />
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium mt-1">
                          {route.duration}
                        </span>
                      </div>

                      <div className="flex-1 text-right">
                        <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">
                          To
                        </span>
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
                          {route.destination}
                        </h3>
                      </div>
                    </div>

                    {/* Route Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {route.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-primary border border-blue-100">
                        {route.dailyBuses}+ daily trips
                      </span>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-[11px] text-gray-400 block font-medium">Starting from</span>
                      <span className="text-xl font-extrabold text-primary">
                        ₹{route.fare}
                      </span>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleQuickBookRoute(route.source, route.destination)}
                      rightIcon={<ArrowRight size={14} />}
                      className="rounded-xl px-4 py-2 font-semibold shadow-xs hover:shadow-md"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 3 EASY STEPS TO BOOK ================= */}
        <section aria-label="Booking Process" className="py-16 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold tracking-wider uppercase text-primary bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Simple & Swift
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                Book Your Bus in 3 Simple Steps
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                No complicated forms or confusing checkouts. Here is how easy travel booking is.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-gray-200 shadow-2xs">
                <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl mb-5 shadow-md">
                  1
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  Search & Compare Buses
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Enter your origin, destination, and departure date. Instantly filter by AC, Sleeper, departure timing, or ticket fare.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-gray-200 shadow-2xs">
                <div className="w-14 h-14 rounded-2xl bg-secondary text-white flex items-center justify-center font-black text-xl mb-5 shadow-md">
                  2
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  Select Seat & Boarding Point
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Choose your preferred window, aisle, or sleeper berth on our live interactive seat layout map.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-gray-200 shadow-2xs">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl mb-5 shadow-md">
                  3
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  Instant M-Ticket & Travel
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Pay securely via UPI, Card, or Netbanking. Receive your confirmed ticket and live tracking link right on your mobile.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHY CHOOSE BLUEBUS (AMENITIES) ================= */}
        <section aria-label="Why Choose Us" className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold tracking-wider uppercase text-primary bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Premium Standards
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                Why Millions Choose BlueBus
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Every trip on our platform is backed by our strict safety, cleanliness, and punctuality guarantees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-primary flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Safe & Verified Fleets</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    GPS-equipped modern buses driven by vetted, experienced drivers. Sanitized cabins with regular mechanical audits.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">98.4% On-Time Departures</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Real-time traffic route optimization and scheduled boarding guarantees you reach your destination without delays.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                    <Star className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Best Fare Guarantee</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Zero convenience markups, exclusive partner promo discounts, and transparent breakdowns on every seat fare.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Wide Network Coverage</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Direct connectivity spanning major metros and tier-2 / tier-3 towns with multiple boarding points per city.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Dedicated Solo Traveler Safety</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Safe adjacent seating algorithms for solo women commuters and emergency helpline assistance on every route.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Hassle-Free Cancellations</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Instant refund credits directly to your bank account with flexible cancellation windows up to 2 hours before trip.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CUSTOMER TESTIMONIALS ================= */}
        <section aria-label="Customer Reviews" className="py-16 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold tracking-wider uppercase text-primary bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Real Stories
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                Loved by 2 Million+ Travelers
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Discover why commuters rate BlueBus 4.8 stars across app stores.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed italic mb-4">
                    &ldquo;Booking was so fast and smooth! The autocomplete city search made selecting my route instant, and the bus arrived right on schedule at Hyderabad.&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                  <div className="w-9 h-9 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center">
                    PS
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Pooja Sharma</div>
                    <div className="text-[11px] text-gray-500">Hyderabad → Bangalore</div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed italic mb-4">
                    &ldquo;Live GPS tracking on WhatsApp is a gamechanger. I didn&apos;t have to wait aimlessly at the highway boarding point in the rain. Highly recommended!&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    RK
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Rajesh Kumar</div>
                    <div className="text-[11px] text-gray-500">Chennai → Bangalore</div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed italic mb-4">
                    &ldquo;Super clean sleeper bus, functioning charging points, and the promo code FIRSTBUS gave me an instant 15% discount. Will book all my trips here.&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    AN
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Ananya Nair</div>
                    <div className="text-[11px] text-gray-500">Mumbai → Pune</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ACCESSIBLE FAQ ACCORDION ================= */}
        <section aria-label="Frequently Asked Questions" className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold tracking-wider uppercase text-primary bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Got Questions?
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Everything you need to know about booking, boarding, and cancellations on BlueBus.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                const faqId = `faq-item-${index}`;
                const panelId = `faq-panel-${index}`;

                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs transition-all"
                  >
                    <button
                      type="button"
                      id={faqId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left font-semibold text-gray-900 flex items-center justify-between gap-4 hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span className="text-sm sm:text-base">{faq.question}</span>
                      <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                          isOpen ? 'rotate-180 text-primary' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={faqId}
                        className="px-6 pb-4 pt-1 text-xs sm:text-sm text-gray-600 border-t border-gray-50 leading-relaxed animate-fadeIn"
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= APP DOWNLOAD & NEWSLETTER CTA ================= */}
        <section aria-label="Mobile App and Updates" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-primary-dark via-primary to-slate-900 text-white overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 sm:p-12 items-center">
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-4 border border-white/10">
                    <Sparkles size={13} /> Exclusive App Privileges
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">
                    Download the BlueBus App
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
                    Get extra ₹100 OFF on your first in-app booking, live GPS driver chat, and paperless boarding right on your lock screen.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-primary rounded-xl px-5 py-2.5 font-semibold text-xs sm:text-sm"
                    >
                      Google Play Store
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-primary rounded-xl px-5 py-2.5 font-semibold text-xs sm:text-sm"
                    >
                      Apple App Store
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white/10 p-6 sm:p-8 rounded-2xl border border-white/15 backdrop-blur-md">
                  <h3 className="text-lg font-bold mb-2">Get Deal Alerts in Your Inbox</h3>
                  <p className="text-xs text-slate-300 mb-4">
                    Never miss festive discounts, flash sales, and new express route launches.
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      toast.success('Thank you for subscribing to BlueBus deal alerts!');
                    }}
                    className="flex flex-col sm:flex-row gap-2"
                  >
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      required
                      aria-label="Email for deal alerts"
                      className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl px-5 py-2.5 border-none shadow-md"
                    >
                      Subscribe
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;