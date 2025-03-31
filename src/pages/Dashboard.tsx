import React from 'react';
import { SectionHeader } from '@/components/ui/standardized';
import FinancialDashboardWidget from '@/components/finances/FinancialDashboardWidget';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Dashboard" 
        description="Welcome to your kennel management dashboard"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FinancialDashboardWidget />
        {/* Add more dashboard widgets here as they are developed */}
      </div>
    </div>
  );
};

export default Dashboard;
