import React, { useEffect } from 'react';
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
  LogOut,
  Armchair,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useMediaQuery } from 'react-responsive';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, active, collapsed = false }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${active
        ? 'bg-primary/10 text-primary font-medium'
        : 'text-gray-700 hover:bg-gray-100'
      } ${collapsed ? 'justify-center' : ''}`}
      title={collapsed ? label : undefined}
    >
      <span className="text-current">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </Link>
  );
};

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  collapsed, 
  onToggleCollapse, 
  mobileOpen,
  onMobileToggle
}) => {
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile && mobileOpen) {
      onMobileToggle();
    }
  }, [location.pathname]);

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
      to: '/admin/seats',
      icon: <Armchair size={20} />,
      label: 'Seat Management',
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

  // Mobile sidebar overlay
  if (isMobile && !mobileOpen) {
    return null;
  }

  return (
    <div className={`
      ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-64' : 'relative'}
      bg-white border-r h-screen flex flex-col transition-all duration-300
      ${collapsed && !isMobile ? 'w-20' : 'w-64'}
      shadow-lg
    `}>
      {/* Mobile close button */}
      {isMobile && (
        <button
          onClick={onMobileToggle}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
        >
          <X size={24} />
        </button>
      )}

      {/* Header */}
      <div className={`p-4 border-b ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
          <Bus className="h-8 w-8 text-primary" />
        ) : (
          <div className="flex items-center space-x-2">
            <Bus className="h-8 w-8 text-primary" />
            <div>
              <h2 className="font-bold text-lg text-primary">BlueBus</h2>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        )}
      </div>

      {/* Menu items */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            active={isActive(item)}
            collapsed={collapsed && !isMobile}
          />
        ))}
      </div>

      {/* Footer items */}
      <div className="mt-auto border-t p-3 space-y-1">
        <SidebarItem
          to="/admin/help"
          icon={<HelpCircle size={20} />}
          label="Help & Support"
          active={location.pathname === '/admin/help'}
          collapsed={collapsed && !isMobile}
        />

        <button
          // onClick={logout}
          className={`flex items-center ${collapsed && !isMobile ? 'justify-center' : 'space-x-3 px-4'} py-3 rounded-md text-red-600 hover:bg-red-50 w-full text-left transition-colors`}
          title={collapsed && !isMobile ? "Logout" : undefined}
        >
          <LogOut size={20} />
          {(!collapsed || isMobile) && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle (desktop only) */}
      {!isMobile && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-6 bg-white p-1 rounded-full border shadow-sm hover:bg-gray-50"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      )}
    </div>
  );
};

export default AdminSidebar;