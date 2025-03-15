
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DailyCareProvider } from '@/contexts/DailyCareProvider';
import CareDashboard from '@/components/dogs/components/care/CareDashboard';
import DashboardOverview from './DashboardOverview';
import { DashboardStats, UpcomingEvent, RecentActivity } from '@/services/dashboardService';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
  const [activeTab, setActiveTab] = useState('overview');
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

  return (
    <>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="care">Daily Care</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <DashboardOverview 
            isLoading={isLoading}
            stats={stats}
            events={events}
            activities={activities}
            onCareLogClick={handleCareLogClick}
          />
        </TabsContent>
        
        <TabsContent value="care">
          <DailyCareProvider>
            <CareDashboard />
          </DailyCareProvider>
        </TabsContent>
      </Tabs>

      {/* Daily Care Log Dialog */}
      <Dialog open={careLogDialogOpen} onOpenChange={setCareLogDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DailyCareProvider>
            {!selectedDogId ? (
              <DogSelector onDogSelected={handleDogSelected} />
            ) : (
              <CareLogForm dogId={selectedDogId} onSuccess={handleCareLogSuccess} />
            )}
          </DailyCareProvider>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardContent;
