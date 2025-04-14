
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dog, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DogLetOutTimeStepper from './dogletout/DogLetOutTimeStepper';
import { format } from 'date-fns';

interface DogData {
  id: string;
  name: string;
  photo_url?: string;
  last_potty_time?: string;
}

const DogLetOutTab: React.FC = () => {
  const [dogs, setDogs] = useState<DogData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const fetchDogs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('dogs')
        .select('id, name, photo_url, status')
        .eq('status', 'active')
        .order('name');

      if (error) {
        throw error;
      }

      // Fetch the latest potty time for each dog
      const dogsWithPottyTimes = await Promise.all(
        data.map(async (dog) => {
          const { data: pottyData } = await supabase
            .from('daily_care_logs')
            .select('timestamp')
            .eq('dog_id', dog.id)
            .eq('category', 'pottybreaks')
            .order('timestamp', { ascending: false })
            .limit(1);

          return {
            ...dog,
            last_potty_time: pottyData && pottyData.length > 0 ? pottyData[0].timestamp : undefined
          };
        })
      );

      setDogs(dogsWithPottyTimes);
    } catch (error) {
      console.error('Error fetching dogs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dogs. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  const handleTimeSelected = async (dogId: string, dogName: string, time: string) => {
    try {
      const now = new Date();
      const formattedDate = format(now, 'yyyy-MM-dd');
      const timestamp = `${formattedDate}T${time}`;

      await supabase
        .from('daily_care_logs')
        .insert({
          dog_id: dogId,
          category: 'pottybreaks',
          task_name: 'Let Outside',
          timestamp: timestamp,
          notes: `${dogName} was let outside at ${time}`,
          created_by: 'user'
        });

      toast({
        title: 'Success',
        description: `${dogName} was recorded as let out at ${time}`,
      });

      // Refresh the dog list to update the last potty time
      fetchDogs();
    } catch (error) {
      console.error('Error logging potty break:', error);
      toast({
        title: 'Error',
        description: 'Failed to log potty break. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Dog className="h-6 w-6 mr-2 text-primary" />
          <CardTitle>Dog Let Out Tracking</CardTitle>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDogs} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Dogs</TabsTrigger>
            <TabsTrigger value="needs-out">Needs Out</TabsTrigger>
            <TabsTrigger value="recently-out">Recently Out</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center p-6">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : dogs.length > 0 ? (
              dogs.map((dog) => (
                <DogLetOutTimeStepper
                  key={dog.id}
                  dogId={dog.id}
                  dogName={dog.name}
                  lastPottyTime={dog.last_potty_time}
                  onTimeSelected={(time) => handleTimeSelected(dog.id, dog.name, time)}
                />
              ))
            ) : (
              <div className="text-center p-6 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No dogs found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="needs-out" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center p-6">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : dogs.filter(dog => {
                // Filter dogs who haven't been out in the last 6 hours or have no record
                if (!dog.last_potty_time) return true;
                const lastTime = new Date(dog.last_potty_time).getTime();
                const sixHoursAgo = new Date().getTime() - (6 * 60 * 60 * 1000);
                return lastTime < sixHoursAgo;
              }).length > 0 ? (
                dogs.filter(dog => {
                  if (!dog.last_potty_time) return true;
                  const lastTime = new Date(dog.last_potty_time).getTime();
                  const sixHoursAgo = new Date().getTime() - (6 * 60 * 60 * 1000);
                  return lastTime < sixHoursAgo;
                }).map((dog) => (
                  <DogLetOutTimeStepper
                    key={dog.id}
                    dogId={dog.id}
                    dogName={dog.name}
                    lastPottyTime={dog.last_potty_time}
                    onTimeSelected={(time) => handleTimeSelected(dog.id, dog.name, time)}
                  />
                ))
              ) : (
                <div className="text-center p-6 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">All dogs have been let out recently</p>
                </div>
              )
            }
          </TabsContent>
          
          <TabsContent value="recently-out" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center p-6">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : dogs.filter(dog => {
                // Filter dogs who have been out in the last 6 hours
                if (!dog.last_potty_time) return false;
                const lastTime = new Date(dog.last_potty_time).getTime();
                const sixHoursAgo = new Date().getTime() - (6 * 60 * 60 * 1000);
                return lastTime >= sixHoursAgo;
              }).length > 0 ? (
                dogs.filter(dog => {
                  if (!dog.last_potty_time) return false;
                  const lastTime = new Date(dog.last_potty_time).getTime();
                  const sixHoursAgo = new Date().getTime() - (6 * 60 * 60 * 1000);
                  return lastTime >= sixHoursAgo;
                }).map((dog) => (
                  <DogLetOutTimeStepper
                    key={dog.id}
                    dogId={dog.id}
                    dogName={dog.name}
                    lastPottyTime={dog.last_potty_time}
                    onTimeSelected={(time) => handleTimeSelected(dog.id, dog.name, time)}
                  />
                ))
              ) : (
                <div className="text-center p-6 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">No dogs have been let out recently</p>
                </div>
              )
            }
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DogLetOutTab;
