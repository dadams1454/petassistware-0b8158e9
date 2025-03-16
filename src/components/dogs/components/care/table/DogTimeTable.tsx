import React, { useState } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Dog } from 'lucide-react';
import EmptyTableRow from './EmptyTableRow';
import TableDebugger from './TableDebugger';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { timeSlots, getDogRowColor } from './dogGroupColors';
import TimeSlotHeaders from './TimeSlotHeaders';
import DogTimeRow from './DogTimeRow';
import CareCategories, { careCategories } from './CareCategories';
import { useToast } from '@/components/ui/use-toast';

interface DogTimeTableProps {
  dogsStatus: DogCareStatus[];
  onRefresh?: () => void;
}

const DogTimeTable: React.FC<DogTimeTableProps> = ({ dogsStatus, onRefresh }) => {
  const [currentDate] = useState(new Date());
  const [activeCategory, setActiveCategory] = useState('all');
  const { toast } = useToast();
  
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

  // Handle cell click - toggle potty break status
  const handleCellClick = (dogId: string, dogName: string, timeSlot: string, category: string) => {
    // Only handle potty break logging in the potty breaks tab
    if (category === 'pottybreaks') {
      // Check if this dog already has a potty break at this time
      const existingBreakIndex = pottyBreaks.findIndex(
        pb => pb.dogId === dogId && pb.timeSlot === timeSlot
      );
      
      if (existingBreakIndex >= 0) {
        // Remove the potty break if it exists
        const updatedBreaks = [...pottyBreaks];
        updatedBreaks.splice(existingBreakIndex, 1);
        setPottyBreaks(updatedBreaks);
        
        // Show toast for removal
        toast({
          title: "Potty break removed",
          description: `Removed potty break for ${dogName} at ${timeSlot}`,
        });
        
        console.log('Potty break removed:', {
          dog: { id: dogId, name: dogName },
          timeSlot
        });
      } else {
        // Add new potty break
        const newPottyBreak = {
          dogId,
          timeSlot,
          timestamp: new Date().toISOString()
        };
        
        setPottyBreaks([...pottyBreaks, newPottyBreak]);
        
        // Show toast for added potty break
        toast({
          title: "Potty break logged",
          description: `${dogName} was taken out at ${timeSlot}`,
        });
        
        console.log('Potty break logged:', {
          dog: { id: dogId, name: dogName },
          timeSlot,
          timestamp: new Date().toISOString(),
        });
      }
      
      // Trigger refresh if provided
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
            <CareCategories activeCategory={activeCategory} />
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
                      Click on a time slot to mark or unmark a potty break
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
                          <TimeSlotHeaders timeSlots={timeSlots} />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedDogs.map((dog, index) => (
                          <DogTimeRow
                            key={dog.dog_id}
                            dog={dog}
                            timeSlots={timeSlots}
                            rowColor={getDogRowColor(index)}
                            activeCategory={category.id}
                            hasPottyBreak={hasPottyBreak}
                            onCellClick={handleCellClick}
                          />
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
