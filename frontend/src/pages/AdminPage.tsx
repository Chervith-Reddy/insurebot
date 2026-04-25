import React from 'react';
import AdminDashboard from '../components/AdminDashboard';

const AdminPage: React.FC = () => {
  return (
    <div className="page-container">
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">
          Manage insurance claims, update statuses, and view analytics.
        </p>
      </div>

      <div
        className="alert alert-warning"
        style={{ marginBottom: 24 }}
      >
        <span>⚠️</span>
        <span>
          <strong>Admin Area:</strong> This dashboard is for authorized personnel only.
          All status changes trigger email notifications to claimants.
        </span>
      </div>

      <AdminDashboard />
    </div>
  );
};

export default AdminPage;
