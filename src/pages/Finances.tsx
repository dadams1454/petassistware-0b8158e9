
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { ExpenseTracker } from '@/components/finances/ExpenseTracker';
import { FinancialDashboard } from '@/components/finances/FinancialDashboard';

const Finances: React.FC = () => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Financial Management</h1>
        
        <div className="space-y-8">
          <FinancialDashboard />
          <ExpenseTracker />
        </div>
      </div>
    </PageContainer>
  );
};

export default Finances;
