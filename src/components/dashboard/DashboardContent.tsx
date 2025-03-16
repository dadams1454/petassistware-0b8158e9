
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';

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
  const { dogStatuses, fetchAllDogsWithCareStatus } = useDailyCare();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [careView, setCareView] = useState('timetable'); // Add state for care view tabs

  // Force fetch all dogs on component mount
  useEffect(() => {
    console.log('🚀 DashboardContent mounted - fetching all dogs');
    fetchAllDogsWithCareStatus(new Date(), true)
      .then(dogs => {
        console.log(`✅ DashboardContent: Fetched ${dogs.length} dogs successfully`);
        if (dogs.length === 0) {
          console.warn('⚠️ No dogs were returned from the API');
        }
      })
      .catch(error => {
        console.error('❌ Error fetching dogs in DashboardContent:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dogs. Please try refreshing the page.',
          variant: 'destructive',
        });
      });
  }, [fetchAllDogsWithCareStatus, toast]);

  // Handler for manually refreshing the dog list
  const handleRefreshDogs = () => {
    console.log('🔄 Manual refresh triggered in DashboardContent');
    setIsRefreshing(true);
    fetchAllDogsWithCareStatus(new Date(), true)
      .then(dogs => {
        console.log(`✅ Manually refreshed: ${dogs.length} dogs loaded`);
        toast({
          title: 'Refresh Complete',
          description: `Successfully loaded ${dogs.length} dogs.`,
        });
      })
      .catch(error => {
        console.error('❌ Error during manual refresh:', error);
        toast({
          title: 'Error',
          description: 'Failed to refresh dogs. Please try again.',
          variant: 'destructive',
        });
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  // Filter dogs that have received care today
  const dogsWithCareToday = dogStatuses?.filter(dog => dog.last_care !== null) || [];

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
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="care">Daily Care</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          
          <Button 
            onClick={handleRefreshDogs} 
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Dogs'}
          </Button>
        </div>
        
        <TabsContent value="care">
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md mb-4">
            <p className="text-sm text-green-600 dark:text-green-400">
              🐕 Daily Care Dashboard - {dogStatuses?.length || 0} dogs available
            </p>
          </div>
          
          {/* Care View Tabs */}
          <Tabs value={careView} onValueChange={setCareView} className="mb-4">
            <TabsList>
              <TabsTrigger value="timetable">Time Table</TabsTrigger>
              <TabsTrigger value="dashboard">Care Dashboard</TabsTrigger>
              <TabsTrigger value="history">Care History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timetable" className="mt-4">
              {dogStatuses && dogStatuses.length > 0 ? (
                <DogTimeTable dogsStatus={dogStatuses} onRefresh={handleRefreshDogs} />
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No dogs found. Please refresh or add dogs to the system.</p>
                  <Button onClick={handleRefreshDogs} className="mt-4">Refresh Dogs</Button>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="dashboard">
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
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Care History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Recent care logs will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
