
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DogCareStatus } from '@/types/dailyCare';
import ExerciseLog from '@/components/dogs/components/care/exercise/ExerciseLog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DialogHeader, DialogTitle, Dialog, DialogContent } from '@/components/ui/dialog';
import { Calendar, Dumbbell, Filter, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import ExerciseForm from '@/components/dogs/components/exercise/ExerciseForm';
import { useExerciseTracking, ExerciseFormData } from '@/hooks/useExerciseTracking';

interface ExerciseTabProps {
  dogStatuses: DogCareStatus[] | null;
  onRefreshDogs: () => void;
}

const ExerciseTab: React.FC<ExerciseTabProps> = ({ dogStatuses, onRefreshDogs }) => {
  const [selectedDog, setSelectedDog] = useState<DogCareStatus | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [viewType, setViewType] = useState<'cards' | 'list'>('cards');
  
  const {
    addExercise,
    isSubmitting
  } = useExerciseTracking(selectedDog?.dog_id || '');
  
  // Handle exercise logging
  const handleLogExercise = (dog: DogCareStatus) => {
    setSelectedDog(dog);
    setDialogOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = async (data: ExerciseFormData) => {
    if (!selectedDog) return false;
    
    const success = await addExercise(data);
    if (success) {
      setDialogOpen(false);
      onRefreshDogs();
      return true;
    }
    return false;
  };
  
  // Handle view activity details
  const handleViewActivity = (dog: DogCareStatus) => {
    setSelectedDog(dog);
    setActivityModalOpen(true);
  };
  
  return (
    <>
      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-4">
        <h3 className="text-lg font-medium text-indigo-800 dark:text-indigo-300">Daily Exercise Tracking</h3>
        <p className="text-sm text-indigo-600 dark:text-indigo-400">
          Monitor and log exercise activities for all dogs throughout the day.
        </p>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Dumbbell className="h-5 w-5 mr-2 text-primary" />
          <span className="text-lg font-medium">Exercise Dashboard</span>
          <Badge variant="outline" className="ml-2">
            {format(new Date(), 'EEEE, MMMM d')}
          </Badge>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={viewType === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('cards')}
          >
            Cards
          </Button>
          <Button
            variant={viewType === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('list')}
          >
            List
          </Button>
        </div>
      </div>
      
      {dogStatuses && dogStatuses.length > 0 ? (
        <div className="space-y-4">
          {viewType === 'cards' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {dogStatuses.map(dog => (
                <ExerciseCard 
                  key={dog.dog_id} 
                  dog={dog} 
                  onLogExercise={() => handleLogExercise(dog)}
                  onViewActivity={() => handleViewActivity(dog)} 
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Exercise Activity List</CardTitle>
                <CardDescription>All dogs and their exercise status</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-2">
                    {dogStatuses.map(dog => (
                      <ExerciseListItem 
                        key={dog.dog_id} 
                        dog={dog} 
                        onLogExercise={() => handleLogExercise(dog)}
                        onViewActivity={() => handleViewActivity(dog)} 
                      />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="p-8 text-center border rounded-lg">
          <p className="text-muted-foreground">No dogs found. Please refresh or add dogs to the system.</p>
          <Button onClick={onRefreshDogs} className="mt-4">Refresh Dogs</Button>
        </div>
      )}
      
      {/* Exercise Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Exercise for {selectedDog?.dog_name}</DialogTitle>
          </DialogHeader>
          <ExerciseForm 
            onSubmit={handleSubmit} 
            onCancel={() => setDialogOpen(false)} 
            isSubmitting={isSubmitting} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Activity Details Dialog */}
      <Dialog open={activityModalOpen} onOpenChange={setActivityModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Exercise History for {selectedDog?.dog_name}</DialogTitle>
          </DialogHeader>
          {selectedDog && (
            <div className="py-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDog.last_care && selectedDog.last_care.category === 'exercise' ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{selectedDog.last_care.task_name}</p>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(selectedDog.last_care.timestamp), 'MMM d, yyyy h:mm a')}
                          </div>
                        </div>
                        <Badge>Latest</Badge>
                      </div>
                      
                      {/* Check if last_care has notes before accessing it */}
                      {selectedDog.last_care && 'notes' in selectedDog.last_care && selectedDog.last_care.notes && (
                        <div className="mt-2 text-sm">
                          <p className="text-muted-foreground font-medium">Notes:</p>
                          <p>{selectedDog.last_care.notes}</p>
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => {
                          setActivityModalOpen(false);
                          handleLogExercise(selectedDog);
                        }}
                        className="w-full"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Log New Exercise
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Dumbbell className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">No exercise records found</p>
                      <Button 
                        onClick={() => {
                          setActivityModalOpen(false);
                          handleLogExercise(selectedDog);
                        }}
                        className="mt-4"
                      >
                        Log First Exercise
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

// Exercise Card Component
const ExerciseCard: React.FC<{ 
  dog: DogCareStatus; 
  onLogExercise: () => void;
  onViewActivity: () => void;
}> = ({ dog, onLogExercise, onViewActivity }) => {
  const hasExercisedToday = dog.last_care && 
    dog.last_care.category === 'exercise' && 
    new Date(dog.last_care.timestamp).toDateString() === new Date().toDateString();
  
  return (
    <Card className={`overflow-hidden ${hasExercisedToday ? 'border-green-300' : 'border-orange-300'}`}>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center gap-3">
            {dog.dog_photo ? (
              <img 
                src={dog.dog_photo} 
                alt={dog.dog_name} 
                className="h-12 w-12 rounded-full object-cover" 
              />
            ) : (
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">{dog.dog_name.charAt(0)}</span>
              </div>
            )}
            <div>
              <h3 className="font-medium">{dog.dog_name}</h3>
              <p className="text-xs text-muted-foreground">{dog.breed}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Exercise Status:</span>
              <Badge 
                variant="secondary"
                className={hasExercisedToday ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
              >
                {hasExercisedToday ? "Completed Today" : "Needs Exercise"}
              </Badge>
            </div>
            
            {hasExercisedToday && dog.last_care && (
              <div className="mt-2 text-sm space-y-1">
                <p><span className="font-medium">Activity:</span> {dog.last_care.task_name}</p>
                <p><span className="font-medium">Time:</span> {format(new Date(dog.last_care.timestamp), 'h:mm a')}</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button 
              variant={hasExercisedToday ? "outline" : "default"} 
              className="flex-1"
              onClick={onLogExercise}
            >
              {hasExercisedToday ? "Update" : "Log Exercise"}
            </Button>
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={onViewActivity}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Exercise List Item Component
const ExerciseListItem: React.FC<{ 
  dog: DogCareStatus; 
  onLogExercise: () => void;
  onViewActivity: () => void;
}> = ({ dog, onLogExercise, onViewActivity }) => {
  const hasExercisedToday = dog.last_care && 
    dog.last_care.category === 'exercise' && 
    new Date(dog.last_care.timestamp).toDateString() === new Date().toDateString();
  
  return (
    <div className={`p-3 border rounded-lg flex justify-between items-center ${hasExercisedToday ? 'border-green-300 bg-green-50/50 dark:bg-green-900/10' : 'border-orange-300 bg-orange-50/50 dark:bg-orange-900/10'}`}>
      <div className="flex items-center gap-3">
        {dog.dog_photo ? (
          <img 
            src={dog.dog_photo} 
            alt={dog.dog_name} 
            className="h-10 w-10 rounded-full object-cover" 
          />
        ) : (
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary font-bold">{dog.dog_name.charAt(0)}</span>
          </div>
        )}
        <div>
          <div className="flex items-center">
            <h3 className="font-medium">{dog.dog_name}</h3>
            <Badge 
              variant="secondary"
              className={hasExercisedToday ? "ml-2 bg-green-100 text-green-800 hover:bg-green-200" : "ml-2"}
            >
              {hasExercisedToday ? "Exercised" : "Needs Exercise"}
            </Badge>
          </div>
          {hasExercisedToday && dog.last_care && (
            <p className="text-xs text-muted-foreground">
              {dog.last_care.task_name} at {format(new Date(dog.last_care.timestamp), 'h:mm a')}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant={hasExercisedToday ? "outline" : "default"} 
          size="sm"
          onClick={onLogExercise}
        >
          {hasExercisedToday ? "Update" : "Log"}
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onViewActivity}
        >
          Details
        </Button>
      </div>
    </div>
  );
};

export default ExerciseTab;
