import React from "react";
import DashboardLayout from "./DashboardLayout";
import RoleBanner from "./RoleBanner";

const StaffDashboard: React.FC = () => (
  <DashboardLayout>
    <RoleBanner role="staff" />
    <p>✔️ Staff can manage their tasks and view their own reports.</p>
  </DashboardLayout>
);

export default StaffDashboard;