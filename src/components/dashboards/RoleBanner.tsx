import React from "react";

const RoleBanner: React.FC<{ role: string }> = ({ role }) => (
  <div className="mb-3 text-center">
    <h2>Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}!</h2>
    <p>This is your {role} dashboard.</p>
  </div>
);

export default RoleBanner;