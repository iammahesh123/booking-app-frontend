import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bus, 
  Users, 
  MapPin, 
  Calendar, 
  CreditCard,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
        active 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span className="text-current">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

const AdminSidebar: React.FC = () => {
  const location = useLocation();
//   const { logout } = useAuth();
  
  const menuItems = [
    { 
      to: '/admin', 
      icon: <LayoutDashboard size={20} />, 
      label: 'Dashboard',
      exact: true
    },
    { 
      to: '/admin/buses', 
      icon: <Bus size={20} />, 
      label: 'Buses',
      exact: false
    },
    { 
      to: '/admin/users', 
      icon: <Users size={20} />, 
      label: 'Users',
      exact: false
    },
    { 
      to: '/admin/routes', 
      icon: <MapPin size={20} />, 
      label: 'Routes',
      exact: false
    },
    { 
      to: '/admin/schedules', 
      icon: <Calendar size={20} />, 
      label: 'Schedules',
      exact: false
    },
    { 
      to: '/admin/transactions', 
      icon: <CreditCard size={20} />, 
      label: 'Transactions',
      exact: false
    },
    { 
      to: '/admin/settings', 
      icon: <Settings size={20} />, 
      label: 'Settings',
      exact: false
    }
  ];

  const isActive = (item: typeof menuItems[0]) => {
    if (item.exact) {
      return location.pathname === item.to;
    }
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <Bus className="h-8 w-8 text-primary" />
          <div>
            <h2 className="font-bold text-lg text-primary">BlueBus</h2>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            active={isActive(item)}
          />
        ))}
      </div>
      
      <div className="mt-auto border-t p-3 space-y-1">
        <Link
          to="/admin/help"
          className="flex items-center space-x-3 px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <HelpCircle size={20} />
          <span>Help & Support</span>
        </Link>
        
        <button
        //   onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 rounded-md text-red-600 hover:bg-red-50 w-full text-left transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;