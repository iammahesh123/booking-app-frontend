import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, Menu, X, LogOut, User, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import Button from '../ui/Button.tsx';

interface NavbarProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onRegisterClick }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userLinks = [
    { text: 'Home', href: '/', icon: <Home size={16} /> },
    { text: 'My Bookings', href: '/bookings', icon: <Bus size={16} /> },
    { text: 'Profile', href: '/profile', icon: <User size={16} /> },
  ];

  const adminLinks = [
    { text: 'Dashboard', href: '/admin', icon: <Home size={16} /> },
    { text: 'Buses', href: '/admin/buses', icon: <Bus size={16} /> },
    { text: 'Users', href: '/admin/users', icon: <User size={16} /> },
    { text: 'Profile', href: '/profile', icon: <User size={16} /> },
  ];

  const getLinks = () => {
    if (!user) return userLinks.slice(0, 1); // Only home for not logged in
    switch (user.role) {
      case 'ADMIN':
        return adminLinks;
      default:
        return userLinks;
    }
  };

  const links = getLinks();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Bus className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-primary">BlueBus</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  {link.icon && <span className="mr-1.5">{link.icon}</span>}
                  {link.text}
                </Link>
              ))}
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated ? (
                <div className="flex items-center">
                  <span className="hidden lg:block mr-3 text-sm text-gray-700">
                    {user?.name}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    leftIcon={<LogOut size={16} />}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onLoginClick}
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onRegisterClick}
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  {link.icon && <span className="mr-2">{link.icon}</span>}
                  {link.text}
                </div>
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 text-sm text-gray-500">
                  Signed in as <span className="font-medium">{user?.name}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </div>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    if (onLoginClick) onLoginClick();
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    if (onRegisterClick) onRegisterClick();
                    setIsMenuOpen(false);
                  }}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;