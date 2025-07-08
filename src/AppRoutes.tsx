import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import BusinessList from "./components/business/BusinessList";
import BusinessDetails from "./components/business/BusinessDetails/BusinessDetails";
import LoginPage from "./components/auth/Login";
import RegisterPage from "./components/auth/Register";

export default function AppRoutes() {
  const isAuthenticated = !!localStorage.getItem("authToken");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}
        >
          <Route path="business" element={<BusinessList />} />
          <Route path="business/:businessId" element={<BusinessDetails />} />
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard/business" : "/login"} />} />
      </Routes>
    </Router>
  );
}
