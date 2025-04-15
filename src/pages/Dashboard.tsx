
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PageHeader } from '@/components/ui/standardized';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        subtitle={`Welcome back, ${user?.name || 'User'}`}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Dashboard content will go here */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">Dogs</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your kennel's dogs</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">Litters</h2>
          <p className="text-gray-500 dark:text-gray-400">Track breeding and litters</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">Customers</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your customer database</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
