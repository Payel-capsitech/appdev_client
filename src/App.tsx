import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminDashboard from "./components/dashboards/AdminDashboard";
import ManagerDashboard from "./components/dashboards/ManagerDashboard";
import StaffDashboard from "./components/dashboards/StaffDashboard";
import { Sidebar } from "./components/layouts/Sidebar";
import { Header } from "./components/layouts/Header";

// Auth Check
const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

// ProtectedRoute wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

//Layout with Sidebar withHeader
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", height: "100vh" }}>
    {/* Sidebar */}
    <Sidebar />

    {/* Right Section: Header + Content */}
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ flex: 1, padding: "16px", background: "#f9f9f9" }}>
        {children}
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AdminDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ManagerDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <StaffDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
