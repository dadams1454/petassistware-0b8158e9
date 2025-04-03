
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useMedicationLogs } from './hooks/useMedicationLogs';
import { MedicationsLogProps } from './types/medicationTypes';
import MedicationCard from './components/MedicationCard';
import MedicationFilter from './components/MedicationFilter';
import { useState } from 'react';

const MedicationsLog: React.FC<MedicationsLogProps> = ({ dogs, onRefresh }) => {
  const [filter, setFilter] = useState<string>('all');
  const { medicationLogs, isLoading, error } = useMedicationLogs(dogs);

  useEffect(() => {
    // Log for debugging
    console.log('Medication logs data:', medicationLogs);
  }, [medicationLogs]);

  // Filter dogs based on the selected filter
  const filteredDogs = dogs.filter(dog => {
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
  });

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

  // Render empty state
  if (filteredDogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Medications</CardTitle>
            <MedicationFilter value={filter} onChange={setFilter} />
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

  // Render medication cards for each dog
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <MedicationFilter value={filter} onChange={setFilter} />
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
            onSuccess={onRefresh}
          />
        );
      })}
    </div>
  );
};

export default MedicationsLog;
