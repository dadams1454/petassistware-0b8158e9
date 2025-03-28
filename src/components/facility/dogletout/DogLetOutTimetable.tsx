
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, Dog, Clock, MapPin, RefreshCw } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { useDailyCare } from '@/contexts/dailyCare';
import { useDogLetOut } from './hooks/useDogLetOut';
import { useDogSorting } from './hooks/useDogSorting';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

interface DogLetOutTimetableProps {
  dogsData: DogCareStatus[];
  date: Date;
  onRefresh?: () => void;
}

const DogLetOutTimetable: React.FC<DogLetOutTimetableProps> = ({
  dogsData,
  date,
  onRefresh
}) => {
  const { dogStatuses } = useDailyCare();
  const dogs = dogsData.length > 0 ? dogsData : dogStatuses || [];
  const { sortedDogs, sortConfig, requestSort } = useDogSorting(dogs);
  const { toast } = useToast();
  
  // Get timeSlots, dogLetOuts, and operations for the date
  const { 
    dogLetOuts, 
    isLoading, 
    fetchDogLetOuts, 
    hasDogLetOut
  } = useDogLetOut(date);

  const [selectedDogs, setSelectedDogs] = useState<string[]>([]);
  const [warningDialog, setWarningDialog] = useState({ 
    open: false, 
    dogId: '', 
    dogName: '' 
  });
  
  // Generate time slots from 6am to 6pm (reduced range to fit better on screen)
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 6; // Starting from 6am
    const h = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${h}${ampm}`;
  });

  // Effect to fetch dog let out data when date changes
  useEffect(() => {
    fetchDogLetOuts();
  }, [date, fetchDogLetOuts]);
  
  // Refresh data
  const handleRefresh = useCallback(() => {
    fetchDogLetOuts(true);
    if (onRefresh) onRefresh();
  }, [fetchDogLetOuts, onRefresh]);
  
  // Handle clicking on a cell in the timetable
  const handleCellClick = useCallback((dogId: string, dogName: string, timeSlot: string) => {
    // Check if the dog has been let out at this time
    const isLetOut = hasDogLetOut(dogId, timeSlot);
    
    if (isLetOut) {
      // Remove the dog let out
      toast({
        title: 'Let Out Removed',
        description: `Let out entry for ${dogName} at ${timeSlot} has been removed`,
      });
    } else {
      // Add dog let out
      toast({
        title: 'Dog Let Out',
        description: `${dogName} was let out at ${timeSlot}`,
      });
    }
  }, [hasDogLetOut, toast]);
  
  // Toggle dog selection
  const toggleDogSelection = useCallback((dogId: string) => {
    setSelectedDogs(prev => 
      prev.includes(dogId) 
        ? prev.filter(id => id !== dogId) 
        : [...prev, dogId]
    );
  }, []);
  
  // Clear selected dogs
  const clearSelectedDogs = useCallback(() => {
    setSelectedDogs([]);
  }, []);

  // Confirm warning dialog
  const handleConfirmWarning = useCallback(() => {
    if (warningDialog.dogId && warningDialog.dogName) {
      // Proceed with let out after warning
      setWarningDialog({ open: false, dogId: '', dogName: '' });
    }
  }, [warningDialog]);
  
  // Get count of dogs let out at a specific time
  const getDogsLetOutCount = useCallback((timeSlot: string) => {
    return dogs.filter(dog => hasDogLetOut(dog.dog_id, timeSlot)).length;
  }, [dogs, hasDogLetOut]);

  // Check if a specific time slot has any dog let out
  const timeSlotHasActivity = useCallback((timeSlot: string) => {
    return getDogsLetOutCount(timeSlot) > 0;
  }, [getDogsLetOutCount]);

  // Render the timetable
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Let Out Schedule for {date.toLocaleDateString()}
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="border rounded-md overflow-auto">
          <div className="max-h-[calc(100vh-300px)] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow>
                  <TableHead className="sticky left-0 bg-background whitespace-nowrap w-[120px] min-w-[120px]">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => requestSort('dog_name')}
                      className="w-full flex justify-start px-2"
                    >
                      Dog
                      {sortConfig?.key === 'dog_name' && (
                        <span className="ml-2">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </Button>
                  </TableHead>
                  
                  {timeSlots.map((timeSlot) => (
                    <TableHead 
                      key={timeSlot} 
                      className="text-center w-12 min-w-12 px-1 whitespace-nowrap"
                    >
                      <div className="flex flex-col items-center text-xs">
                        <span>{timeSlot}</span>
                        {timeSlotHasActivity(timeSlot) && (
                          <Badge variant="outline" className="mt-1 px-1 text-[10px]">
                            {getDogsLetOutCount(timeSlot)}
                          </Badge>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {sortedDogs.map((dog) => (
                  <TableRow key={dog.dog_id}>
                    <TableCell className="sticky left-0 bg-background font-medium py-2 px-1 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <input 
                          type="checkbox" 
                          checked={selectedDogs.includes(dog.dog_id)}
                          onChange={() => toggleDogSelection(dog.dog_id)} 
                          className="h-3 w-3 rounded border-gray-300"
                        />
                        {dog.requires_special_handling && (
                          <AlertCircle className="h-3 w-3 text-amber-500" />
                        )}
                        <span className="text-sm truncate max-w-[80px]" title={dog.dog_name}>
                          {dog.dog_name}
                        </span>
                      </div>
                    </TableCell>
                    
                    {timeSlots.map((timeSlot) => {
                      const isLetOut = hasDogLetOut(dog.dog_id, timeSlot);
                      
                      return (
                        <TableCell 
                          key={`${dog.dog_id}-${timeSlot}`} 
                          className={`text-center cursor-pointer hover:bg-muted transition-colors p-1 ${
                            isLetOut ? 'bg-green-50 dark:bg-green-900/20' : ''
                          }`}
                          onClick={() => handleCellClick(dog.dog_id, dog.dog_name, timeSlot)}
                        >
                          {isLetOut ? (
                            <Check className="h-4 w-4 text-green-500 dark:text-green-400 mx-auto" />
                          ) : null}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
                
                {sortedDogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={timeSlots.length + 1} className="h-24 text-center">
                      No dogs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      
      {selectedDogs.length > 0 && (
        <Card className="mt-4 bg-muted/30">
          <CardContent className="pt-4 pb-2 flex justify-between items-center">
            <div>
              <span className="font-medium">Selected:</span> {selectedDogs.length} dogs
            </div>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearSelectedDogs}
              >
                Clear
              </Button>
              <Button 
                size="sm" 
                className="gap-2"
              >
                <Dog className="h-4 w-4" />
                Let Out Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Warning Dialog */}
      <Dialog open={warningDialog.open} onOpenChange={(open) => setWarningDialog(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compatibility Warning</DialogTitle>
            <DialogDescription>
              There may be compatibility issues letting out {warningDialog.dogName} at this time.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Some dogs currently outside may not be compatible with {warningDialog.dogName}.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWarningDialog({ open: false, dogId: '', dogName: '' })}>
              Cancel
            </Button>
            <Button onClick={handleConfirmWarning}>
              Proceed Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DogLetOutTimetable;
