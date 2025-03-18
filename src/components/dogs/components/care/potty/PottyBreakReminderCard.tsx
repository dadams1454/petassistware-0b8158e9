
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, FileText, AlertTriangle } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { getLastDogPottyBreak } from '@/services/dailyCare/pottyBreak/dogPottyBreakService';

interface PottyBreakReminderCardProps {
  dogs: DogCareStatus[];
  onLogPottyBreak: () => void;
}

const PottyBreakReminderCard: React.FC<PottyBreakReminderCardProps> = ({ 
  dogs, 
  onLogPottyBreak 
}) => {
  const [dogsWithTimes, setDogsWithTimes] = useState<{
    dog: DogCareStatus;
    lastBreak: string | null;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the latest potty break time for each dog when component mounts
  useEffect(() => {
    const fetchLastBreakTimes = async () => {
      setIsLoading(true);
      const promises = dogs.map(async (dog) => {
        try {
          const lastBreak = await getLastDogPottyBreak(dog.dog_id);
          return { 
            dog, 
            lastBreak: lastBreak ? lastBreak.session_time : null 
          };
        } catch (error) {
          console.error(`Error fetching last potty break for ${dog.dog_name}:`, error);
          return { dog, lastBreak: null };
        }
      });

      const results = await Promise.all(promises);
      setDogsWithTimes(results);
      setIsLoading(false);
    };

    if (dogs.length > 0) {
      fetchLastBreakTimes();
    } else {
      setIsLoading(false);
    }
  }, [dogs]);

  // Format relative time for display
  const getTimeSinceLastPottyBreak = (lastBreakTime: string | null) => {
    if (!lastBreakTime) return 'Never';
    return formatDistanceToNow(parseISO(lastBreakTime), { addSuffix: true });
  };

  // Filter dogs that need potty breaks (more than 3 hours since last break)
  const threeHoursAgo = new Date();
  threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);
  
  const needsPottyBreak = dogsWithTimes.filter(({ lastBreak }) => {
    if (!lastBreak) return true; // No record means they need a potty break
    return parseISO(lastBreak) < threeHoursAgo;
  });

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
                  ? `${needsPottyBreak[0].dog.dog_name} hasn't had a potty break recorded ${getTimeSinceLastPottyBreak(needsPottyBreak[0].lastBreak)}.`
                  : `${needsPottyBreak.length} dogs haven't had potty breaks recorded in over 3 hours.`
                }
              </p>
              
              {/* Show the dogs if there are many */}
              {needsPottyBreak.length > 1 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {needsPottyBreak.slice(0, 5).map(({ dog, lastBreak }) => (
                    <div key={dog.dog_id} className="flex items-center text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-full px-2 py-0.5">
                      <span>{dog.dog_name}</span>
                      <span className="ml-1 text-amber-500">•</span>
                      <Clock className="h-3 w-3 mx-0.5 text-amber-500" />
                      <span>{getTimeSinceLastPottyBreak(lastBreak)}</span>
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
