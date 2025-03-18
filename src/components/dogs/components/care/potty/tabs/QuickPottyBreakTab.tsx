
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { useNavigate } from 'react-router-dom';

interface QuickPottyBreakTabProps {
  dogs: DogCareStatus[];
  getTimeSinceLastPottyBreak: (dog: DogCareStatus) => string;
  handleQuickPottyBreak: (dogId: string, dogName: string) => void;
  isLoading: boolean;
}

const QuickPottyBreakTab: React.FC<QuickPottyBreakTabProps> = ({
  dogs,
  getTimeSinceLastPottyBreak,
  handleQuickPottyBreak,
  isLoading
}) => {
  const navigate = useNavigate();

  const handleNavigateToDog = (dogId: string) => {
    navigate(`/dogs/${dogId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dogs.map(dog => {
        const needsPottyBreak = !dog.last_care || dog.last_care.category !== 'pottybreaks';
        return (
          <Card 
            key={`quick-${dog.dog_id}`} 
            className={`shadow-sm border overflow-hidden hover:shadow-md transition ${
              needsPottyBreak ? 'border-amber-400 dark:border-amber-700' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <CardContent className="p-4 flex items-start">
              <div 
                className="flex-shrink-0 mr-3 cursor-pointer" 
                onClick={() => handleNavigateToDog(dog.dog_id)}
              >
                {dog.dog_photo ? (
                  <img 
                    src={dog.dog_photo} 
                    alt={dog.dog_name} 
                    className="h-12 w-12 rounded-full object-cover hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center hover:opacity-80 transition-opacity">
                    <span>{dog.dog_name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h4 
                  className="font-medium cursor-pointer hover:underline" 
                  onClick={() => handleNavigateToDog(dog.dog_id)}
                >
                  {dog.dog_name}
                </h4>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {getTimeSinceLastPottyBreak(dog)}
                </div>
              </div>
              <Button 
                size="sm"
                variant={needsPottyBreak ? "default" : "outline"}
                onClick={() => handleQuickPottyBreak(dog.dog_id, dog.dog_name)}
                disabled={isLoading}
              >
                {needsPottyBreak ? 'Log Break' : 'Update'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickPottyBreakTab;
