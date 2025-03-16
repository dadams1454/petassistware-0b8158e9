
import React, { useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useDashboardData } from '@/components/dashboard/useDashboardData';
import { useToast } from "@/components/ui/use-toast";

const Dashboard: React.FC = () => {
  const { isLoading, stats, events, activities } = useDashboardData();
  const { toast } = useToast();
  
  // Add an effect to log when the Dashboard page loads and display a welcome toast
  useEffect(() => {
    console.log('🚀 Dashboard page loaded');
    
    // Show a welcome toast that also informs about the default Daily Care tab
    toast({
      title: "Welcome to your dashboard",
      description: "The Daily Care tab is now shown by default for quick access to your dogs.",
      duration: 5000,
    });
  }, [toast]);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Welcome back! Manage your dogs' daily care activities below.
        </p>
      </div>

      <DashboardContent 
        isLoading={isLoading}
        stats={stats}
        events={events}
        activities={activities}
      />
    </MainLayout>
  );
};

export default Dashboard;
