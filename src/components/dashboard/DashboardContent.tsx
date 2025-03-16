
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CareDashboard from '@/components/dogs/components/care/CareDashboard';
import DashboardOverview from './DashboardOverview';
import { DashboardStats, UpcomingEvent, RecentActivity } from '@/services/dashboardService';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import DogSelector from '@/components/dashboard/DogSelector';
import CareLogForm from '@/components/dogs/components/care/CareLogForm';
import { useDailyCare } from '@/contexts/dailyCare';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dog, Calendar } from 'lucide-react';

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
  const { dogStatuses } = useDailyCare();

  // Filter dogs that have received care today
  const dogsWithCareToday = dogStatuses?.filter(dog => dog.last_care !== null) || [];

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
  useEffect(() => {
    console.log(`🔍 DashboardContent - Active Tab: ${activeTab}`);
  }, [activeTab]);

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
          
          {/* Recent Care History Card */}
          {dogsWithCareToday.length > 0 && (
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Dogs Cared For Today ({dogsWithCareToday.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dogsWithCareToday.map(dog => (
                    <div key={dog.dog_id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                      <div className="flex items-center">
                        {dog.dog_photo ? (
                          <img src={dog.dog_photo} alt={dog.dog_name} className="h-8 w-8 rounded-full mr-2 object-cover" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <Dog className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{dog.dog_name}</p>
                          <p className="text-xs text-muted-foreground">{dog.last_care?.category}: {dog.last_care?.task_name}</p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {dog.last_care && format(parseISO(dog.last_care.timestamp), 'h:mm a')}
                      </div>
                    </div>
                  ))}
                </div>
                
                {dogsWithCareToday.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No dogs have been recorded for care today.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
          
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
