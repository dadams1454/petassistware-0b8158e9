
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/standardized';
import ExpenseTracker from '@/components/finances/ExpenseTracker';
import FinancialDashboard from '@/components/finances/FinancialDashboard';
import ReceiptManager from '@/components/finances/ReceiptManager';
import PageContainer from '@/components/common/PageContainer';

const Finances = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <PageHeader 
          title="Financial Management"
          subtitle="Track expenses, income, and financial metrics for your kennel"
        />
        
        <Tabs defaultValue="dashboard" onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <FinancialDashboard />
          </TabsContent>
          
          <TabsContent value="expenses">
            <ExpenseTracker />
          </TabsContent>
          
          <TabsContent value="receipts">
            <ReceiptManager />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Finances;
