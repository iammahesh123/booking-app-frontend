import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import BusesPage from './BusesPage';
import UsersPage from './UsersPage';
import RoutesPage from './RoutesPage';
import SchedulesPage from './SchedulesPage';
import TransactionsPage from './TransactionsPage';
import SeatManagementPage from './SeatManagementPage';

const AdminDashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar when route changes (for mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // Check if mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed z-30 top-4 left-4 p-2 rounded-md bg-white shadow-md"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Sidebar - Hidden on mobile when closed */}
      <div
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${!isMobile ? 'translate-x-0' : ''}
        fixed md:relative z-20 w-64 h-full transition-transform duration-300 ease-in-out
        bg-white shadow-md`}
      >
        <AdminSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          mobileOpen={mobileOpen}
          onMobileToggle={() => setMobileOpen(!mobileOpen)}
        />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Only shown on mobile */}
        {isMobile && (
          <header className="bg-white shadow-sm p-4">
            <h1 className="text-xl font-semibold text-gray-800">
              {location.pathname === '/' && 'Dashboard'}
              {location.pathname === '/buses' && 'Buses'}
              {location.pathname === '/users' && 'Users'}
              {location.pathname === '/routes' && 'Routes'}
              {location.pathname === '/schedules' && 'Schedules'}
              {location.pathname === '/transactions' && 'Transactions'}
              {location.pathname === '/seats' && 'Seat Management'}
              {location.pathname === '/help' && 'Help & Support'}
            </h1>
          </header>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/buses" element={<BusesPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/schedules" element={<SchedulesPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/seats" element={<SeatManagementPage />} />
            <Route path="/help" element={
              <div className="p-4 md:p-6">
                <h1 className="text-xl md:text-2xl font-bold">Help & Support</h1>
                <div className="mt-4">
                  <p>Contact support at support@busapp.com</p>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;