import React from 'react';
import QuickActions from './QuickActions';
import Calendar from './Calendar';
import CustomerCRM from './CustomerCRM';
// Icons no longer needed for stats
import './Dashboard.css';

const Dashboard = () => {

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome back!</h1>
          <p className="dashboard-subtitle">Here's what's happening with your business today.</p>
        </div>
        <div className="dashboard-date">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Quick Actions replacing top stats */}
      <div className="quick-actions-header">
        <QuickActions />
      </div>

      {/* Full-width Calendar Section */}
      <div className="calendar-full-section">
        <Calendar />
      </div>

      {/* Full-width CRM Section */}
      <div className="crm-full-section">
        <CustomerCRM />
      </div>
    </div>
  );
};

export default Dashboard;