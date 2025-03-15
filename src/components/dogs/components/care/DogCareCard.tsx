
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Dog, Clock, PawPrint } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import CareLogForm from './CareLogForm';
import { DogFlagsList } from './DogFlagsList';

interface DogCareCardProps {
  dog: DogCareStatus;
  onLogCare: (dogId: string) => void;
  selectedDogId: string | null;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onCareLogSuccess: () => void;
}

const DogCareCard: React.FC<DogCareCardProps> = ({
  dog,
  onLogCare,
  selectedDogId,
  dialogOpen,
  setDialogOpen,
  onCareLogSuccess
}) => {
  return (
    <Card key={dog.dog_id} className={`overflow-hidden ${!dog.last_care ? 'border-orange-300 dark:border-orange-800' : ''}`}>
      <CardContent className="p-0">
        <div className="flex items-start p-4">
          <div className="flex-shrink-0 mr-4">
            {dog.dog_photo ? (
              <img
                src={dog.dog_photo}
                alt={dog.dog_name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Dog className="h-8 w-8 text-primary" />
              </div>
            )}
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center">
              <h3 className="font-semibold text-lg">{dog.dog_name}</h3>
              <DogFlagsList flags={dog.flags} />
            </div>
            <p className="text-sm text-muted-foreground">
              {dog.breed} • {dog.color}
            </p>
            
            {dog.last_care ? (
              <div className="mt-2 space-y-1">
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  <PawPrint className="h-3 w-3 mr-1" />
                  {dog.last_care.category}: {dog.last_care.task_name}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {format(parseISO(dog.last_care.timestamp), 'h:mm a')}
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                  Needs care today
                </Badge>
              </div>
            )}
          </div>
          
          <Dialog open={dialogOpen && selectedDogId === dog.dog_id} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant={dog.last_care ? "ghost" : "secondary"} 
                size="sm"
                onClick={() => onLogCare(dog.dog_id)}
              >
                {dog.last_care ? "Update" : "Log Care"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              {selectedDogId === dog.dog_id && (
                <CareLogForm dogId={dog.dog_id} onSuccess={onCareLogSuccess} />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default DogCareCard;
