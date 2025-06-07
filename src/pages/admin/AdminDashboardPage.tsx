import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import BusesPage from './BusesPage';
import UsersPage from './UsersPage';
import RoutesPage from './RoutesPage';
import SchedulesPage from './SchedulesPage';
import TransactionsPage from './TransactionsPage';
import SeatManagementPage from './SeatManagementPage';
// import SettingsPage from './SettingsPage';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/buses" element={<BusesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/schedules" element={<SchedulesPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/seats" element={<SeatManagementPage />} />
          {/* <Route path="/settings" element={<SettingsPage />} /> */}
          <Route path="/help" element={<div className="p-6"><h1 className="text-2xl font-bold">Help & Support</h1></div>} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboardPage;