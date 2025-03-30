
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, AlertTriangle } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { usePottyReminder } from './hooks/usePottyReminder';
import DogPottyList from './components/DogPottyList';
import ObservationDialog from './components/ObservationDialog';
import { getTimeSinceLastPottyBreak } from './components/DogPottyList';

interface PottyBreakReminderCardProps {
  dogs: DogCareStatus[];
  onLogPottyBreak: () => void;
}

const PottyBreakReminderCard: React.FC<PottyBreakReminderCardProps> = ({ 
  dogs, 
  onLogPottyBreak 
}) => {
  const {
    isLoading,
    needsPottyBreak,
    dialogOpen,
    setDialogOpen,
    selectedDog,
    observationNote,
    setObservationNote,
    observationType,
    setObservationType,
    handleObservationClick,
    handleSubmitObservation
  } = usePottyReminder(dogs);

  if (isLoading) {
    return (
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="animate-pulse text-amber-600">Checking potty break status...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (needsPottyBreak.length === 0) {
    return null; // Don't show the card if no dogs need potty breaks
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
                Potty Break Reminder
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {needsPottyBreak.length === 1 
                  ? `${needsPottyBreak[0].dog.dog_name} hasn't had a potty break recorded ${getTimeSinceLastPottyBreak(needsPottyBreak[0].lastBreak)}.`
                  : `${needsPottyBreak.length} dogs haven't had potty breaks recorded in over 3 hours.`
                }
              </p>
            </div>
          </div>
          
          {/* Dogs that need potty breaks with observation buttons */}
          <div className="mt-2">
            <DogPottyList dogs={needsPottyBreak} onObservationClick={handleObservationClick} />
          </div>
          
          <div className="mt-2 flex justify-end">
            <Button 
              onClick={onLogPottyBreak}
              className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
            >
              <FileText className="h-4 w-4" />
              Go to Potty Breaks
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

export default PottyBreakReminderCard;
