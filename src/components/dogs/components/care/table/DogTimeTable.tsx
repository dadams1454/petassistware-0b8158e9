
import React, { useState } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, Dog, X } from 'lucide-react';
import EmptyTableRow from './EmptyTableRow';
import TableDebugger from './TableDebugger';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PottyBreakLogger from '@/components/dashboard/dialogs/PottyBreakDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DogTimeTableProps {
  dogsStatus: DogCareStatus[];
  onRefresh?: () => void;
}

// Define time slots for the table columns
const timeSlots = [
  '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM',
  '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM',
  '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'
];

// Dog group colors for the rotation schedule
const dogGroupColors = {
  groupA: 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-800/30',
  groupB: 'bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/20 dark:hover:bg-cyan-800/30',
  groupC: 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/20 dark:hover:bg-amber-800/30',
  groupD: 'bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-800/30',
  groupE: 'bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-800/30',
  groupF: 'bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-800/30',
};

// Function to get color for a dog based on its position in the list
const getDogRowColor = (index: number) => {
  if (index < 3) return dogGroupColors.groupA;
  if (index < 6) return dogGroupColors.groupB;
  if (index < 9) return dogGroupColors.groupC;
  if (index < 12) return dogGroupColors.groupD;
  if (index < 15) return dogGroupColors.groupE;
  return dogGroupColors.groupF;
};

// Care category icons and colors
const careCategories = [
  { id: 'all', name: 'All Care', icon: <Dog className="h-4 w-4 mr-1" /> },
  { id: 'exercise', name: 'Exercise', icon: <Dog className="h-4 w-4 mr-1" /> },
  { id: 'feeding', name: 'Feeding', icon: <Dog className="h-4 w-4 mr-1" /> },
  { id: 'grooming', name: 'Grooming', icon: <Dog className="h-4 w-4 mr-1" /> },
  { id: 'medication', name: 'Medication', icon: <Dog className="h-4 w-4 mr-1" /> },
  { id: 'pottybreaks', name: 'Potty Breaks', icon: <Dog className="h-4 w-4 mr-1" /> },
];

const DogTimeTable: React.FC<DogTimeTableProps> = ({ dogsStatus, onRefresh }) => {
  const [currentDate] = useState(new Date());
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Track potty breaks in a state variable
  const [pottyBreaks, setPottyBreaks] = useState<{
    dogId: string;
    timeSlot: string;
    timestamp: string;
  }[]>([]);
  
  // Filter out duplicate dog names to avoid confusion in the table
  const uniqueDogs = dogsStatus.reduce((acc: DogCareStatus[], current) => {
    const isDuplicate = acc.find((dog) => dog.dog_name.toLowerCase() === current.dog_name.toLowerCase());
    if (!isDuplicate) {
      acc.push(current);
    }
    return acc;
  }, []);
  
  // Sort dogs alphabetically by name
  const sortedDogs = [...uniqueDogs].sort((a, b) => 
    a.dog_name.toLowerCase().localeCompare(b.dog_name.toLowerCase())
  );

  // Handle cell click - for potty breaks, immediately mark with an X
  const handleCellClick = (dogId: string, dogName: string, timeSlot: string, category: string) => {
    console.log(`Cell clicked: Dog ${dogId}, Time: ${timeSlot}, Category: ${category}`);
    
    // Only handle potty break logging in the potty breaks tab
    if (category === 'pottybreaks') {
      // Add new potty break to the state
      const newPottyBreak = {
        dogId,
        timeSlot,
        timestamp: new Date().toISOString()
      };
      
      setPottyBreaks([...pottyBreaks, newPottyBreak]);
      
      // Log potty break
      console.log('Potty break logged:', {
        dog: { id: dogId, name: dogName },
        timeSlot,
        timestamp: new Date().toISOString(),
      });
      
      // Show a toast notification
      if (onRefresh) {
        onRefresh();
      }
    }
  };
  
  // Check if a potty break exists for a specific dog and time slot
  const hasPottyBreak = (dogId: string, timeSlot: string) => {
    return pottyBreaks.some(pb => pb.dogId === dogId && pb.timeSlot === timeSlot);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <Dog className="h-5 w-5 mr-2" />
            Dog Care Schedule
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({sortedDogs.length} dogs)
            </span>
          </CardTitle>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              Date: {format(currentDate, 'MM/dd/yyyy')}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="w-full justify-start px-4 pt-2 bg-muted/50 rounded-none border-b">
            {careCategories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:bg-background rounded-t-lg rounded-b-none"
              >
                {category.icon}
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {careCategories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="p-2 bg-background border-b border-muted">
                <p className="text-sm text-muted-foreground">
                  {category.id === 'all' 
                    ? 'Showing all care activities' 
                    : `Showing schedule for ${category.name}`}
                  
                  {category.id === 'pottybreaks' && (
                    <span className="ml-2 text-sm text-blue-500">
                      Click on a time slot to mark a potty break
                    </span>
                  )}
                </p>
              </div>
              
              {sortedDogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="min-w-max">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-32 sticky left-0 z-10 bg-muted/50">Dog Name</TableHead>
                          {timeSlots.map((timeSlot) => (
                            <TableHead key={timeSlot} className="text-center px-2 py-1 w-12 border-x border-slate-200">
                              {timeSlot}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedDogs.map((dog, index) => (
                          <TableRow key={dog.dog_id} className={getDogRowColor(index)}>
                            <TableCell className="font-medium sticky left-0 z-10 border-r border-slate-200 bg-white dark:bg-slate-900">
                              <div className="flex items-center space-x-2">
                                {dog.dog_photo ? (
                                  <img 
                                    src={dog.dog_photo} 
                                    alt={dog.dog_name} 
                                    className="w-6 h-6 rounded-full object-cover" 
                                  />
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Dog className="h-3 w-3 text-primary" />
                                  </div>
                                )}
                                <span>{dog.dog_name}</span>
                              </div>
                            </TableCell>
                            {timeSlots.map((timeSlot) => (
                              <TableCell 
                                key={`${dog.dog_id}-${timeSlot}`} 
                                className={`text-center p-0 h-10 border border-slate-200 
                                  ${category.id === 'pottybreaks' ? 'cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/20' : ''}
                                `}
                                onClick={() => category.id === 'pottybreaks' && handleCellClick(dog.dog_id, dog.dog_name, timeSlot, category.id)}
                              >
                                {category.id === 'pottybreaks' && hasPottyBreak(dog.dog_id, timeSlot) ? (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="flex items-center justify-center h-full">
                                          <X className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{dog.dog_name} - Potty break at {timeSlot}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ) : (
                                  <span>&nbsp;</span>
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <EmptyTableRow onRefresh={onRefresh} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      
      {/* Hidden debugging component */}
      <TableDebugger dogsStatus={dogsStatus} selectedCategory={activeCategory} />
    </Card>
  );
};

export default DogTimeTable;
