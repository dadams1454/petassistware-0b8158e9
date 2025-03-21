
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import DashboardOverview from './DashboardOverview';
import { DashboardStats, UpcomingEvent, RecentActivity } from '@/services/dashboardService';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import TabsList from './tabs/TabsList';
import DailyCareTab from './tabs/DailyCareTab';
import GroomingTab from './tabs/GroomingTab';
import CareLogDialog from './dialogs/CareLogDialog';

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
  const [activeTab, setActiveTab] = useState('overview'); // Default to overview tab
  const [careLogDialogOpen, setCareLogDialogOpen] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const { fetchAllDogsWithCareStatus, dogStatuses } = useDailyCare();
  const { toast } = useToast();
  const initialFetchCompleted = useRef(false);

  // Force fetch all dogs on component mount, but only once
  useEffect(() => {
    if (!initialFetchCompleted.current) {
      console.log('🚀 DashboardContent mounted - initial dogs fetch');
      
      fetchAllDogsWithCareStatus(new Date(), true)
        .then(dogs => {
          console.log(`✅ Initial fetch: Loaded ${dogs.length} dogs`);
          initialFetchCompleted.current = true;
        })
        .catch(error => {
          console.error('❌ Error fetching dogs in DashboardContent:', error);
          toast({
            title: 'Error',
            description: 'Failed to load dogs. Please try refreshing the page.',
            variant: 'destructive',
          });
        });
    }
  }, [fetchAllDogsWithCareStatus, toast]);

  const handleCareLogClick = () => {
    setCareLogDialogOpen(true);
  };

  const handleCareLogSuccess = () => {
    setCareLogDialogOpen(false);
    setSelectedDogId(null);
    // Refresh dog statuses
    fetchAllDogsWithCareStatus(new Date(), true);
  };

  const handleDogSelected = (dogId: string) => {
    setSelectedDogId(dogId);
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <TabsContent value="overview">
          <DashboardOverview 
            isLoading={isLoading}
            stats={stats}
            events={events}
            activities={activities}
            onCareLogClick={handleCareLogClick}
          />
        </TabsContent>
        
        <TabsContent value="dailycare">
          <DailyCareTab />
        </TabsContent>
        
        <TabsContent value="grooming">
          <GroomingTab 
            dogStatuses={dogStatuses} 
          />
        </TabsContent>
      </Tabs>

      {/* Daily Care Log Dialog */}
      <CareLogDialog 
        open={careLogDialogOpen}
        onOpenChange={setCareLogDialogOpen}
        selectedDogId={selectedDogId}
        onDogSelected={handleDogSelected}
        onSuccess={handleCareLogSuccess}
      />
    </>
  );
};

export default DashboardContent;
