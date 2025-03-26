
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { useDailyCare } from '@/contexts/dailyCare';
import PottyBreakGroupSelector from '@/components/dogs/components/care/potty/PottyBreakGroupSelector';
import { useToast } from '@/components/ui/use-toast';
import { DogCareCard } from '@/components/dashboard/DogCareCard';
import { recordCareActivity } from '@/services/careService';
import { EmptyState } from '@/components/ui/standardized';
import { Plus, Dog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DailyCareTabProps {
  onRefreshDogs: () => void;
  isRefreshing?: boolean;
  currentDate?: Date;
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ 
  onRefreshDogs,
  isRefreshing = false,
  currentDate = new Date()
}) => {
  const { toast } = useToast();
  const [view, setView] = useState<string>('table'); // Default to table view
  const { fetchAllDogsWithCareStatus } = useDailyCare();
  const navigate = useNavigate();
  
  // Fetch all dogs for care dashboard
  const { data: dogs, isLoading, refetch } = useQuery({
    queryKey: ['dashboardDogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('id, name, photo_url, breed, color')
        .order('name');
      
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to load dogs.',
          variant: 'destructive',
        });
        throw error;
      }
      
      return data || [];
    },
  });
  
  // Fetch dogs with care status for the time table
  const { data: dogStatuses, isLoading: isStatusesLoading } = useQuery({
    queryKey: ['dogCareStatuses', currentDate],
    queryFn: async () => {
      return await fetchAllDogsWithCareStatus(currentDate, true);
    },
    enabled: view === 'table' || view === 'groups', // Fetch for both table and groups views
  });

  // Handle group potty break logging
  const handleGroupPottyBreak = async (dogIds: string[]) => {
    if (!dogIds.length) return;
    
    try {
      // Log potty break for each dog in the group
      const timestamp = new Date().toISOString();
      const promises = dogIds.map(dogId => 
        recordCareActivity({
          dog_id: dogId,
          activity_type: 'potty',
          timestamp,
          notes: 'Group potty break'
        })
      );
      
      await Promise.all(promises);
      
      toast({
        title: 'Potty Break Recorded',
        description: `Potty break recorded for ${dogIds.length} dogs.`,
      });
      
      // Refresh data
      refetch();
    } catch (error) {
      console.error('Error recording group potty break:', error);
      toast({
        title: 'Error',
        description: 'Failed to record potty break.',
        variant: 'destructive',
      });
    }
  };
  
  const handleNavigateToDogs = () => {
    navigate('/dogs');
  };
  
  const handleRefresh = async () => {
    try {
      await refetch();
      toast({
        title: 'Refreshed',
        description: 'Dog data has been refreshed.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh data.',
        variant: 'destructive',
      });
    }
  };
  
  const showLoading = isLoading || isRefreshing || isStatusesLoading;
  const noDogs = (!dogs || dogs.length === 0) && !showLoading;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daily Care</h2>
        <div className="flex items-center space-x-4">
          <Tabs value={view} onValueChange={setView} className="mr-2">
            <TabsList>
              <TabsTrigger value="table">Time Table</TabsTrigger>
              <TabsTrigger value="groups">
                <Users className="h-4 w-4 mr-2" />
                Groups
              </TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${showLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {showLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : noDogs ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={<Dog className="h-12 w-12 text-muted-foreground" />}
              title="No Dogs Found"
              description="Add dogs to your kennel to start tracking their daily care activities."
              action={{
                label: "Add Dogs",
                onClick: handleNavigateToDogs
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Tabs value={view} className="w-full">
          <TabsContent value="table" className="w-full">
            {dogStatuses && dogStatuses.length > 0 ? (
              <DogTimeTable 
                dogsStatus={dogStatuses} 
                onRefresh={handleRefresh} 
                isRefreshing={isRefreshing || isStatusesLoading} 
                currentDate={currentDate}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Care Data Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No care data available for your dogs.</p>
                  <Button onClick={onRefreshDogs} className="mt-4">Try Again</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="groups">
            {dogStatuses && dogStatuses.length > 0 ? (
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Select a dog group to quickly record potty breaks for multiple dogs at once.
                </p>
                <PottyBreakGroupSelector 
                  dogs={dogStatuses} 
                  onGroupSelected={handleGroupPottyBreak} 
                />
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Dogs Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Add dogs to start creating groups.</p>
                  <Button onClick={onRefreshDogs} className="mt-4">Try Again</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="cards">
            {dogs && dogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dogs.map((dog) => (
                  <DogCareCard key={dog.id} dog={dog} />
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Dogs Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Add dogs to start tracking their care activities.</p>
                  <Button onClick={handleNavigateToDogs} className="mt-4 gap-2">
                    <Plus className="h-4 w-4" />
                    Add Dogs
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default DailyCareTab;
