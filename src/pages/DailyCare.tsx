
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Calendar, ClipboardList, Users, Clock, ListChecks } from 'lucide-react';
import { EmptyState } from '@/components/ui/standardized';
import { useRefresh } from '@/contexts/RefreshContext';
import { DailyCareProvider } from '@/contexts/dailyCare';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { useDailyCare } from '@/contexts/dailyCare';
import { useRefreshData } from '@/hooks/useRefreshData';
import { useNavigate } from 'react-router-dom';
import DogLetOutTab from '@/components/facility/DogLetOutTab';
import CareAssignmentTab from '@/components/dogs/components/care/admin/CareAssignmentTab';
import CareTaskScheduler from '@/components/dogs/components/care/admin/CareTaskScheduler';
import StaffHoursTracker from '@/components/dogs/components/care/admin/StaffHoursTracker';

const DailyCareContent: React.FC = () => {
  const { fetchAllDogsWithCareStatus } = useDailyCare();
  const { currentDate } = useRefresh();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('timetable');

  // Use the centralized refresh hook
  const { 
    data: dogStatuses, 
    isLoading, 
    refresh: handleRefresh 
  } = useRefreshData({
    key: 'dogCare',
    fetchData: async () => {
      return await fetchAllDogsWithCareStatus(currentDate, true);
    },
    dependencies: [currentDate],
    loadOnMount: true
  });

  const handleNavigateToDogs = () => {
    navigate('/dogs');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Team Management Center
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Manage staff assignments, track hours, and schedule care tasks
          </p>
        </div>
        <Button onClick={() => handleRefresh(true)} className="gap-2" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="timetable" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Time Table</span>
          </TabsTrigger>
          <TabsTrigger value="staff-hours" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Staff Hours</span>
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Staff Assignments</span>
          </TabsTrigger>
          <TabsTrigger value="scheduler" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            <span>Task Scheduler</span>
          </TabsTrigger>
          <TabsTrigger value="dogletout" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span>Dog Let Out</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timetable" className="mt-0">
          {isLoading ? (
            <Card className="p-8">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            </Card>
          ) : dogStatuses && dogStatuses.length > 0 ? (
            <div className="space-y-6">
              <DogTimeTable 
                dogsStatus={dogStatuses} 
                onRefresh={() => handleRefresh(true)} 
                isRefreshing={isLoading}
                currentDate={currentDate}
              />
            </div>
          ) : (
            <Card className="p-8">
              <EmptyState
                icon={<Users className="h-12 w-12 text-muted-foreground" />}
                title="No Dogs Found"
                description="Add dogs to your kennel to start tracking their daily care activities."
                action={{
                  label: "Add Dogs",
                  onClick: handleNavigateToDogs
                }}
              />
            </Card>
          )}
        </TabsContent>

        <TabsContent value="staff-hours" className="mt-0">
          <StaffHoursTracker />
        </TabsContent>

        <TabsContent value="assignments" className="mt-0">
          <CareAssignmentTab dogStatuses={dogStatuses || []} isLoading={isLoading} onRefresh={handleRefresh} />
        </TabsContent>

        <TabsContent value="scheduler" className="mt-0">
          <CareTaskScheduler dogStatuses={dogStatuses || []} isLoading={isLoading} onRefresh={handleRefresh} />
        </TabsContent>

        <TabsContent value="dogletout" className="mt-0">
          <DogLetOutTab onRefreshDogs={handleRefresh} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Wrap the component with the DailyCareProvider
const DailyCare: React.FC = () => {
  return (
    <DailyCareProvider>
      <DailyCareContent />
    </DailyCareProvider>
  );
};

export default DailyCare;
