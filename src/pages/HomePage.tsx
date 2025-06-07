import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Shield, Clock, Users, TrendingUp, ArrowRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BusSearchForm from '../components/booking/BusSearchForm';
import Button from '../components/ui/Button';
import AuthModal from '../components/auth/AuthModal';
import { mockPopularRoutes } from '../../src/components/utils/MockData';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'register'>('login');

  // Popular routes from mock data
  const popularRoutes = mockPopularRoutes;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        onLoginClick={() => {
          setAuthModalType('login');
          setIsAuthModalOpen(true);
        }}
        onRegisterClick={() => {
          setAuthModalType('register');
          setIsAuthModalOpen(true);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        type={authModalType}
        onSwitchType={setAuthModalType}
      />

      <main className="flex-grow">
{/* Hero Section */}
<section
  className="relative bg-cover bg-center text-white"
  style={{
    backgroundImage:
      "url('https://s3-eu-west-1.amazonaws.com/images.bluestarbus.co.uk/inline-images/IMG_2386a.jpg')",
  }}
>
  {/* Dark overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40"></div>

  {/* Content */}
  <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center">
    {/* Heading */}
    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
      Book Your Bus Tickets Online
    </h1>
    <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-12">
      Find and book bus tickets for thousands of routes across the country. Safe, secure, and hassle-free.
    </p>

    {/* Search Box */}
    <div className="w-full bg-white text-black rounded-2xl shadow-2xl p-8 md:p-10 max-w-4xl">
      <h2 className="text-primary font-semibold text-2xl mb-6">Search for Buses</h2>
      <BusSearchForm />

      {/* Tip Box */}
      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md shadow-sm flex items-start gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-blue-600 mt-0.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-9-1a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm text-blue-800 leading-snug">
          Tip: You can also search buses by <strong>cities</strong> like Mumbai, Hyderabad, or Srikakulam.
        </p>
      </div>
    </div>
  </div>
</section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose TravelEase?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We provide the best bus booking experience with comprehensive coverage, secure payments, and exceptional customer service.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
                <p className="text-gray-600">
                  Your bookings are protected with industry-standard security and your data is kept private and secure.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600">
                  Our customer support team is available round the clock to assist you with any queries or issues.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Best Deals</h3>
                <p className="text-gray-600">
                  Get the best prices and exclusive deals on bus tickets for all major routes across the country.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Extensive Network</h3>
                <p className="text-gray-600">
                  Access thousands of routes and bus operators covering major cities and remote locations.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Group Bookings</h3>
                <p className="text-gray-600">
                  Special fares and seat arrangements for group travel with easy booking and management.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Loyalty Rewards</h3>
                <p className="text-gray-600">
                  Earn points on every booking and redeem them for discounts on future travel.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Routes Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Popular Routes</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore the most traveled bus routes with competitive fares and frequent departures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularRoutes.map((route, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{route.source}</h3>
                        <p className="text-gray-500 text-sm">Origin</p>
                      </div>

                      <div className="px-4">
                        <ArrowRight className="text-gray-400" />
                      </div>

                      <div className="flex-1 text-right">
                        <h3 className="font-semibold text-lg">{route.destination}</h3>
                        <p className="text-gray-500 text-sm">Destination</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {route.count}+ trips daily
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/search?source=${route.source.toLowerCase()}&destination=${route.destination.toLowerCase()}`)}
                      >
                        Check Availability
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button
                variant="outline"
                onClick={() => navigate('/routes')}
              >
                View All Routes
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 bg-primary p-10 text-white">
                  <h2 className="text-3xl font-bold mb-4">Download Our Mobile App</h2>
                  <p className="mb-6">
                    Get the TravelEase mobile app for faster bookings, exclusive mobile-only deals, and real-time journey tracking.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="outline"
                      className="text-white border-white hover:bg-white hover:text-primary"
                    >
                      Google Play
                    </Button>
                    <Button
                      variant="outline"
                      className="text-white border-white hover:bg-white hover:text-primary"
                    >
                      App Store
                    </Button>
                  </div>
                </div>

                <div className="md:w-1/2 p-10">
                  <h3 className="text-2xl font-bold mb-4">Join Our Newsletter</h3>
                  <p className="text-gray-600 mb-6">
                    Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
                  </p>
                  <form className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-2 border rounded-md"
                      required
                    />
                    <Button
                      variant="primary"
                      type="submit"
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