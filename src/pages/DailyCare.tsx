
import React, { useEffect, useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import CareDashboard from '@/components/dogs/components/care/CareDashboard';
import DogRotationSchedule from '@/components/dogs/components/care/DogRotationSchedule';
import { useDailyCare } from '@/contexts/dailyCare';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { Dog, Clock, Calendar } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DailyCare: React.FC = () => {
  const { loading, dogStatuses, fetchAllDogsWithCareStatus } = useDailyCare();
  const [activeTab, setActiveTab] = useState('care');
  
  // Add state for cared-for dogs
  const [dogsWithCare, setDogsWithCare] = useState<DogCareStatus[]>([]);

  // Add debugging effect to check when this component loads and what data it receives
  useEffect(() => {
    console.log('🚀 DailyCare page mounted');
    console.log('🐕 Initial dogStatuses:', dogStatuses?.length || 0);
    
    // Force a fetch on component mount to ensure we have data
    fetchAllDogsWithCareStatus(new Date(), true)
      .then(dogs => {
        console.log('🐕 Fetched dogs count:', dogs.length);
        if (dogs.length > 0) {
          console.log('🐕 Dog names:', dogs.map(d => d.dog_name).join(', '));
          console.log('🐕 First dog sample:', JSON.stringify(dogs[0] || 'No dogs returned').substring(0, 200) + '...');
          
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
  }, [fetchAllDogsWithCareStatus]);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Daily Care
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Track and log daily care activities for all your dogs
          {dogStatuses ? ` (${dogStatuses.length} dogs)` : ' (Loading...)'}
        </p>
        {dogStatuses && dogStatuses.length > 0 && (
          <p className="mt-1 text-xs text-slate-400">
            Dogs: {dogStatuses.map(d => d.dog_name).join(', ')}
          </p>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="care">Daily Care</TabsTrigger>
          <TabsTrigger value="rotation">Dog Rotation</TabsTrigger>
        </TabsList>
        
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
