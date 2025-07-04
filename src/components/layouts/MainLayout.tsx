import React from "react";
import { Sidebar } from "./Sidebar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "15px" }}>{children}</div>
    </div>
  );
};

export default MainLayout;
