
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import { Scissors } from 'lucide-react';
import { format, getDaysInMonth, startOfMonth, addDays } from 'date-fns';
import DogNameCell from './components/DogNameCell';
import { useToast } from '@/components/ui/use-toast';
import { getDogRowColor } from './dogGroupColors';

interface GroomingScheduleProps {
  dogs: DogCareStatus[];
  onRefresh?: () => void;
}

const GroomingSchedule: React.FC<GroomingScheduleProps> = ({ dogs, onRefresh }) => {
  const [currentMonth] = useState(new Date());
  const { toast } = useToast();
  const [groomingRecords, setGroomingRecords] = useState<Record<string, boolean>>({});
  
  // Generate days for the current month
  const daysInMonth = getDaysInMonth(currentMonth);
  const monthStart = startOfMonth(currentMonth);
  
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Get day date objects for the current month
  const days = dayNumbers.map(day => addDays(monthStart, day - 1));
  
  // Check if grooming is recorded for a specific day
  const isGroomingRecorded = (dogId: string, day: number) => {
    const key = `${dogId}-${day}-grooming`;
    return groomingRecords[key] || false;
  };
  
  // Handle cell click to log grooming
  const handleGroomingClick = (dogId: string, dogName: string, day: number) => {
    const key = `${dogId}-${day}-grooming`;
    const dayDate = addDays(monthStart, day - 1);
    const formattedDay = format(dayDate, 'MMM d');
    
    if (groomingRecords[key]) {
      // Remove grooming record
      const updatedRecords = { ...groomingRecords };
      delete updatedRecords[key];
      setGroomingRecords(updatedRecords);
      
      toast({
        title: "Grooming removed",
        description: `Removed grooming for ${dogName} on ${formattedDay}`,
      });
    } else {
      // Add grooming record
      setGroomingRecords(prev => ({
        ...prev,
        [key]: true
      }));
      
      toast({
        title: "Grooming scheduled",
        description: `Scheduled grooming for ${dogName} on ${formattedDay}`,
      });
    }
    
    // Trigger refresh if provided
    if (onRefresh) {
      onRefresh();
    }
  };
  
  // Sort dogs alphabetically by name
  const sortedDogs = [...dogs].sort((a, b) => 
    a.dog_name.toLowerCase().localeCompare(b.dog_name.toLowerCase())
  );

  // Empty function for DogNameCell compatibility
  const handleCareLogClick = () => {};

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Scissors className="h-5 w-5 mr-2" />
          Monthly Grooming Schedule
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({format(currentMonth, 'MMMM yyyy')})
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Click on a day to schedule or remove grooming for each dog
        </p>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-40 sticky left-0 z-10 bg-muted/50">Dog Name</TableHead>
                {dayNumbers.map(day => (
                  <TableHead 
                    key={`day-${day}`} 
                    className="text-center px-2 py-1 w-12 border-x border-slate-200"
                  >
                    {day}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDogs.map((dog, index) => (
                <TableRow 
                  key={`${dog.dog_id}-grooming-row`}
                  className={getDogRowColor(index)}
                >
                  <DogNameCell 
                    dog={dog} 
                    onCareLogClick={handleCareLogClick} 
                    activeCategory="grooming" 
                  />
                  
                  {dayNumbers.map(day => {
                    const hasGrooming = isGroomingRecorded(dog.dog_id, day);
                    
                    return (
                      <TableCell
                        key={`${dog.dog_id}-day-${day}`}
                        className={`
                          text-center py-2 px-1 relative border cursor-pointer
                          ${hasGrooming 
                            ? 'bg-pink-100 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800' 
                            : 'bg-white dark:bg-slate-800 hover:bg-pink-50 dark:hover:bg-pink-900/20'}
                        `}
                        onClick={() => handleGroomingClick(dog.dog_id, dog.dog_name, day)}
                        title={`${dog.dog_name} - ${format(days[day-1], 'MMM d')}`}
                      >
                        {hasGrooming ? (
                          <div className="flex items-center justify-center">
                            <Scissors className="h-3 w-3 text-pink-600 dark:text-pink-400" />
                          </div>
                        ) : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroomingSchedule;
