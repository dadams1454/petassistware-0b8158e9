
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, FileText, AlertTriangle, MessageCircle, Activity, Heart } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { getLastDogPottyBreak } from '@/services/dailyCare/pottyBreak/dogPottyBreakService';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Radio, RadioGroup } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';

interface PottyBreakReminderCardProps {
  dogs: DogCareStatus[];
  onLogPottyBreak: () => void;
}

type ObservationType = 'accident' | 'heat' | 'behavior' | 'other';

const PottyBreakReminderCard: React.FC<PottyBreakReminderCardProps> = ({ 
  dogs, 
  onLogPottyBreak 
}) => {
  const [dogsWithTimes, setDogsWithTimes] = useState<{
    dog: DogCareStatus;
    lastBreak: string | null;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDog, setSelectedDog] = useState<DogCareStatus | null>(null);
  const [observationNote, setObservationNote] = useState('');
  const [observationType, setObservationType] = useState<ObservationType>('other');
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

  // Handler for opening the observation dialog
  const handleObservationClick = (dog: DogCareStatus) => {
    setSelectedDog(dog);
    setObservationNote('');
    setObservationType('other');
    setDialogOpen(true);
  };

  // Handler for submitting an observation
  const handleSubmitObservation = async () => {
    if (!selectedDog || !observationNote.trim()) return;
    
    try {
      // Here you would call your API to add the observation
      // For now, we'll just show a toast
      toast({
        title: "Observation Recorded",
        description: `Added ${observationType} observation for ${selectedDog.dog_name}`,
      });
      
      setDialogOpen(false);
      setSelectedDog(null);
      setObservationNote('');
    } catch (error) {
      console.error('Error recording observation:', error);
      toast({
        title: "Error",
        description: "Failed to record observation. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Get observation type icon
  const getObservationTypeIcon = (type: ObservationType) => {
    switch (type) {
      case 'accident':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'heat':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'behavior':
        return <Activity className="h-4 w-4 text-blue-500" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />;
    }
  };

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

  // Dialog content is the same for both mobile and desktop
  const observationDialogContent = (
    <>
      <div className="space-y-4 mt-2">
        <div>
          <Label htmlFor="observation-type">Observation Type</Label>
          <RadioGroup 
            value={observationType} 
            onValueChange={(value) => setObservationType(value as ObservationType)}
            className="flex flex-wrap gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="accident"
                value="accident"
                checked={observationType === 'accident'}
                onChange={() => setObservationType('accident')}
                className="h-4 w-4"
              />
              <Label htmlFor="accident" className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Accident
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="heat"
                value="heat"
                checked={observationType === 'heat'}
                onChange={() => setObservationType('heat')}
                className="h-4 w-4"
              />
              <Label htmlFor="heat" className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-red-500" />
                Heat Signs
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="behavior"
                value="behavior"
                checked={observationType === 'behavior'}
                onChange={() => setObservationType('behavior')}
                className="h-4 w-4"
              />
              <Label htmlFor="behavior" className="flex items-center gap-1">
                <Activity className="h-4 w-4 text-blue-500" />
                Behavior
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="other"
                value="other"
                checked={observationType === 'other'}
                onChange={() => setObservationType('other')}
                className="h-4 w-4"
              />
              <Label htmlFor="other" className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4 text-gray-500" />
                Other
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <Label htmlFor="observation">Observation Notes</Label>
          <Textarea
            id="observation"
            value={observationNote}
            onChange={(e) => setObservationNote(e.target.value)}
            placeholder="Enter your observation (e.g., 'Dog had an accident in kennel' or 'Showing early signs of heat')"
            className="mt-1"
            rows={4}
          />
        </div>
      </div>
      
      <div className={`mt-4 ${isMobile ? 'flex justify-end gap-2' : ''}`}>
        {isMobile ? (
          <>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={handleSubmitObservation}
              disabled={!observationNote.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </>
        ) : (
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={handleSubmitObservation}
              disabled={!observationNote.trim() || isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Observation'}
            </Button>
          </DialogFooter>
        )}
      </div>
    </>
  );

  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
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
            </div>
          </div>
          
          {/* Dogs that need potty breaks with observation buttons */}
          <div className="mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {needsPottyBreak.map(({ dog, lastBreak }) => (
                <div key={dog.dog_id} className="flex items-center bg-white dark:bg-slate-800 rounded-md p-2 shadow-sm">
                  <div className="flex-shrink-0 mr-2">
                    {dog.dog_photo ? (
                      <img 
                        src={dog.dog_photo} 
                        alt={dog.dog_name} 
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400 text-xs">{dog.dog_name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="text-sm font-medium truncate">{dog.dog_name}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span className="truncate">{getTimeSinceLastPottyBreak(lastBreak)}</span>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-2 p-1 h-auto"
                    onClick={() => handleObservationClick(dog)}
                    title={`Add observation for ${dog.dog_name}`}
                  >
                    <MessageCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-2 flex justify-end">
            <Button 
              onClick={onLogPottyBreak}
              className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
            >
              <FileText className="h-4 w-4" />
              Go to Potty Breaks
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* Observation Dialog/Sheet based on device type */}
      {isMobile ? (
        <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
          <SheetContent side="bottom" className="h-auto max-h-[85vh] pb-10">
            <SheetHeader className="mb-4">
              <SheetTitle>Observation for {selectedDog?.dog_name}</SheetTitle>
            </SheetHeader>
            {observationDialogContent}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Daily Observation for {selectedDog?.dog_name}</DialogTitle>
            </DialogHeader>
            {observationDialogContent}
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default PottyBreakReminderCard;
