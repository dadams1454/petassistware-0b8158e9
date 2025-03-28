
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dog, Clock, AlertCircle } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { differenceInMinutes } from 'date-fns';

interface DogLetOutReminderCardProps {
  dogs: DogCareStatus[];
  onLogDogLetOut: () => void;
}

const DogLetOutReminderCard: React.FC<DogLetOutReminderCardProps> = ({ 
  dogs,
  onLogDogLetOut
}) => {
  const [dogsNeedingLetOut, setDogsNeedingLetOut] = useState<DogCareStatus[]>([]);
  
  // Calculate which dogs need to be let out
  useEffect(() => {
    if (!dogs || dogs.length === 0) return;
    
    const now = new Date();
    const needLetOut = dogs.filter(dog => {
      // Skip if no last potty time is recorded
      if (!dog.last_potty_time) return true;
      
      const lastTime = new Date(dog.last_potty_time);
      const threshold = dog.potty_alert_threshold || 300; // Default to 5 hours
      const minutesSinceLastPotty = differenceInMinutes(now, lastTime);
      
      return minutesSinceLastPotty >= threshold;
    });
    
    setDogsNeedingLetOut(needLetOut);
  }, [dogs]);
  
  // If no dogs need to be let out, don't show the card
  if (dogsNeedingLetOut.length === 0) return null;
  
  return (
    <Card className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-amber-800 dark:text-amber-300">
          <AlertCircle className="mr-2 h-5 w-5" />
          Dogs Need Let Out
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-amber-700 dark:text-amber-300">
            {dogsNeedingLetOut.length} {dogsNeedingLetOut.length === 1 ? 'dog needs' : 'dogs need'} to be let out:
          </p>
          <div className="flex flex-wrap gap-2">
            {dogsNeedingLetOut.slice(0, 5).map(dog => (
              <div 
                key={dog.dog_id} 
                className="inline-flex items-center bg-amber-100 dark:bg-amber-800/40 text-amber-800 dark:text-amber-300 rounded-full px-3 py-1 text-sm"
              >
                <Dog className="mr-1 h-3 w-3" />
                {dog.dog_name}
              </div>
            ))}
            {dogsNeedingLetOut.length > 5 && (
              <div className="inline-flex items-center bg-amber-100 dark:bg-amber-800/40 text-amber-800 dark:text-amber-300 rounded-full px-3 py-1 text-sm">
                +{dogsNeedingLetOut.length - 5} more
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onLogDogLetOut}
          className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Clock className="h-4 w-4" />
          Let Dogs Out
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DogLetOutReminderCard;
