
import React, { useEffect, useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import CareDashboard from '@/components/dogs/components/care/CareDashboard';
import DogRotationSchedule from '@/components/dogs/components/care/DogRotationSchedule';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { useDailyCare } from '@/contexts/dailyCare';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { Dog, Clock, Calendar } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const DailyCare: React.FC = () => {
  const { loading, dogStatuses, fetchAllDogsWithCareStatus } = useDailyCare();
  const [activeTab, setActiveTab] = useState('timeTable'); // Default to timeTable
  
  // Add state for cared-for dogs
  const [dogsWithCare, setDogsWithCare] = useState<DogCareStatus[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Manually trigger refresh function
  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh triggered in DailyCare page');
    setRefreshTrigger(prev => prev + 1);
    // Force fetch with refresh flag
    fetchAllDogsWithCareStatus(new Date(), true)
      .then(dogs => {
        console.log(`✅ Manually refreshed: ${dogs.length} dogs loaded`);
      })
      .catch(error => {
        console.error('❌ Error during manual refresh:', error);
      });
  };

  // Fetch all dogs on component mount, when fetchAllDogsWithCareStatus changes,
  // or when refreshTrigger is updated
  useEffect(() => {
    console.log('🚀 DailyCare page mount or refresh triggered - fetching dogs data');
    
    // Force a fetch on component mount to ensure we have data
    fetchAllDogsWithCareStatus(new Date(), true)
      .then(dogs => {
        console.log('✅ Fetched dogs count:', dogs.length);
        if (dogs.length > 0) {
          console.log('🐕 Dog names:', dogs.map(d => d.dog_name).join(', '));
          
          // Filter dogs that have received care
          const caredForDogs = dogs.filter(dog => dog.last_care !== null);
          setDogsWithCare(caredForDogs);
        } else {
          console.warn('⚠️ No dogs returned from API call');
        }
      })
      .catch(error => {
        console.error('❌ Error fetching dogs on DailyCare mount:', error);
      });
  }, [fetchAllDogsWithCareStatus, refreshTrigger]);

  console.log('Rendering DailyCare page with activeTab:', activeTab);

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Daily Care
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Track and log daily care activities for all your dogs
            {dogStatuses ? ` (${dogStatuses.length} dogs)` : ' (Loading...)'}
          </p>
        </div>
        <Button onClick={handleManualRefresh} className="ml-auto">
          Refresh Dogs
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="timeTable">Time Table</TabsTrigger>
          <TabsTrigger value="care">Daily Care</TabsTrigger>
          <TabsTrigger value="rotation">Dog Rotation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeTable" className="mt-4">
          <div className="text-sm text-muted-foreground mb-2">
            👆 Debug: Tab content for "timeTable" is now displaying
          </div>

          {dogStatuses && dogStatuses.length > 0 ? (
            <DogTimeTable dogsStatus={dogStatuses} onRefresh={handleManualRefresh} />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No dogs found. Please refresh or add dogs to the system.</p>
              <Button onClick={handleManualRefresh} className="mt-4">Refresh Dogs</Button>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="care">
          {/* Care Activity Summary */}
          {dogsWithCare.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Today's Care Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dogsWithCare.map(dog => (
                    <div key={dog.dog_id} className="flex items-start p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex-shrink-0 mr-3">
                        {dog.dog_photo ? (
                          <img src={dog.dog_photo} alt={dog.dog_name} className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Dog className="h-5 w-5 text-primary" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{dog.dog_name}</h3>
                        <p className="text-sm text-muted-foreground">{dog.last_care?.category}: {dog.last_care?.task_name}</p>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {dog.last_care && format(parseISO(dog.last_care.timestamp), 'h:mm a')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <CareDashboard />
        </TabsContent>
        
        <TabsContent value="rotation">
          <DogRotationSchedule />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default DailyCare;
