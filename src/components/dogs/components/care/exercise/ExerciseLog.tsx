
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useDailyCare } from '@/contexts/dailyCare';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Activity, Clock } from 'lucide-react';
import { format } from 'date-fns';
import CareLogForm from '../CareLogForm';
import { DogCareStatus } from '@/types/dailyCare';

interface ExerciseLogProps {
  dogs: DogCareStatus[];
  onRefresh: () => void;
}

const ExerciseLog: React.FC<ExerciseLogProps> = ({ dogs, onRefresh }) => {
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Handle exercise logging
  const handleLogExercise = (dogId: string) => {
    setSelectedDogId(dogId);
    setDialogOpen(true);
  };
  
  // Handle success callback
  const handleExerciseLogged = () => {
    setDialogOpen(false);
    toast({
      title: "Exercise logged",
      description: "The exercise has been logged successfully",
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
          <Activity className="h-5 w-5 mr-2" />
          Daily Exercise Log
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({dateDisplay})
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {dogs.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-muted-foreground">No dogs available for exercise tracking.</p>
            <Button onClick={onRefresh} variant="outline" className="mt-2">
              Refresh Dogs
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dogs.map(dog => {
              const hasExercisedToday = dog.last_care && 
                dog.last_care.category === 'exercise' && 
                new Date(dog.last_care.timestamp).toDateString() === today.toDateString();
                
              return (
                <Card key={dog.dog_id} className={`overflow-hidden ${hasExercisedToday ? 'border-green-300' : 'border-orange-300'}`}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {dog.dog_photo ? (
                          <img 
                            src={dog.dog_photo} 
                            alt={dog.dog_name} 
                            className="h-10 w-10 rounded-full object-cover mr-3" 
                          />
                        ) : (
                          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                            <span className="text-primary font-bold">
                              {dog.dog_name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium">{dog.dog_name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {dog.breed}
                          </p>
                        </div>
                      </div>
                      
                      <Dialog open={dialogOpen && selectedDogId === dog.dog_id} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant={hasExercisedToday ? "outline" : "default"} 
                            size="sm"
                            onClick={() => handleLogExercise(dog.dog_id)}
                          >
                            {hasExercisedToday ? "Update" : "Log Exercise"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          {selectedDogId === dog.dog_id && (
                            <DialogHeader>
                              <DialogTitle>Log Exercise for {dog.dog_name}</DialogTitle>
                            </DialogHeader>
                          )}
                          {selectedDogId === dog.dog_id && (
                            <CareLogForm 
                              dogId={dog.dog_id} 
                              onSuccess={handleExerciseLogged} 
                              initialCategory="exercise" 
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    {hasExercisedToday && dog.last_care && (
                      <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Activity className="h-3 w-3 mr-1 text-green-500" />
                          <span className="font-medium text-green-600">
                            {dog.last_care.task_name}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {format(new Date(dog.last_care.timestamp), 'h:mm a')}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseLog;
