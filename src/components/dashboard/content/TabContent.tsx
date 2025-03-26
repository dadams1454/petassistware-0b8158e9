
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import DashboardOverview from '../DashboardOverview';
import DailyCareTab from '../tabs/DailyCareTab';
import GroomingTab from '../tabs/GroomingTab';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AlertTriangle } from 'lucide-react';
import { DashboardData, UpcomingEvent, RecentActivity } from '@/services/dashboardService';

interface TabContentProps {
  activeTab: string;
  stats: DashboardData;
  events: UpcomingEvent[];
  activities: RecentActivity[];
  isLoading: boolean;
  onRefreshDogs: () => void;
  isRefreshing: boolean;
  dogStatuses: any[] | null;
  handleErrorReset: () => void;
  currentDate: Date;
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  stats,
  events,
  activities,
  isLoading,
  onRefreshDogs,
  isRefreshing,
  dogStatuses,
  handleErrorReset,
  currentDate
}) => {
  const handleCareLogClick = () => {
    // This function is kept as a placeholder for now
    // In the refactored version, the CareLogDialog is moved to a higher level component
  };

  return (
    <>
      <TabsContent value="overview">
        <ErrorBoundary 
          name="DashboardOverview" 
          onReset={handleErrorReset}
          fallback={
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 my-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">Error in Dashboard Overview</h3>
              </div>
              <p className="text-sm mb-2">There was a problem loading the dashboard overview.</p>
              <button 
                onClick={handleErrorReset}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          }
        >
          <DashboardOverview 
            data={stats}
            isLoading={isLoading}
            onCareLogClick={handleCareLogClick}
          />
        </ErrorBoundary>
      </TabsContent>
      
      <TabsContent value="dailycare">
        <ErrorBoundary 
          name="DailyCareTab" 
          onReset={handleErrorReset}
          fallback={
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 my-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">Error in Daily Care Tab</h3>
              </div>
              <p className="text-sm mb-2">There was a problem loading the daily care information.</p>
              <button 
                onClick={handleErrorReset}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          }
        >
          <DailyCareTab 
            onRefreshDogs={onRefreshDogs} 
            isRefreshing={isRefreshing}
            currentDate={currentDate}
          />
        </ErrorBoundary>
      </TabsContent>
      
      <TabsContent value="grooming">
        <ErrorBoundary 
          name="GroomingTab" 
          onReset={handleErrorReset}
          fallback={
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 my-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">Error in Grooming Tab</h3>
              </div>
              <p className="text-sm mb-2">There was a problem loading the grooming information.</p>
              <button 
                onClick={handleErrorReset}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          }
        >
          <GroomingTab 
            dogStatuses={dogStatuses || []} 
            onRefreshDogs={onRefreshDogs}
          />
        </ErrorBoundary>
      </TabsContent>
    </>
  );
};

export default TabContent;
