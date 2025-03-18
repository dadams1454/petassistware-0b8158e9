
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import DogNameCell from './components/DogNameCell';

interface GroomingScheduleProps {
  dogs: DogCareStatus[];
  onRefresh?: () => void;
}

const GroomingSchedule: React.FC<GroomingScheduleProps> = ({ dogs, onRefresh }) => {
  const [currentMonth] = useState(new Date());
  
  // Generate days for the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get a 7-day window for the schedule (current day and 6 days after)
  const today = new Date();
  const next6Days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  
  // Function to check if a dog has grooming scheduled for a specific day
  const hasGroomingScheduled = (dogId: string, date: Date): boolean => {
    // This is a placeholder. In a real app, you would check against your database
    const dayOfMonth = date.getDate();
    const dogIdLastDigit = parseInt(dogId.slice(-1), 10);
    
    // For demo purposes, schedule grooming every 7 days based on the last digit of the dog ID
    return dayOfMonth % 7 === dogIdLastDigit % 7;
  };
  
  // Function to render the cell content based on whether grooming is scheduled
  const renderGroomingCell = (dogId: string, date: Date) => {
    const isScheduled = hasGroomingScheduled(dogId, date);
    const isToday = date.getDate() === today.getDate() && 
                   date.getMonth() === today.getMonth() && 
                   date.getFullYear() === today.getFullYear();
    
    return (
      <TableCell 
        key={`${dogId}-${format(date, 'yyyy-MM-dd')}`}
        className={`text-center ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''} 
                   ${isScheduled ? 'font-medium' : ''}`}
      >
        {isScheduled ? (
          <div className="flex justify-center">
            <span className="inline-block w-3 h-3 bg-pink-500 rounded-full"></span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="inline-block w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></span>
          </div>
        )}
      </TableCell>
    );
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b">
        <div>
          <h3 className="text-lg font-semibold">Grooming Schedule</h3>
          <p className="text-sm text-muted-foreground">
            {format(monthStart, 'MMMM yyyy')}
          </p>
        </div>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-10 bg-white dark:bg-slate-900">Dog</TableHead>
              {next6Days.map((day) => (
                <TableHead key={format(day, 'yyyy-MM-dd')} className="text-center">
                  <div className="flex flex-col items-center">
                    <span>{format(day, 'EEE')}</span>
                    <span className={`text-sm ${format(day, 'MM/dd') === format(today, 'MM/dd') ? 'text-blue-600 dark:text-blue-400 font-medium' : ''}`}>
                      {format(day, 'MM/dd')}
                    </span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dogs.map((dog) => (
              <TableRow key={dog.dog_id}>
                <TableCell className="sticky left-0 z-10 bg-white dark:bg-slate-900 border-r">
                  <DogNameCell 
                    dog={dog} 
                    activeCategory="grooming"
                  />
                </TableCell>
                {next6Days.map((day) => renderGroomingCell(dog.dog_id, day))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default GroomingSchedule;
