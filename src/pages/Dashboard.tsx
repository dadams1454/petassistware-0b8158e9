
import React, { useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useDashboardData } from '@/components/dashboard/useDashboardData';
import { useToast } from "@/components/ui/use-toast";

const Dashboard: React.FC = () => {
  const { isLoading, stats, events, activities } = useDashboardData();
  const { toast } = useToast();
  
  // Show welcome toast only once when Dashboard loads
  useEffect(() => {
    console.log('🚀 Dashboard page loaded');
    
    // Show a welcome toast that now mentions the Overview tab as default
    toast({
      title: "Welcome to your dashboard",
      description: "The Overview tab gives you a complete picture of your kennel's activities.",
      duration: 5000,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Welcome back! View your kennel overview and manage dog care below.
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
