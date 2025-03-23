
import React, { useState } from 'react';
import PageContainer from '@/components/common/PageContainer';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useDashboardData } from '@/components/dashboard/useDashboardData';
import { Button } from '@/components/ui/button';
import { Settings, RefreshCw } from 'lucide-react';
import DashboardSettingsDialog from '@/components/dashboard/settings/DashboardSettingsDialog';
import { format } from 'date-fns';
import { useRefresh } from '@/contexts/refreshContext';

const Dashboard: React.FC = () => {
  // Use the hook to fetch all dashboard data with React Query
  const { isLoading, stats, events, activities, refetch } = useDashboardData();
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const { lastRefreshTime, handleRefresh } = useRefresh('dashboard');
  
  const handleRefreshClick = () => {
    console.log('🔄 Manual refresh triggered from Dashboard');
    // Use our manual refetch function from React Query
    refetch(true);
    handleRefresh(true);
  };
  
  // Format the timestamp safely
  const formattedTime = lastRefreshTime ? format(lastRefreshTime, 'HH:mm:ss') : format(new Date(), 'HH:mm:ss');
  
  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            Last refreshed: {formattedTime}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefreshClick}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSettingsDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Settings size={16} />
            <span className="hidden sm:inline">Customize Dashboard</span>
            <span className="sm:hidden">Settings</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <DashboardContent 
          isLoading={isLoading}
          stats={stats}
          events={events || []}
          activities={activities || []}
        />
      </div>

      <DashboardSettingsDialog 
        open={settingsDialogOpen} 
        onOpenChange={setSettingsDialogOpen} 
      />
    </PageContainer>
  );
};

export default Dashboard;
