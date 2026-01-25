import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import { AuthModalProvider, useAuthModal } from "./context/AuthModalContext";

// Pages
import HomePage from "./pages/HomePage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ProfilePage from "./pages/customer/ProfilePage";
import PaymentPage from "./components/booking/PaymentPage";
import AuthModal from "./components/auth/AuthModal";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRedirect from "./components/auth/RoleRedirect";


// Lazy pages
const SearchResultsPage = React.lazy(() => import("./pages/customer/SearchResultsPage"));
const BookingPage = React.lazy(() => import("./pages/customer/BookingPage"));
const PassengerInfoPage = React.lazy(() => import("./pages/customer/PassengerInfoPage"));
const BookingConfirmationPage = React.lazy(() => import("./pages/customer/BookingConfirmationPage"));
const MyBookingsPage = React.lazy(() => import("./pages/customer/MyBookingsPage"));

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <>
      <AuthProvider>
        <AuthModalProvider>
          <Router>
            <React.Suspense fallback={<Loader />}>
              <AuthModalWrapper />

              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/search" element={<SearchResultsPage />} />

                {/* ✅ after login, send them here */}
                <Route
                  path="/redirect"
                  element={
                    <ProtectedRoute>
                      <RoleRedirect />
                    </ProtectedRoute>
                  }
                />

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

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </React.Suspense>
          </Router>
        </AuthModalProvider>
      </AuthProvider>

      <Toaster toastOptions={{ duration: 2000 }} />
    </>
  );
};

const AuthModalWrapper = () => {
  const { isOpen, type, closeModal, switchType } = useAuthModal();

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={closeModal}
      type={type}
      onSwitchType={switchType}
    />
  );
};

export default App;
