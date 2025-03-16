
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CareDashboard from '@/components/dogs/components/care/CareDashboard';
import DashboardOverview from './DashboardOverview';
import { DashboardStats, UpcomingEvent, RecentActivity } from '@/services/dashboardService';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import DogSelector from '@/components/dashboard/DogSelector';
import CareLogForm from '@/components/dogs/components/care/CareLogForm';

interface DashboardContentProps {
  isLoading: boolean;
  stats: DashboardStats;
  events: UpcomingEvent[];
  activities: RecentActivity[];
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  isLoading,
  stats,
  events,
  activities,
}) => {
  const [activeTab, setActiveTab] = useState('care'); // Default to care tab
  const [careLogDialogOpen, setCareLogDialogOpen] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);

  const handleCareLogClick = () => {
    setCareLogDialogOpen(true);
  };

  const handleCareLogSuccess = () => {
    setCareLogDialogOpen(false);
    setSelectedDogId(null);
  };

  const handleDogSelected = (dogId: string) => {
    setSelectedDogId(dogId);
  };

  // Add debugging to track active tab changes
  console.log(`🔍 DashboardContent - Active Tab: ${activeTab}`);

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="care">Daily Care</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="care">
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md mb-4">
            <p className="text-sm text-green-600 dark:text-green-400">
              🐕 Daily Care Dashboard - Your dogs will appear below
            </p>
          </div>
          <CareDashboard />
        </TabsContent>
        
        <TabsContent value="overview">
          <DashboardOverview 
            isLoading={isLoading}
            stats={stats}
            events={events}
            activities={activities}
            onCareLogClick={handleCareLogClick}
          />
        </TabsContent>
      </Tabs>

      {/* Daily Care Log Dialog */}
      <Dialog open={careLogDialogOpen} onOpenChange={setCareLogDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogTitle className="text-xl font-semibold">
            {selectedDogId ? 'Log Daily Care' : 'Select a Dog'}
          </DialogTitle>
          {!selectedDogId ? (
            <DogSelector onDogSelected={handleDogSelected} />
          ) : (
            <CareLogForm dogId={selectedDogId} onSuccess={handleCareLogSuccess} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardContent;
