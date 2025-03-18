
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, FileText, AlertTriangle } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface PottyBreakReminderCardProps {
  dogs: DogCareStatus[];
  onLogPottyBreak: () => void;
}

const PottyBreakReminderCard: React.FC<PottyBreakReminderCardProps> = ({ 
  dogs, 
  onLogPottyBreak 
}) => {
  // Filter dogs that need potty breaks (more than 3 hours since last break)
  const getLastPottyBreakTime = (dog: DogCareStatus) => {
    if (!dog.last_care || dog.last_care.category !== 'pottybreaks') {
      return null;
    }
    return new Date(dog.last_care.timestamp);
  };

  const getTimeSinceLastPottyBreak = (dog: DogCareStatus) => {
    const lastTime = getLastPottyBreakTime(dog);
    if (!lastTime) return 'Never';
    return formatDistanceToNow(lastTime, { addSuffix: true });
  };

  // Look for dogs that haven't had a potty break in over 3 hours
  const threeHoursAgo = new Date();
  threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);
  
  const needsPottyBreak = dogs.filter(dog => {
    const lastBreakTime = getLastPottyBreakTime(dog);
    return !lastBreakTime || lastBreakTime < threeHoursAgo;
  });

  if (needsPottyBreak.length === 0) {
    return null; // Don't show the card if no dogs need potty breaks
  }

  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                  ? `${needsPottyBreak[0].dog_name} hasn't had a potty break recorded ${getTimeSinceLastPottyBreak(needsPottyBreak[0])}.`
                  : `${needsPottyBreak.length} dogs haven't had potty breaks recorded in over 3 hours.`
                }
              </p>
              
              {/* Show the dogs if there are many */}
              {needsPottyBreak.length > 1 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {needsPottyBreak.slice(0, 5).map(dog => (
                    <div key={dog.dog_id} className="flex items-center text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-full px-2 py-0.5">
                      <span>{dog.dog_name}</span>
                      <span className="ml-1 text-amber-500">•</span>
                      <Clock className="h-3 w-3 mx-0.5 text-amber-500" />
                      <span>{getTimeSinceLastPottyBreak(dog)}</span>
                    </div>
                  ))}
                  {needsPottyBreak.length > 5 && (
                    <div className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-full px-2 py-0.5">
                      +{needsPottyBreak.length - 5} more
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <Button 
            onClick={onLogPottyBreak}
            className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
          >
            <FileText className="h-4 w-4" />
            Record Potty Observations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PottyBreakReminderCard;
