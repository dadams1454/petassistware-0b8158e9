
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, AlertCircle, Columns, Table as TableIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useMedicationLogs } from './hooks/useMedicationLogs';
import MedicationCard from './components/MedicationCard';
import MedicationTableView from './components/MedicationTableView';
import { MedicationsLogProps } from './types/medicationTypes';
import { ErrorState, LoadingState, SkeletonLoader } from '@/components/ui/standardized';
import NoDogsMessage from './components/NoDogsMessage';

const MedicationsLog: React.FC<MedicationsLogProps> = ({ dogs, onRefresh }) => {
  const { toast } = useToast();
  const { processedMedicationLogs, isLoading, error } = useMedicationLogs(dogs);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  // Handle success callback
  const handleMedicationLogged = () => {
    toast({
      title: "Medication logged",
      description: "The medication has been logged successfully",
    });
    onRefresh();
  };

  // Handle medication log click for table view
  const handleLogMedication = (dogId: string) => {
    const dog = dogs.find(d => d.dog_id === dogId);
    if (!dog) return;
    
    // Find the MedicationCard component for this dog and trigger its dialog
    const dogElement = document.getElementById(`medication-card-${dogId}`);
    if (dogElement) {
      const button = dogElement.querySelector('button');
      if (button) button.click();
    }
  };
  
  // Get today's date for display
  const today = new Date();
  const dateDisplay = format(today, 'EEEE, MMMM d');

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <SkeletonLoader variant="card" count={3} />
        </div>
      );
    }
    
    if (error) {
      return (
        <ErrorState 
          title="Could not load medications" 
          message={error}
          onRetry={onRefresh} 
        />
      );
    }
    
    if (dogs.length === 0) {
      return <NoDogsMessage onRefresh={onRefresh} />;
    }

    if (viewMode === 'table') {
      return (
        <MedicationTableView 
          dogs={dogs}
          preventativeMeds={processedMedicationLogs}
          otherMeds={Object.fromEntries(
            Object.entries(processedMedicationLogs).map(
              ([dogId, meds]) => [dogId, meds.other || []]
            )
          )}
          onLogMedication={handleLogMedication}
        />
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300">
        {dogs.map(dog => {
          const dogMedications = processedMedicationLogs[dog.dog_id] || { preventative: [], other: [] };
          
          return (
            <div id={`medication-card-${dog.dog_id}`} key={dog.dog_id}>
              <MedicationCard 
                dog={dog}
                preventativeMeds={dogMedications.preventative}
                otherMeds={dogMedications.other}
                onSuccess={handleMedicationLogged}
              />
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <Card className="shadow-md relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-xl flex items-center">
            <Pill className="h-5 w-5 mr-2" />
            Medications Log
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({dateDisplay})
            </span>
          </CardTitle>
          
          {/* View mode toggle */}
          <div className="bg-muted rounded-lg p-1 inline-flex self-start sm:self-auto">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-md px-3"
              onClick={() => setViewMode('cards')}
            >
              <Columns className="h-4 w-4 mr-2" />
              Cards
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-md px-3"
              onClick={() => setViewMode('table')}
            >
              <TableIcon className="h-4 w-4 mr-2" />
              Table
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default MedicationsLog;
