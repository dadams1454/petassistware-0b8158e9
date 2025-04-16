
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DogCareStatus } from '@/types/dailyCare';
import { mockDogs } from '@/mockData/dogs';
import { v4 as uuidv4 } from 'uuid';

const DogLetOutTab: React.FC = () => {
  const [dogs, setDogs] = useState<DogCareStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get dogs
    const fetchDogs = async () => {
      setLoading(true);
      try {
        // Mock data - in real app, this would be an API call
        const dogsWithCareStatus: DogCareStatus[] = mockDogs.map(dog => ({
          id: dog.id,
          dog_id: dog.id,
          name: dog.name,
          dog_name: dog.name,
          status: 'active',
          last_updated: new Date().toISOString(),
          flags: [],
          breed: dog.breed,
          color: dog.color,
          sex: dog.gender,
          photo_url: dog.photo_url,
          dog_photo: dog.photo_url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        
        setDogs(dogsWithCareStatus);
      } catch (error) {
        console.error('Error fetching dogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, []);

  // Generate a random timestamp in the last 4 hours
  const randomRecentTimestamp = () => {
    const now = new Date();
    const hoursAgo = Math.floor(Math.random() * 4);
    const minutesAgo = Math.floor(Math.random() * 60);
    now.setHours(now.getHours() - hoursAgo);
    now.setMinutes(now.getMinutes() - minutesAgo);
    return now.toISOString();
  };

  // Simulate recording a dog potty break
  const recordDogPottyBreak = (dogId: string) => {
    console.log(`Recording potty break for dog ${dogId}`);
    // In a real app, this would call an API to log the potty break
    
    // For demo purposes, update the local state to show the break was recorded
    setDogs(prevDogs => 
      prevDogs.map(dog => 
        dog.dog_id === dogId 
          ? { 
              ...dog, 
              last_updated: new Date().toISOString(),
              last_potty_time: new Date().toISOString(),
              last_care: {
                category: 'pottybreaks',
                task_name: 'Dog let out',
                timestamp: new Date().toISOString(),
                notes: 'Recorded from dashboard'
              }
            } 
          : dog
      )
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center h-40">Loading dogs...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dogs.map((dog) => (
          <Card key={dog.dog_id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                {dog.photo_url && (
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                    <img src={dog.photo_url} alt={dog.name} className="w-full h-full object-cover" />
                  </div>
                )}
                {dog.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Last potty break: {dog.last_potty_time 
                    ? new Date(dog.last_potty_time).toLocaleTimeString() 
                    : 'Not recorded today'}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => recordDogPottyBreak(dog.dog_id)}
                >
                  Record Potty Break
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DogLetOutTab;
