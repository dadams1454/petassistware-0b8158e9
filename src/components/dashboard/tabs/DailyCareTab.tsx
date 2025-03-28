import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users, Dog, Plus, Building2, Baby, StickyNote } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { useDailyCare } from '@/contexts/dailyCare';
import PottyBreakGroupSelector from '@/components/dogs/components/care/potty/PottyBreakGroupSelector';
import { useToast } from '@/components/ui/use-toast';
import { DogCareCard } from '@/components/dashboard/DogCareCard';
import { recordCareActivity } from '@/services/careService';
import { EmptyState, SectionHeader } from '@/components/ui/standardized';
import { useNavigate } from 'react-router-dom';
import { DogCareStatus } from '@/types/dailyCare';
import { careCategories } from '@/components/dogs/components/care/CareCategories';
import PottyBreakManager from '@/components/dogs/components/care/potty/PottyBreakManager';
import FeedingTab from '@/components/dashboard/tabs/FeedingTab';
import PottyBreaksTab from '@/components/dashboard/tabs/PottyBreaksTab';
import MedicationsTab from '@/components/dashboard/tabs/MedicationsTab';
import GroomingTab from '@/components/dashboard/tabs/GroomingTab';
import NotesTab from '@/components/dashboard/tabs/NotesTab';
import FacilityTab from '@/components/dashboard/tabs/FacilityTab';

interface DailyCareTabProps {
  onRefreshDogs: () => void;
  isRefreshing?: boolean;
  currentDate?: Date;
  dogStatuses?: DogCareStatus[];
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ 
  onRefreshDogs,
  isRefreshing = false,
  currentDate = new Date(),
  dogStatuses = []
}) => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<string>('table'); // 'table', 'cards', or 'groups'
  const [careCategory, setCareCategory] = useState<string>('pottybreaks'); // Default to potty breaks
  const { fetchAllDogsWithCareStatus } = useDailyCare();
  const navigate = useNavigate();
  
  // Fetch all dogs for care dashboard if not provided
  const { data: dogs, isLoading, refetch } = useQuery({
    queryKey: ['dashboardDogs'],
    queryFn: async () => {
      if (dogStatuses && dogStatuses.length > 0) return dogStatuses;
      
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
  
  // Fetch dogs with care status for the time table if not provided
  const { data: loadedDogStatuses, isLoading: isStatusesLoading } = useQuery({
    queryKey: ['dogCareStatuses', currentDate],
    queryFn: async () => {
      if (dogStatuses && dogStatuses.length > 0) return dogStatuses;
      return await fetchAllDogsWithCareStatus(currentDate, true);
    },
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
      onRefreshDogs();
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
  
  // Get the effective dog statuses - either from props or from the query
  const effectiveDogStatuses = dogStatuses && dogStatuses.length > 0 
    ? dogStatuses 
    : loadedDogStatuses || [];
    
  const showLoading = isLoading || isRefreshing || isStatusesLoading;
  const noDogs = (!effectiveDogStatuses || effectiveDogStatuses.length === 0) && !showLoading;
  
  // Get the current category info
  const currentCategory = careCategories.find(c => c.id === careCategory) || careCategories[0];
  
  // Determine which tab component to show based on the category
  const renderCategoryContent = () => {
    switch (careCategory) {
      case 'pottybreaks':
        return (
          <PottyBreaksTab 
            onRefreshDogs={handleRefresh}
            dogStatuses={effectiveDogStatuses}
          />
        );
      case 'feeding':
        return (
          <FeedingTab 
            dogStatuses={effectiveDogStatuses} 
            onRefreshDogs={handleRefresh}
          />
        );
      case 'medication':
        return (
          <MedicationsTab 
            dogStatuses={effectiveDogStatuses} 
            onRefreshDogs={handleRefresh}
          />
        );
      case 'grooming':
        return (
          <GroomingTab 
            dogStatuses={effectiveDogStatuses} 
            onRefreshDogs={handleRefresh}
          />
        );
      case 'notes':
        return (
          <NotesTab
            dogStatuses={effectiveDogStatuses}
            onRefreshDogs={handleRefresh}
          />
        );
      case 'facility':
        return (
          <FacilityTab
            onRefreshData={handleRefresh}
            dogStatuses={effectiveDogStatuses}
          />
        );
      case 'puppies':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="h-5 w-5 text-primary" />
                <span>Puppy Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Baby className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Puppy management features are currently under development. Soon you'll be able to track feeding schedules, weight tracking, and development milestones for your puppies.
                </p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {currentCategory.name} tracking is coming soon! Check back for updates.
              </p>
            </CardContent>
          </Card>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Daily Care"
        description="Track all care activities for your dogs"
        action={{
          label: "Refresh",
          onClick: handleRefresh,
          icon: <RefreshCw className={`h-4 w-4 ${showLoading ? "animate-spin" : ""}`} />
        }}
      />
      
      {/* Main category tabs */}
      <Tabs value={careCategory} onValueChange={setCareCategory} className="w-full">
        <TabsList className="w-full justify-start overflow-auto p-1 bg-background border-b">
          {careCategories.map(category => (
            <TabsTrigger 
              key={category.id} 
              value={category.id} 
              className="flex items-center gap-2 data-[state=active]:bg-muted"
            >
              {category.icon}
              <span>{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {/* View mode selector - only for potty breaks or other suitable categories */}
      {(careCategory === 'pottybreaks') && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {currentCategory.icon}
            <span>{currentCategory.name}</span>
          </h3>
          <Tabs value={viewMode} onValueChange={setViewMode} className="mr-2">
            <TabsList>
              <TabsTrigger value="table">Time Table</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="groups">
                <Users className="h-4 w-4 mr-2" />
                Groups
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}
      
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
        <>
          {/* For potty breaks, show the view mode options */}
          {careCategory === 'pottybreaks' ? (
            <Tabs value={viewMode} className="w-full">
              {/* Table View */}
              <TabsContent value="table" className="w-full">
                <DogTimeTable 
                  dogsStatus={effectiveDogStatuses} 
                  onRefresh={handleRefresh} 
                  isRefreshing={showLoading} 
                  currentDate={currentDate}
                  hideTopLevelTabs={true} // Hide the duplicate category tabs
                  initialCategory={careCategory} // Pass the selected category
                />
              </TabsContent>
              
              {/* Card View */}
              <TabsContent value="cards">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {effectiveDogStatuses.map((dog) => (
                    <DogCareCard 
                      key={dog.dog_id} 
                      dog={{
                        id: dog.dog_id,
                        name: dog.dog_name,
                        photo_url: dog.dog_photo
                      }} 
                    />
                  ))}
                </div>
              </TabsContent>
              
              {/* Groups View */}
              <TabsContent value="groups">
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    Select a dog group to quickly record potty breaks for multiple dogs at once.
                  </p>
                  <PottyBreakGroupSelector 
                    dogs={effectiveDogStatuses} 
                    onGroupSelected={handleGroupPottyBreak} 
                  />
                  <PottyBreakManager 
                    dogs={effectiveDogStatuses}
                    onRefresh={handleRefresh}
                  />
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            /* For other categories, show the dedicated tab content */
            renderCategoryContent()
          )}
        </>
      )}
    </div>
  );
};

export default DailyCareTab;
