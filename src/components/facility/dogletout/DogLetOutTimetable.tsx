
import React, { useState, useEffect } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Button } from '@/components/ui/button';
import { useDogTimetable } from './hooks/useDogTimetable';
import { RefreshCw, Clock, Calendar, Dog, AlertTriangle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { format } from 'date-fns';

interface DogLetOutTimetableProps {
  dogsData: DogCareStatus[];
  date?: Date;
  onRefresh?: () => void;
}

const DogLetOutTimetable: React.FC<DogLetOutTimetableProps> = ({
  dogsData,
  date = new Date(),
  onRefresh
}) => {
  const {
    timeSlots,
    currentHour,
    dogLetOuts,
    sortedDogs,
    hasDogLetOut,
    hasObservation,
    getObservationDetails,
    handleCellClick,
    handleRefresh,
    isLoading
  } = useDogTimetable(dogsData, onRefresh, 'dogletout', date);
  
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [conflictInfo, setConflictInfo] = useState<{
    dogToLetOut: DogCareStatus | null,
    incompatibleDogs: DogCareStatus[],
    timeSlot: string
  }>({
    dogToLetOut: null,
    incompatibleDogs: [],
    timeSlot: ''
  });

  // State for dogs currently outside
  const [dogsOutside, setDogsOutside] = useState<string[]>([]);
  
  // Function to check incompatibilities before letting a dog out
  const checkAndHandleDogLetOut = (dog: DogCareStatus, timeSlot: string) => {
    // In a real implementation, check for incompatibilities with dogs currently outside
    // For demonstration, we'll simulate finding incompatible dogs
    const incompatibleDogsIds = ['some-dog-id']; // This would come from your database
    
    // Find any incompatible dogs that are currently outside
    const incompatibleDogsOutside = dogsData.filter(d => 
      incompatibleDogsIds.includes(d.dog_id) && dogsOutside.includes(d.dog_id)
    );
    
    if (incompatibleDogsOutside.length > 0) {
      // Show conflict dialog
      setConflictInfo({
        dogToLetOut: dog,
        incompatibleDogs: incompatibleDogsOutside,
        timeSlot
      });
      setConflictDialogOpen(true);
    } else {
      // No conflicts, proceed with let out
      handleCellClick(dog.dog_id, dog.dog_name, timeSlot, 'dogletout');
      // Add dog to outside list
      setDogsOutside(prev => [...prev, dog.dog_id]);
    }
  };
  
  // Handle confirmation to let out despite incompatibilities
  const confirmDogLetOut = () => {
    if (conflictInfo.dogToLetOut) {
      handleCellClick(
        conflictInfo.dogToLetOut.dog_id, 
        conflictInfo.dogToLetOut.dog_name, 
        conflictInfo.timeSlot, 
        'dogletout'
      );
      // Add dog to outside list
      setDogsOutside(prev => [...prev, conflictInfo.dogToLetOut.dog_id]);
    }
    setConflictDialogOpen(false);
  };
  
  // Simulate marking a dog as returned from outside
  const markDogAsReturned = (dogId: string, timeSlot: string) => {
    // Remove dog from outside list
    setDogsOutside(prev => prev.filter(id => id !== dogId));
  };
  
  // Reset outside dogs at day change
  useEffect(() => {
    setDogsOutside([]);
  }, [date]);

  // Get current time slot
  const getCurrentTimeSlot = () => {
    const now = new Date();
    const hours = now.getHours();
    const formattedHour = hours > 12 ? hours - 12 : hours;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${formattedHour}:00 ${ampm}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {format(date, 'EEEE, MMMM d, yyyy')}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Legend for outside status */}
      <div className="flex gap-2 items-center text-xs">
        <span>Status:</span>
        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
          OUT
        </Badge>
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          IN
        </Badge>
        <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Needs Let Out
        </Badge>
      </div>
      
      <ScrollArea className="h-[calc(100vh-240px)] rounded-md border">
        <div className="w-[900px] min-w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="sticky left-0 bg-muted/50 p-2 text-left font-medium text-muted-foreground">
                  Dog Name
                </th>
                {timeSlots.map((slot) => (
                  <th 
                    key={slot} 
                    className={`p-2 text-center font-medium text-muted-foreground ${
                      slot === getCurrentTimeSlot() ? 'bg-amber-50' : ''
                    }`}
                  >
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedDogs.map((dog) => {
                const isOutside = dogsOutside.includes(dog.dog_id);
                
                return (
                  <tr 
                    key={dog.dog_id} 
                    className={`border-b ${isOutside ? 'bg-orange-50' : ''}`}
                  >
                    <td className={`sticky left-0 bg-background p-2 ${isOutside ? 'bg-orange-50' : ''}`}>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-muted">
                          {dog.dog_photo ? (
                            <img 
                              src={dog.dog_photo} 
                              alt={dog.dog_name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Dog className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <span className="font-medium truncate max-w-[120px]">
                          {dog.dog_name}
                        </span>
                      </div>
                    </td>
                    
                    {timeSlots.map((slot) => {
                      const hasBreak = hasDogLetOut(dog.dog_id, slot);
                      const observation = hasObservation(dog.dog_id, slot) 
                        ? getObservationDetails(dog.dog_id) 
                        : null;
                      
                      // Determine cell status
                      let status = "none";
                      if (isOutside && hasBreak) {
                        status = "out";
                      } else if (hasBreak && !isOutside) {
                        status = "in";
                      }
                      
                      return (
                        <td 
                          key={`${dog.dog_id}-${slot}`} 
                          className={`border-l p-0 text-center ${
                            slot === getCurrentTimeSlot() ? 'bg-amber-50' : ''
                          } ${isOutside ? 'bg-orange-50' : ''}`}
                          onClick={() => checkAndHandleDogLetOut(dog, slot)}
                        >
                          <div 
                            className={`h-full w-full py-2 cursor-pointer transition-colors ${
                              hasBreak ? 'bg-opacity-10' : 'hover:bg-muted/40'
                            } relative`}
                          >
                            {status === "out" && (
                              <Badge className="bg-orange-500 hover:bg-orange-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                OUT
                              </Badge>
                            )}
                            {status === "in" && (
                              <Badge className="bg-green-500 hover:bg-green-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                IN
                              </Badge>
                            )}
                            {observation && (
                              <div className="absolute bottom-0.5 right-0.5">
                                <div className="h-2 w-2 rounded-full bg-amber-500" title={observation.text} />
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ScrollArea>
      
      {/* Incompatible Dogs Warning Dialog */}
      <Dialog open={conflictDialogOpen} onOpenChange={setConflictDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Dog Incompatibility Warning
            </DialogTitle>
            <DialogDescription>
              {conflictInfo.dogToLetOut?.dog_name} may not be compatible with dogs currently outside.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-2 font-medium">Incompatible with:</p>
            <div className="space-y-2">
              {conflictInfo.incompatibleDogs.map(dog => (
                <Card key={dog.dog_id} className="p-2 bg-red-50 border-red-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-muted">
                      {dog.dog_photo ? (
                        <img 
                          src={dog.dog_photo} 
                          alt={dog.dog_name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Dog className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <span>{dog.dog_name}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConflictDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDogLetOut}
            >
              Let Out Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DogLetOutTimetable;
