import React, { ReactNode } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DashboardLayout: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="container mt-5">
    <div className="card p-4 shadow-sm">
      {children}
    </div>
  </div>
);

export default DashboardLayout;