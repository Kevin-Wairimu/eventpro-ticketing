import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";

function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/" />;

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Role-based protected routes */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoute role="employee">
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/customer-dashboard"
          element={
            <PrivateRoute role="customer">
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
