
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DogCareStatus } from '@/types/dailyCare';
import { Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface PottyBreakReminderCardProps {
  dogs: DogCareStatus[];
  onLogPottyBreak: () => void;
}

const PottyBreakReminderCard: React.FC<PottyBreakReminderCardProps> = ({ 
  dogs, 
  onLogPottyBreak 
}) => {
  // Filter dogs that need potty breaks
  const dogsNeedingPottyBreaks = dogs.filter(dog => {
    // If there's no last_care, or last_care is not a potty break
    if (!dog.last_care || dog.last_care.category !== 'pottybreaks') {
      return true;
    }
    
    // Check if it's been over 4 hours since the last potty break
    const lastBreakTime = parseISO(dog.last_care.timestamp);
    const now = new Date();
    const hoursSinceLastBreak = (now.getTime() - lastBreakTime.getTime()) / (1000 * 60 * 60);
    
    return hoursSinceLastBreak >= 4;
  });
  
  // Sort dogs by how long it's been since their last potty break
  const sortedDogs = [...dogsNeedingPottyBreaks].sort((a, b) => {
    if (!a.last_care && !b.last_care) return 0;
    if (!a.last_care) return -1; // No last_care comes first
    if (!b.last_care) return 1;
    
    return new Date(a.last_care.timestamp).getTime() - new Date(b.last_care.timestamp).getTime();
  });
  
  // Take top 3 dogs for the reminder
  const topUrgentDogs = sortedDogs.slice(0, 3);
  
  // Get time since last potty break
  const getTimeSinceLastPottyBreak = (dog: DogCareStatus): string => {
    if (!dog.last_care || dog.last_care.category !== 'pottybreaks') {
      return 'No record';
    }
    
    return formatDistanceToNow(parseISO(dog.last_care.timestamp), { addSuffix: true });
  };
  
  // If no dogs need potty breaks, don't render the card
  if (dogsNeedingPottyBreaks.length === 0) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/10 dark:border-amber-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-amber-800 dark:text-amber-300 flex items-center text-base">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
          Potty Break Reminder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
          {dogsNeedingPottyBreaks.length === 1 
            ? '1 dog needs a potty break' 
            : `${dogsNeedingPottyBreaks.length} dogs need potty breaks`}
        </p>
        
        <div className="space-y-2 mb-3">
          {topUrgentDogs.map(dog => (
            <div 
              key={dog.dog_id} 
              className="flex items-center justify-between text-sm p-2 bg-white dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800/50"
            >
              <div className="font-medium">{dog.dog_name}</div>
              <div className="flex items-center text-amber-600 dark:text-amber-400">
                <Clock className="h-3 w-3 mr-1" />
                {getTimeSinceLastPottyBreak(dog)}
              </div>
            </div>
          ))}
          
          {dogsNeedingPottyBreaks.length > 3 && (
            <div className="text-xs text-amber-600 dark:text-amber-400 text-center">
              +{dogsNeedingPottyBreaks.length - 3} more dogs need potty breaks
            </div>
          )}
        </div>
        
        <Button 
          className="w-full"
          variant="default"
          onClick={onLogPottyBreak}
        >
          Log Potty Break
        </Button>
      </CardContent>
    </Card>
  );
};

export default PottyBreakReminderCard;
