
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill } from 'lucide-react';
import { format } from 'date-fns';
import { useMedicationLogs } from './hooks/useMedicationLogs';
import MedicationCard from './components/MedicationCard';
import { MedicationsLogProps } from './types/medicationTypes';

const MedicationsLog: React.FC<MedicationsLogProps> = ({ dogs, onRefresh }) => {
  const { toast } = useToast();
  const { processedMedicationLogs, isLoading } = useMedicationLogs(dogs);
  
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
          <div className="text-center p-6">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading medication data...</p>
          </div>
        ) : dogs.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-muted-foreground">No dogs available for medication tracking.</p>
            <Button onClick={onRefresh} variant="outline" className="mt-2">
              Refresh Dogs
            </Button>
          </div>
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

export default MedicationsLog;
