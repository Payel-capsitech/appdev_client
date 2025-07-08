import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import DashboardLayout from "./components/layout/DashboardLayout";
import BusinessDetails from "./components/business/BusinessDetails/BusinessDetails";
import BusinessList from "./components/business/BusinessList";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";

// Temporary simple pages
const TaskPage = () => <div><h2>Tasks Page</h2></div>;
const DeadlinePage = () => <div><h2>Deadlines Page</h2></div>;

// Helper to safely parse user from localStorage
const getUserFromLocalStorage = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined" || storedUser === "null") {
      return null;
    }
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

// Protected route component
const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role: string }) => {
  const token = localStorage.getItem("authToken");
  const user = getUserFromLocalStorage();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Layout for all routes after login */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Admin */}
          <Route
            path="admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* Staff */}
          <Route
            path="staff"
            element={
              <ProtectedRoute role="staff">
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          {/* Manager */}
          <Route
            path="manager"
            element={
              <ProtectedRoute role="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          {/* Common pages */}
          <Route path="clients" element={<BusinessList />} />
          <Route path="business" element={<BusinessList />} />
          <Route path="business/:businessId" element={<BusinessDetails />} />
          <Route path="tasks" element={<TaskPage />} />
          <Route path="deadlines" element={<DeadlinePage />} />

          {/* Default → Go to admin page by default */}
          <Route path="" element={<Navigate to="admin" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
