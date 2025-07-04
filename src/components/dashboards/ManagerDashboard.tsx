import React from "react";
import DashboardLayout from "./DashboardLayout";
import RoleBanner from "./RoleBanner";

const ManagerDashboard: React.FC = () => (
  <DashboardLayout>
    <RoleBanner role="manager" />
    <p>✔️ Manager can view reports and manage staff data.</p>
  </DashboardLayout>
);

export default ManagerDashboard;