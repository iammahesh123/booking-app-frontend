import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// // Authentication routes
// const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
// const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));

// // Customer routes
const SearchResultsPage = React.lazy(() => import('./pages/customer/SearchResultsPage'));
const BookingPage = React.lazy(() => import('./pages/customer/BookingPage'));
const PassengerInfoPage = React.lazy(() => import('./pages/customer/PassengerInfoPage'));
const BookingConfirmationPage = React.lazy(() => import('./pages/customer/BookingConfirmationPage'));
const MyBookingsPage = React.lazy(() => import('./pages/customer/MyBookingsPage'));
// const ProfilePage = React.lazy(() => import('./pages/customer/ProfilePage'));

// // Admin routes
// const AdminDashboardPage = React.lazy(() => import('./pages/admin/DashboardPage'));

// // Agent routes
// const AgentDashboardPage = React.lazy(() => import('./pages/agent/DashboardPage'));

// Route guards
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <React.Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/booking/:scheduleId" element={<BookingPage />} />
            <Route 
              path="/booking/:scheduleId/passengers" 
              element={
                <ProtectedRoute>
                  <PassengerInfoPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/booking/confirmation/:bookingId" 
              element={
                <ProtectedRoute>
                  <BookingConfirmationPage />
                </ProtectedRoute>
              } 
            />
                        <Route 
              path="/bookings" 
              element={
                <ProtectedRoute>
                  <MyBookingsPage />
                </ProtectedRoute>
              } 
            />
             {/* Admin Routes */}
             <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </React.Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;