
import React from 'react';
import Dashboard from './Dashboard';

// This is a simple wrapper around the Dashboard component to maintain backward compatibility
// with code that imports DashboardPage
const DashboardPage: React.FC = () => {
  return <Dashboard />;
};

export default DashboardPage;
