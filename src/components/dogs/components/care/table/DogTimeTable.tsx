
import React, { useState, useEffect } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Dog, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { logDogPottyBreak } from '@/services/dailyCare/pottyBreak/dogPottyBreakService';
import { getPottyBreaksByDogAndTimeSlot } from '@/services/dailyCare/pottyBreak/pottyBreakQueryService';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Define time slots for the Excel-like grid
const timeSlots = [
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
];

// Color scheme for alternating rows
const getRowColor = (index: number) => 
  index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-800/60';

interface DogTimeTableProps {
  dogsStatus: DogCareStatus[];
  onRefresh?: () => void;
}

const DogTimeTable: React.FC<DogTimeTableProps> = ({ dogsStatus, onRefresh }) => {
  const [currentDate] = useState(new Date());
  const [pottyBreaks, setPottyBreaks] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch potty breaks data
  const fetchPottyBreaks = async () => {
    try {
      setIsLoading(true);
      const breaks = await getPottyBreaksByDogAndTimeSlot(currentDate);
      setPottyBreaks(breaks);
    } catch (error) {
      console.error('Error fetching potty breaks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load potty break data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load potty breaks on initial render
  useEffect(() => {
    fetchPottyBreaks();
  }, [currentDate]);
  
  // Check if a dog has a potty break at a specific time slot
  const hasPottyBreak = (dogId: string, timeSlot: string) => {
    return pottyBreaks[dogId]?.includes(timeSlot) || false;
  };
  
  // Handle cell click to log a potty break
  const handleCellClick = async (dogId: string, dogName: string, timeSlot: string) => {
    try {
      setIsLoading(true);
      await logDogPottyBreak(dogId, timeSlot);
      
      // Update local state for immediate UI feedback
      setPottyBreaks(prev => {
        const updated = { ...prev };
        if (!updated[dogId]) {
          updated[dogId] = [];
        }
        if (!updated[dogId].includes(timeSlot)) {
          updated[dogId].push(timeSlot);
        }
        return updated;
      });
      
      toast({
        title: 'Potty Break Logged',
        description: `${dogName} was taken out at ${timeSlot}`,
      });
    } catch (error) {
      console.error('Error logging potty break:', error);
      toast({
        title: 'Error',
        description: 'Failed to log potty break',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    fetchPottyBreaks();
    if (onRefresh) {
      onRefresh();
    }
  };
  
  // Sort dogs alphabetically by name
  const sortedDogs = [...dogsStatus].sort((a, b) => 
    a.dog_name.toLowerCase().localeCompare(b.dog_name.toLowerCase())
  );

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <Dog className="h-5 w-5 mr-2" />
            Dog Potty Break Log
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({sortedDogs.length} dogs)
            </span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">
                {format(currentDate, 'MM/dd/yyyy')}
              </span>
            </div>
            <Button 
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative overflow-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-slate-800/60">
                  <tr>
                    <th className="sticky left-0 z-10 bg-gray-100 dark:bg-slate-800/60 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[150px]">
                      Dog
                    </th>
                    {timeSlots.map((slot) => (
                      <th key={slot} className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {slot}
                      </th>
                    ))}
                  </tr>
                </thead>
                
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedDogs.length > 0 ? (
                    sortedDogs.map((dog, index) => (
                      <tr key={dog.dog_id} className={getRowColor(index)}>
                        <td className="sticky left-0 z-10 px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 min-w-[150px]"
                            style={{ backgroundColor: index % 2 === 0 ? 'var(--bg-white, white)' : 'var(--bg-gray-50, #f9fafb)' }}>
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 mr-2">
                              {dog.dog_photo ? (
                                <AspectRatio ratio={1/1} className="rounded-full overflow-hidden">
                                  <img src={dog.dog_photo} alt={dog.dog_name} className="h-full w-full object-cover" />
                                </AspectRatio>
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                  <span className="text-blue-500 dark:text-blue-300 font-semibold">
                                    {dog.dog_name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {dog.dog_name}
                              </div>
                              {dog.breed && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {dog.breed}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        {timeSlots.map((slot) => {
                          const hasBreak = hasPottyBreak(dog.dog_id, slot);
                          return (
                            <td 
                              key={`${dog.dog_id}-${slot}`}
                              onClick={() => handleCellClick(dog.dog_id, dog.dog_name, slot)}
                              className={`text-center px-3 py-2 whitespace-nowrap text-sm ${hasBreak ? 'bg-green-100 dark:bg-green-900/30' : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'} cursor-pointer transition-colors`}
                            >
                              {hasBreak ? (
                                <span className="inline-flex items-center justify-center h-6 w-6 text-green-600 dark:text-green-400 font-bold text-lg">
                                  X
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center h-6 w-6"></span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={timeSlots.length + 1} className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                        No dogs available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-slate-800/30 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click on a cell to mark a potty break with an X. The X will remain visible throughout the day.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DogTimeTable;
