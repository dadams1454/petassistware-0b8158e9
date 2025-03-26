import React, { useState, useEffect } from 'react';
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
import { format, parseISO } from 'date-fns';
import MedicationForm from './MedicationForm';
import { DogCareStatus, DailyCarelog } from '@/types/dailyCare';
import { Badge } from '@/components/ui/badge';
import { MedicationFrequency, getMedicationStatus } from '@/utils/medicationUtils';

interface MedicationsLogProps {
  dogs: DogCareStatus[];
  onRefresh: () => void;
}

interface MedicationInfo {
  name: string;
  lastAdministered: string | null;
  frequency: MedicationFrequency;
}

const MedicationsLog: React.FC<MedicationsLogProps> = ({ dogs, onRefresh }) => {
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recentLogs, setRecentLogs] = useState<{[dogId: string]: DailyCarelog[]}>({});
  const { toast } = useToast();
  const { fetchRecentCareLogsByCategory } = useDailyCare();
  
  // Get medication logs for each dog
  useEffect(() => {
    const fetchDogMedications = async () => {
      const medicationsByDog: {[dogId: string]: DailyCarelog[]} = {};
      
      for (const dog of dogs) {
        try {
          const medications = await fetchRecentCareLogsByCategory(dog.dog_id, 'medications', 10);
          medicationsByDog[dog.dog_id] = medications;
        } catch (error) {
          console.error(`Error fetching medications for dog ${dog.dog_id}:`, error);
        }
      }
      
      setRecentLogs(medicationsByDog);
    };
    
    if (dogs.length > 0) {
      fetchDogMedications();
    }
  }, [dogs, fetchRecentCareLogsByCategory]);
  
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
  
  // Extract medications information from logs
  const getMedicationsForDog = (dogId: string): MedicationInfo[] => {
    const logs = recentLogs[dogId] || [];
    const medications: {[name: string]: MedicationInfo} = {};
    
    logs.forEach(log => {
      // Parse medication name and frequency from task_name
      // Format is expected to be: "Medication Name (Frequency)"
      const matchResult = log.task_name.match(/(.+) \(([A-Za-z]+)\)$/);
      
      if (matchResult && matchResult.length === 3) {
        const [_, name, frequencyLabel] = matchResult;
        const frequency = frequencyLabel.toLowerCase() as MedicationFrequency;
        
        // Only update if this is a newer record than what we already have
        if (!medications[name] || 
            (medications[name] && medications[name].lastAdministered && 
             log.timestamp > medications[name].lastAdministered!)) {
          medications[name] = {
            name,
            lastAdministered: log.timestamp,
            frequency: frequency as MedicationFrequency
          };
        }
      } else {
        // Handle legacy format (no frequency in name)
        const name = log.task_name;
        if (!medications[name] || 
            (medications[name] && medications[name].lastAdministered && 
             log.timestamp > medications[name].lastAdministered!)) {
          medications[name] = {
            name,
            lastAdministered: log.timestamp,
            frequency: MedicationFrequency.MONTHLY // Default to monthly for legacy records
          };
        }
      }
    });
    
    return Object.values(medications);
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
              const dogMedications = getMedicationsForDog(dog.dog_id);
              const preventativeMeds = dogMedications.filter(med => 
                // Common preventative medications
                med.name.toLowerCase().includes('heartworm') || 
                med.name.toLowerCase().includes('flea') || 
                med.name.toLowerCase().includes('tick')
              );
              
              const otherMeds = dogMedications.filter(med => 
                // Other medications (not common preventatives)
                !med.name.toLowerCase().includes('heartworm') && 
                !med.name.toLowerCase().includes('flea') && 
                !med.name.toLowerCase().includes('tick')
              );
              
              // Look for preventative medications to display status
              const heartwormMed = preventativeMeds.find(med => 
                med.name.toLowerCase().includes('heartworm')
              );
              const fleaTickMed = preventativeMeds.find(med => 
                med.name.toLowerCase().includes('flea') || 
                med.name.toLowerCase().includes('tick')
              );
              
              // Get status for display
              const heartwormStatus = heartwormMed 
                ? getMedicationStatus(heartwormMed.lastAdministered, heartwormMed.frequency)
                : { status: 'incomplete', statusColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' };
                
              const fleaTickStatus = fleaTickMed
                ? getMedicationStatus(fleaTickMed.lastAdministered, fleaTickMed.frequency)
                : { status: 'incomplete', statusColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' };
              
              // Check if any other medications are ongoing
              const hasOtherMeds = otherMeds.length > 0;
              
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
                        <DialogContent className="max-w-md">
                          {selectedDogId === dog.dog_id && (
                            <DialogHeader>
                              <DialogTitle>Log Medication for {dog.dog_name}</DialogTitle>
                            </DialogHeader>
                          )}
                          {selectedDogId === dog.dog_id && (
                            <MedicationForm 
                              dogId={dog.dog_id} 
                              onSuccess={handleMedicationLogged} 
                              onCancel={() => setDialogOpen(false)} 
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="mt-2 space-y-2 pt-2 border-t text-sm">
                      <div className="flex items-center justify-between">
                        <span>Heartworm Prevention:</span>
                        <Badge className={`${heartwormStatus.statusColor}`}>
                          {heartwormStatus.status === 'incomplete' ? 'Not Recorded' : 
                           heartwormStatus.status === 'current' ? 'Current' : 
                           heartwormStatus.status === 'due_soon' ? 'Due Soon' : 'Overdue'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Flea/Tick Prevention:</span>
                        <Badge className={`${fleaTickStatus.statusColor}`}>
                          {fleaTickStatus.status === 'incomplete' ? 'Not Recorded' : 
                           fleaTickStatus.status === 'current' ? 'Current' : 
                           fleaTickStatus.status === 'due_soon' ? 'Due Soon' : 'Overdue'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Other Medications:</span>
                        <Badge className={hasOtherMeds ? 
                          'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 
                          'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}>
                          {hasOtherMeds ? `${otherMeds.length} Active` : 'None'}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Show most recent medication */}
                    {dogMedications.length > 0 && (
                      <div className="mt-3 pt-2 border-t text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Pill className="h-3 w-3 mr-1 text-purple-500" />
                          <span className="font-medium text-purple-600">
                            Last: {dogMedications[0].name}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {dogMedications[0].lastAdministered ? 
                              format(new Date(dogMedications[0].lastAdministered), 'MMM d, h:mm a') : 
                              'No date recorded'}
                          </span>
                        </div>
                        {dogMedications[0].frequency && (
                          <div className="flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              {dogMedications[0].frequency.charAt(0).toUpperCase() + 
                               dogMedications[0].frequency.slice(1)}
                            </span>
                          </div>
                        )}
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
