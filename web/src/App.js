import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

// --- CORE UTILITIES & CONTEXT ---
import { AuthProvider } from "./components/AuthContext";
import { EventProvider } from "./components/EventContext"; // For real-time events
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// --- STRIPE IMPORTS & SETUP ---
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// --- CORE LAYOUTS ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from './components/admin/AdminLayout';
import EmployeeLayout from './components/employee/EmployeeLayout';
import ClientLayout from './components/client/ClientLayout';

// --- ALL PAGES ---
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageEvents from "./components/admin/ManageEvents";
import ManageTickets from "./components/admin/ManageTickets";
import ManageUsers from "./components/admin/ManageUser";
import AdminReports from "./components/admin/AdminReports";
import AdminSettings from "./components/admin/AdminSettings";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import ClientsPage from "./components/employee/ClientsPage";
import NewUsersPage from "./components/employee/NewUsersPage";
import AnalyticsPage from "./components/employee/AnalyticsPage";
import SettingsPage from "./components/employee/SettingsPage";
import ClientDashboard from "./components/client/ClientDashboard";
import MyTicketsPage from "./components/client/MyTicketsPage";
import ClientProfilePage from "./components/client/ClientProfilePage";
import HistoryPage from "./components/client/HistoryPage";

// Load your Stripe Publishable Key from the .env file
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

/**
 * AppLayout is the central component that manages the page structure and routes.
 */
const AppLayout = () => {
  const location = useLocation();
  const isProtectedRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/employee') || location.pathname.startsWith('/client');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isProtectedRoute && <Navbar />}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          {/* === Public Routes === */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* === Payment Flow Routes === */}
          <Route path="/checkout/:eventId" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
          
          {/* === Admin Nested Routes === */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="tickets" element={<ManageTickets />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* === Employee Nested Routes === */}
          <Route path="/employee" element={<ProtectedRoute allowedRoles={["employee", "admin"]}><EmployeeLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<EmployeeDashboard />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="new-users" element={<NewUsersPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* === Client Nested Routes === */}
          <Route path="/client" element={<ProtectedRoute allowedRoles={["client", "admin"]}><ClientLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="tickets" element={<MyTicketsPage />} />
            <Route path="profile" element={<ClientProfilePage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* === Catch-All Route === */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isProtectedRoute && <Footer />}
    </div>
  );
};

/**
 * The root App component. Its only job is to set up the providers and the router.
 */
function App() {
  return (
    <AuthProvider>
      <EventProvider>
        
          <ScrollToTop />
          <Elements stripe={stripePromise}>
            <AppLayout />
          </Elements>
        
      </EventProvider>
    </AuthProvider>
  );
}

export default App;