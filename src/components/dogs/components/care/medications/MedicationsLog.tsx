
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useMedicationLogs } from './hooks/useMedicationLogs';
import MedicationCard from './components/MedicationCard';
import { MedicationsLogProps } from './types/medicationTypes';
import { ErrorState, LoadingState } from '@/components/ui/standardized';

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
    <Card className="shadow-md">
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
          <LoadingState message="Loading medication data..." />
        ) : error ? (
          <ErrorState 
            title="Could not load medications" 
            message={error}
            onRetry={onRefresh} 
          />
        ) : dogs.length === 0 ? (
          <NoDogsMessage onRefresh={onRefresh} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

// Internal component for no dogs message to avoid import cycle
const NoDogsMessage = ({ onRefresh }: { onRefresh: () => void }) => (
  <div className="text-center p-4">
    <p className="text-muted-foreground">No dogs available for medication tracking.</p>
    <Button onClick={onRefresh} variant="outline" className="mt-2">
      Refresh Dogs
    </Button>
  </div>
);

export default MedicationsLog;
