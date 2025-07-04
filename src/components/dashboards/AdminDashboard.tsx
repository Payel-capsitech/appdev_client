import React from "react";
import DashboardLayout from "./DashboardLayout";
import RoleBanner from "./RoleBanner";

const AdminDashboard: React.FC = () => (
  <DashboardLayout>
    <RoleBanner role="admin" />
    <p>✔️ Admin can manage users, roles, and all data.</p>
  </DashboardLayout>
);

export default AdminDashboard;