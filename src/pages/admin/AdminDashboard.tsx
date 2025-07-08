import React from 'react';
import BusinessList from '../../components/business/BusinessList';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <BusinessList />
    </div>
  );
};

export default AdminDashboard;
