import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useMedicationLogs } from './hooks/useMedicationLogs';
import MedicationFilter from './components/MedicationFilter';
import MedicationCard from './components/MedicationCard';
import { MedicationsLogProps } from './types/medicationTypes';
import { Button } from '@/components/ui/button';

const MedicationsLog: React.FC<MedicationsLogProps> = ({ dogId, onRefresh }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [dogs, setDogs] = useState<any[]>([]);
  const [isLoadingDogs, setIsLoadingDogs] = useState(true);
  const [localDogId, setLocalDogId] = useState<string | undefined>(dogId);
  
  // If dogId is provided, use it. Otherwise, fetch all dogs.
  const { medicationLogs, isLoading, error } = useMedicationLogs(localDogId || dogs);
  
  useEffect(() => {
    // If dogId is provided, use it directly
    if (dogId) {
      setLocalDogId(dogId);
      return;
    }
    
    // Otherwise, fetch all dogs
    const fetchDogs = async () => {
      setIsLoadingDogs(true);
      
      try {
        const { data, error } = await supabase
          .from('dogs')
          .select('id, name, breed, photo_url')
          .order('name');
        
        if (error) throw error;
        
        // Transform to expected format
        const transformedDogs = data.map(dog => ({
          dog_id: dog.id,
          dog_name: dog.name,
          dog_photo: dog.photo_url,
          breed: dog.breed
        }));
        
        setDogs(transformedDogs);
      } catch (err) {
        console.error('Error fetching dogs:', err);
      } finally {
        setIsLoadingDogs(false);
      }
    };
    
    fetchDogs();
  }, [dogId]);
  
  // Helper to count medications
  const getMedicationCounts = (dogId: string) => {
    const logs = medicationLogs[dogId];
    if (!logs) return { all: 0, preventative: 0, other: 0 };
    
    const preventativeCount = logs.preventative?.length || 0;
    const otherCount = logs.other?.length || 0;
    
    return {
      all: preventativeCount + otherCount,
      preventative: preventativeCount,
      other: otherCount
    };
  };
  
  // Loading state
  if (isLoadingDogs || (isLoading && Object.keys(medicationLogs).length === 0)) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading medication data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Single dog view
  if (dogId && medicationLogs[dogId]) {
    return (
      <div className="space-y-4">
        <MedicationFilter 
          activeFilter={activeFilter}
          onChange={setActiveFilter}
          counts={getMedicationCounts(dogId)}
        />
        
        <MedicationCard
          dogId={dogId}
          preventativeMeds={activeFilter === 'all' || activeFilter === 'preventative' 
            ? medicationLogs[dogId].preventative 
            : []}
          otherMeds={activeFilter === 'all' || activeFilter === 'other' 
            ? medicationLogs[dogId].other 
            : []}
          onSuccess={() => onRefresh?.()}
        />
      </div>
    );
  }
  
  // Multiple dogs view
  return (
    <div className="space-y-4">
      <Tabs>
        <TabList className="flex space-x-2 border-b mb-4">
          {dogs.map(dog => (
            <Tab 
              key={dog.dog_id} 
              className="px-4 py-2 cursor-pointer hover:bg-muted rounded-t-md"
              selectedClassName="border-b-2 border-primary font-medium"
            >
              {dog.dog_name}
            </Tab>
          ))}
        </TabList>
        
        {dogs.map(dog => (
          <TabPanel key={dog.dog_id}>
            <div className="space-y-4">
              <MedicationFilter 
                activeFilter={activeFilter}
                onChange={setActiveFilter}
                counts={getMedicationCounts(dog.dog_id)}
              />
              
              <MedicationCard
                dogId={dog.dog_id}
                preventativeMeds={activeFilter === 'all' || activeFilter === 'preventative' 
                  ? (medicationLogs[dog.dog_id]?.preventative || []) 
                  : []}
                otherMeds={activeFilter === 'all' || activeFilter === 'other' 
                  ? (medicationLogs[dog.dog_id]?.other || []) 
                  : []}
                onSuccess={() => onRefresh?.()}
              />
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export default MedicationsLog;
