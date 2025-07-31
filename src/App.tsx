
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import BusinessList from "./components/business/BusinessList";
import BusinessDetails from "./components/business/BusinessDetails/BusinessDetails";
import InvoicesPage from "./components/invoice/InvoicePage";

const TaskPage = () => <div><h2>Tasks Page</h2></div>;
const DeadlinePage = () => <div><h2>Deadlines Page</h2></div>;

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

        {/* Routes after login with Dashboard layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="staff"
            element={
              <ProtectedRoute role="staff">
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="manager"
            element={
              <ProtectedRoute role="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="business"
            element={
              <ProtectedRoute role="admin">
                <BusinessList />
              </ProtectedRoute>
            }
          />
          <Route
            path="business/:businessId"
            element={
              <ProtectedRoute role="">
                <BusinessDetails />
              </ProtectedRoute>
            }
          />
          <Route path="clients" element={<BusinessList />} />
          <Route path="Invoices" element={<InvoicesPage />} />
          <Route path="tasks" element={<TaskPage />} />
          <Route path="deadlines" element={<DeadlinePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
