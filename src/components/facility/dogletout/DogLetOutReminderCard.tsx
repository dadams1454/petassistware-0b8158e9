
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, AlertTriangle } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { useDogLetOutReminder } from './hooks/useDogLetOutReminder';
import DogLetOutList from './components/DogLetOutList';
import ObservationDialog from './components/ObservationDialog';
import { getTimeSinceLastDogLetOut } from './components/DogLetOutList';

interface DogLetOutReminderCardProps {
  dogs: DogCareStatus[];
  onLogDogLetOut: () => void;
}

const DogLetOutReminderCard: React.FC<DogLetOutReminderCardProps> = ({ 
  dogs, 
  onLogDogLetOut 
}) => {
  const {
    isLoading,
    needsLetOut,
    dialogOpen,
    setDialogOpen,
    selectedDog,
    observationNote,
    setObservationNote,
    observationType,
    setObservationType,
    handleObservationClick,
    handleSubmitObservation
  } = useDogLetOutReminder(dogs);

  if (isLoading) {
    return (
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="animate-pulse text-amber-600">Checking dog let out status...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (needsLetOut.length === 0) {
    return null; // Don't show the card if no dogs need to be let out
  }

  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-400 mb-1">
                Dog Let Out Reminder
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {needsLetOut.length === 1 
                  ? `${needsLetOut[0].dog.dog_name} hasn't been let out ${getTimeSinceLastDogLetOut(needsLetOut[0].lastBreak)}.`
                  : `${needsLetOut.length} dogs haven't been let out in over 3 hours.`
                }
              </p>
            </div>
          </div>
          
          {/* Dogs that need to be let out with observation buttons */}
          <div className="mt-2">
            <DogLetOutList dogs={needsLetOut} onObservationClick={handleObservationClick} />
          </div>
          
          <div className="mt-2 flex justify-end">
            <Button 
              onClick={onLogDogLetOut}
              className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
            >
              <FileText className="h-4 w-4" />
              Go to Dog Let Out
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* Observation Dialog */}
      <ObservationDialog 
        isOpen={dialogOpen}
        setIsOpen={setDialogOpen}
        selectedDog={selectedDog}
        observationType={observationType}
        setObservationType={setObservationType}
        observationNote={observationNote}
        setObservationNote={setObservationNote}
        onSubmit={handleSubmitObservation}
      />
    </Card>
  );
};

export default DogLetOutReminderCard;
