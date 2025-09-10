import React from "react";
// --- Ensure Router is imported ---
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

// --- Application-Wide Context & Security ---
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// --- 1. Import Stripe's components ---
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// --- Core Layout Components ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/admin/AdminLayout";
// --- ADDED: Employee and Client Layout imports ---
import EmployeeLayout from "./components/employee/EmployeeLayout";
import ClientLayout from "./components/client/ClientLayout";
import CheckoutPage from "./pages/CheckoutPage";

// --- Public Page Components ---
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

// --- Admin Page Components ---
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageEvents from "./components/admin/ManageEvents";
import ManageTickets from "./components/admin/ManageTickets";
import ManageUsers from "./components/admin/ManageUser";
import AdminReports from "./components/admin/AdminReports";
import AdminSettings from "./components/admin/AdminSettings";

// --- Employee Page Components (ensure these files exist) ---
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import ClientsPage from "./components/employee/ClientsPage";
import NewUsersPage from "./components/employee/NewUsersPage";
import AnalyticsPage from "./components/employee/AnalyticsPage";
import SettingsPage from "./components/employee/SettingsPage";

// --- Client Page Components (ensure these files exist) ---
import ClientDashboard from "./components/client/ClientDashboard";
import MyTicketsPage from "./components/client/MyTicketsPage";
import ClientProfilePage from "./components/client/ClientProfilePage";
import HistoryPage from "./components/client/HistoryPage";

const stripePromise = loadStripe("pk_test_...your_publishable_key_from_stripe");

/**
 * AppLayout is the central component that manages the overall page structure.
 */
const AppLayout = () => {
  const location = useLocation();
  // --- UPDATED: This now correctly checks for ALL protected routes ---
  const isProtectedRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/employee") ||
    location.pathname.startsWith("/client");

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {!isProtectedRoute && <Navbar />}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Routes>
          {/* === Public Routes === */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/about"
            element={
              <div style={{ padding: "50px", textAlign: "center" }}>
                <h1>About Us</h1>
              </div>
            }
          />
          <Route
            path="/contact"
            element={
              <div style={{ padding: "50px", textAlign: "center" }}>
                <h1>Contact Us</h1>
              </div>
            }
          />
          <Route
            path="/checkout/:eventId"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          {/* === Admin Nested Routes === */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="tickets" element={<ManageTickets />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* === ADDED: Employee Nested Routes === */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={["employee", "admin"]}>
                <EmployeeLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<EmployeeDashboard />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="new-users" element={<NewUsersPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* === ADDED: Client Nested Routes === */}
          <Route
            path="/client"
            element={
              <ProtectedRoute allowedRoles={["client", "admin"]}>
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="tickets" element={<MyTicketsPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ClientProfilePage />} />
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
 * The root App component.
 */
function App() {
  return (
    <AuthProvider>
      {/* --- UPDATED: Added the essential <Router> wrapper --- */}

      <ScrollToTop />
        <AppLayout />
        
    </AuthProvider>
  );
}

export default App;
