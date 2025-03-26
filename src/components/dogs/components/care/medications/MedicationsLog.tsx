
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useMedicationLogs } from './hooks/useMedicationLogs';
import MedicationCard from './components/MedicationCard';
import { MedicationsLogProps } from './types/medicationTypes';
import { ErrorState, LoadingState, SkeletonLoader } from '@/components/ui/standardized';
import NoDogsMessage from './components/NoDogsMessage';

const MedicationsLog: React.FC<MedicationsLogProps> = ({ dogs, onRefresh }) => {
  const { toast } = useToast();
  const { processedMedicationLogs, isLoading, error } = useMedicationLogs(dogs);
  
  // Handle success callback
  const handleMedicationLogged = () => {
    toast({
      title: "Medication logged",
      description: "The medication has been logged successfully",
    });
    onRefresh();
  };
  
  // Get today's date for display
  const today = new Date();
  const dateDisplay = format(today, 'EEEE, MMMM d');
  
  return (
    <Card className="shadow-md relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Pill className="h-5 w-5 mr-2" />
          Medications Log
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({dateDisplay})
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <SkeletonLoader variant="card" count={3} />
          </div>
        ) : error ? (
          <ErrorState 
            title="Could not load medications" 
            message={error}
            onRetry={onRefresh} 
          />
        ) : dogs.length === 0 ? (
          <NoDogsMessage onRefresh={onRefresh} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300">
            {dogs.map(dog => {
              const dogMedications = processedMedicationLogs[dog.dog_id] || { preventative: [], other: [] };
              
              return (
                <MedicationCard 
                  key={dog.dog_id}
                  dog={dog}
                  preventativeMeds={dogMedications.preventative}
                  otherMeds={dogMedications.other}
                  onSuccess={handleMedicationLogged}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationsLog;
