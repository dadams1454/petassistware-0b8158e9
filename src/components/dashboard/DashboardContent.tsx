
import React from 'react';
import DashboardOverview from './DashboardOverview';
import RecentActivities from './RecentActivities';
import UpcomingEvents from './UpcomingEvents';
import QuickActions from './QuickActions';
import TabsList from './tabs/TabsList';
import { Clock, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { useDailyCare } from '@/contexts/dailyCare';

interface DashboardContentProps {
  isLoading: boolean;
  stats: any;
  events: any[];
  activities: any[];
  onRefresh?: () => void;
  nextRefreshTime?: string;
  onCareLogClick?: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  isLoading,
  stats,
  events,
  activities,
  onRefresh,
  nextRefreshTime,
  onCareLogClick = () => {}
}) => {
  // Get dog statuses for the tabs
  const { dogStatuses } = useDailyCare();

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      {onRefresh && (
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>Next auto-refresh: {nextRefreshTime || '15:00'}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Dashboard
          </Button>
        </div>
      )}
      
      {/* Stats overview */}
      <DashboardOverview 
        stats={stats} 
        isLoading={isLoading} 
        events={events}
        activities={activities}
        onCareLogClick={onCareLogClick}
      />
      
      {/* Quick actions */}
      <QuickActions onCareLogClick={onCareLogClick} />
      
      {/* Main content layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Tabs for daily care, exercise, etc. */}
          <TabsList
            isLoading={isLoading}
            onRefresh={onRefresh}
            isRefreshing={isLoading}
            dogStatuses={dogStatuses}
          />
        </div>
        
        <div className="space-y-6">
          {/* Upcoming events card */}
          <UpcomingEvents events={events} isLoading={isLoading} />
          
          {/* Recent activities card */}
          <RecentActivities activities={activities} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
