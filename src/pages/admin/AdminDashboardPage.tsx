import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation, Link } from 'react-router-dom';
import { Menu, X, ChevronRight, Home } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import BusesPage from './BusesPage';
import UsersPage from './UsersPage';
import RoutesPage from './RoutesPage';
import SchedulesPage from './SchedulesPage';
import TransactionsPage from './TransactionsPage';
import SeatManagementPage from './SeatManagementPage';
import AdminSettingsPage from './AdminSettingsPage';

const AdminDashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPageTitle = (pathname: string) => {
    if (pathname.includes('/buses')) return 'Fleet Buses Management';
    if (pathname.includes('/users')) return 'Users & Agents Management';
    if (pathname.includes('/routes')) return 'Transit Routes & Corridors';
    if (pathname.includes('/schedules')) return 'Trip Schedules & Dispatch';
    if (pathname.includes('/transactions')) return 'Financial Transactions';
    if (pathname.includes('/seats')) return 'Seat Matrix & Manifests';
    if (pathname.includes('/settings')) return 'System Settings';
    if (pathname.includes('/help')) return 'Help & Support';
    return 'Operations Dashboard';
  };

  const getBreadcrumb = (pathname: string) => {
    if (pathname.includes('/buses')) return 'Buses';
    if (pathname.includes('/users')) return 'Users';
    if (pathname.includes('/routes')) return 'Routes';
    if (pathname.includes('/schedules')) return 'Schedules';
    if (pathname.includes('/transactions')) return 'Transactions';
    if (pathname.includes('/seats')) return 'Seat Management';
    if (pathname.includes('/settings')) return 'Settings';
    if (pathname.includes('/help')) return 'Help';
    return 'Overview';
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out
          ${isMobile ? (sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full') : 'translate-x-0'}
        `}
      >
        <AdminSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          mobileOpen={sidebarOpen}
          onMobileToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header / Breadcrumb Bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
                aria-label="Toggle navigation menu"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}

            {/* Breadcrumb path */}
            <nav className="flex items-center text-xs text-gray-500 gap-1.5 font-medium">
              <Link to="/admin" className="flex items-center hover:text-primary transition-colors">
                <Home size={14} className="mr-1" />
                <span>Admin</span>
              </Link>
              <ChevronRight size={12} className="text-gray-400" />
              <span className="text-gray-900 font-semibold">{getBreadcrumb(location.pathname)}</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
              ● System Online
            </span>
          </div>
        </header>

        {/* Dynamic Route View */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/buses" element={<BusesPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/schedules" element={<SchedulesPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/seats" element={<SeatManagementPage />} />
            <Route path="/settings" element={<AdminSettingsPage />} />
            <Route
              path="/help"
              element={
                <div className="p-6 max-w-2xl">
                  <h1 className="text-2xl font-bold text-gray-900">Admin Operations Help</h1>
                  <p className="text-sm text-gray-600 mt-2">
                    For system anomalies, database synchronization issues, or driver terminal connectivity:
                  </p>
                  <div className="mt-4 p-4 rounded-lg bg-white border border-gray-200 shadow-sm space-y-2 text-sm">
                    <p><strong>Hotline:</strong> +91 1800 200 4567</p>
                    <p><strong>Engineering Support:</strong> ops-support@bluebus.com</p>
                    <p><strong>Internal Shift:</strong> 24/7 Dispatch Control Room</p>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;