
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
import { Pill, Calendar, Clock, BadgeAlert } from 'lucide-react';
import { format, parseISO, isAfter, subDays } from 'date-fns';
import CareLogForm from '../CareLogForm';
import { DogCareStatus } from '@/types/dailyCare';
import { Badge } from '@/components/ui/badge';

interface MedicationsLogProps {
  dogs: DogCareStatus[];
  onRefresh: () => void;
}

const MedicationsLog: React.FC<MedicationsLogProps> = ({ dogs, onRefresh }) => {
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Handle medication logging
  const handleLogMedication = (dogId: string) => {
    setSelectedDogId(dogId);
    setDialogOpen(true);
  };
  
  // Handle success callback
  const handleMedicationLogged = () => {
    setDialogOpen(false);
    toast({
      title: "Medication logged",
      description: "The medication has been logged successfully",
    });
    onRefresh();
  };
  
  // Get today's date for display
  const today = new Date();
  const dateDisplay = format(today, 'EEEE, MMMM d');
  
  // Helper to determine if medication was given in the last 30 days
  const hasRecentPreventativeMed = (dog: DogCareStatus, medicationType: string): boolean => {
    if (!dog.last_care) return false;
    
    // Check if we have the specific medication logged
    if (dog.last_care.category === 'medications' && 
        dog.last_care.task_name.toLowerCase().includes(medicationType.toLowerCase())) {
      
      // Check if it was given within the last 30 days
      const medDate = parseISO(dog.last_care.timestamp);
      return isAfter(medDate, subDays(today, 30));
    }
    
    return false;
  };
  
  // Get medication status text and color
  const getMedicationStatus = (dog: DogCareStatus, medicationType: string) => {
    const hasRecent = hasRecentPreventativeMed(dog, medicationType);
    
    return {
      status: hasRecent ? 'Current' : 'Due',
      color: hasRecent ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                         'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
    };
  };
  
  // Check if the dog has daily medications
  const hasDailyMeds = (dog: DogCareStatus): boolean => {
    if (!dog.last_care) return false;
    
    // Check if we have any daily medication logged for today
    if (dog.last_care.category === 'medications' && 
        (dog.last_care.task_name.toLowerCase().includes('dewormer') || 
         dog.last_care.task_name.toLowerCase().includes('antibiotic'))) {
      
      // Check if it was given today
      const medDate = parseISO(dog.last_care.timestamp);
      return medDate.toDateString() === today.toDateString();
    }
    
    return false;
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Pill className="h-5 w-5 mr-2" />
          Medications Log
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({dateDisplay})
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {dogs.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-muted-foreground">No dogs available for medication tracking.</p>
            <Button onClick={onRefresh} variant="outline" className="mt-2">
              Refresh Dogs
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dogs.map(dog => {
              const heartworkStatus = getMedicationStatus(dog, 'heartwork');
              const fleaTickStatus = getMedicationStatus(dog, 'flea');
              const hasDaily = hasDailyMeds(dog);
              
              return (
                <Card key={dog.dog_id} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
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
                            variant="default" 
                            size="sm"
                            onClick={() => handleLogMedication(dog.dog_id)}
                          >
                            Log Medication
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          {selectedDogId === dog.dog_id && (
                            <DialogHeader>
                              <DialogTitle>Log Medication for {dog.dog_name}</DialogTitle>
                            </DialogHeader>
                          )}
                          {selectedDogId === dog.dog_id && (
                            <CareLogForm 
                              dogId={dog.dog_id} 
                              onSuccess={handleMedicationLogged} 
                              initialCategory="medications" 
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="mt-2 space-y-2 pt-2 border-t text-sm">
                      <div className="flex items-center justify-between">
                        <span>Heartworm Prevention:</span>
                        <Badge className={`${heartworkStatus.color}`}>
                          {heartworkStatus.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Flea/Tick Prevention:</span>
                        <Badge className={`${fleaTickStatus.color}`}>
                          {fleaTickStatus.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Daily Medications:</span>
                        <Badge className={hasDaily ? 
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                          'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}>
                          {hasDaily ? 'Given Today' : 'None Recorded'}
                        </Badge>
                      </div>
                    </div>
                    
                    {dog.last_care && dog.last_care.category === 'medications' && (
                      <div className="mt-3 pt-2 border-t text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Pill className="h-3 w-3 mr-1 text-purple-500" />
                          <span className="font-medium text-purple-600">
                            Last: {dog.last_care.task_name}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {format(new Date(dog.last_care.timestamp), 'MMM d, h:mm a')}
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

export default MedicationsLog;
