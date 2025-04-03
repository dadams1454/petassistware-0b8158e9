
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useMedicationLogs } from './hooks/useMedicationLogs';
import { MedicationsLogProps, DogCareStatus } from './types/medicationTypes';
import MedicationCard from './components/MedicationCard';
import MedicationFilter from './components/MedicationFilter';

const MedicationsLog: React.FC<MedicationsLogProps> = ({ dogId, onRefresh }) => {
  const [filter, setFilter] = useState<string>('all');
  const { medicationLogs, isLoading, error, dogs } = useMedicationLogs(dogId);

  useEffect(() => {
    // Log for debugging
    console.log('Medication logs data:', medicationLogs);
  }, [medicationLogs]);

  // If dogId is provided, we're in single dog mode
  const singleDogMode = !!dogId;
  
  // Filter dogs based on the selected filter
  const filteredDogs = !singleDogMode && dogs 
    ? dogs.filter(dog => {
        if (filter === 'all') return true;
        if (filter === 'withMeds') {
          return medicationLogs[dog.dog_id] && (
            medicationLogs[dog.dog_id].preventative.length > 0 || 
            medicationLogs[dog.dog_id].other.length > 0
          );
        }
        if (filter === 'withoutMeds') {
          return !medicationLogs[dog.dog_id] || (
            medicationLogs[dog.dog_id].preventative.length === 0 && 
            medicationLogs[dog.dog_id].other.length === 0
          );
        }
        return true;
      })
    : [];

  // Render loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading medication records...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center space-y-2">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-destructive">Error loading medications: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // For single dog mode
  if (singleDogMode) {
    const dogMeds = medicationLogs[dogId] || { preventative: [], other: [] };
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medications</CardTitle>
        </CardHeader>
        <CardContent>
          {dogMeds.preventative.length === 0 && dogMeds.other.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No medications found for this dog.
            </p>
          ) : (
            <MedicationCard
              dog={{ dog_id: dogId } as DogCareStatus}
              preventativeMeds={dogMeds.preventative}
              otherMeds={dogMeds.other}
              onSuccess={onRefresh || (() => {})}
            />
          )}
        </CardContent>
      </Card>
    );
  }

  // Render empty state for multiple dogs
  if (!dogs || filteredDogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Medications</CardTitle>
            <MedicationFilter 
              activeFilter={filter} 
              onChange={setFilter} 
              counts={{
                all: dogs?.length || 0,
                preventative: dogs?.filter(d => medicationLogs[d.dog_id]?.preventative.length > 0).length || 0,
                other: dogs?.filter(d => medicationLogs[d.dog_id]?.other.length > 0).length || 0
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No dogs match the current filter.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Render medication cards for multiple dogs
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <MedicationFilter 
          activeFilter={filter} 
          onChange={setFilter} 
          counts={{
            all: dogs?.length || 0,
            preventative: dogs?.filter(d => medicationLogs[d.dog_id]?.preventative.length > 0).length || 0,
            other: dogs?.filter(d => medicationLogs[d.dog_id]?.other.length > 0).length || 0
          }}
        />
      </div>
      
      {filteredDogs.map(dog => {
        // Safely access medication data for this dog
        const dogMeds = medicationLogs[dog.dog_id] || { preventative: [], other: [] };
        
        return (
          <MedicationCard
            key={dog.dog_id}
            dog={dog}
            preventativeMeds={dogMeds.preventative}
            otherMeds={dogMeds.other}
            onSuccess={onRefresh || (() => {})}
          />
        );
      })}
    </div>
  );
};

export default MedicationsLog;
