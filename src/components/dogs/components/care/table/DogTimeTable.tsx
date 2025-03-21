
import React, { useState, useCallback, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import TimeTableFooter from './components/TimeTableFooter';
import EmptyTableRow from './EmptyTableRow';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import { Category } from './types/category';
import { useCategoryData } from './hooks/useCategoryData';
import { useCellActions } from './hooks/pottyBreakHooks/cellActions/useCellActions';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Circle, CheckCircle } from 'lucide-react';

interface DogTimeTableProps {
  dogsStatus: DogCareStatus[];
  onRefresh?: () => void;
  currentDate?: Date;
}

const DogTimeTable: React.FC<DogTimeTableProps> = ({ 
  dogsStatus, 
  onRefresh, 
  currentDate = new Date() 
}) => {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState<Category>('pottybreaks');
  const { categoryData, isLoading: isCategoryDataLoading } = useCategoryData(dogsStatus, activeCategory, currentDate);
  const { handleLogCare } = useCellActions(onRefresh);
  
  // Function to get the appropriate icon based on care log status
  const getStatusIcon = useCallback((dog: DogCareStatus, timeSlot: string) => {
    if (!dog.care_logs) return <Circle className="h-4 w-4 text-gray-300 dark:text-gray-600" />;
    
    const careLog = dog.care_logs.find(log => {
      const logTime = format(new Date(log.timestamp), 'HH:mm');
      return logTime === timeSlot;
    });
    
    return careLog 
      ? <CheckCircle className="h-4 w-4 text-green-500" /> 
      : <Circle className="h-4 w-4 text-gray-300 dark:text-gray-600" />;
  }, []);
  
  // Memoize the generation of time slots
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let i = 6; i <= 22; i++) {
      const hour = i.toString().padStart(2, '0');
      slots.push(`${hour}:00`);
    }
    return slots;
  }, []);
  
  // Memoize the last update time
  const lastUpdateTime = useMemo(() => {
    if (!dogsStatus || dogsStatus.length === 0) {
      return 'N/A';
    }
    
    // Find the most recent timestamp among all care logs
    let latestTimestamp = 0;
    dogsStatus.forEach(dog => {
      if (dog.care_logs) {
        dog.care_logs.forEach(log => {
          const timestamp = new Date(log.timestamp).getTime();
          if (timestamp > latestTimestamp) {
            latestTimestamp = timestamp;
          }
        });
      }
    });
    
    // Format the latest timestamp
    if (latestTimestamp === 0) {
      return 'N/A';
    }
    
    return format(new Date(latestTimestamp), 'h:mm a');
  }, [dogsStatus]);
  
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Dog</TableHead>
            {timeSlots.map((slot) => (
              <TableHead key={slot} className="w-[80px] text-center">
                {slot}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoryData && categoryData.length > 0 ? (
            categoryData.map((dog) => (
              <TableRow key={dog.dog_id}>
                <TableCell className="font-medium">{dog.dog_name}</TableCell>
                {timeSlots.map((slot) => (
                  <TableCell key={`${dog.dog_id}-${slot}`} className="text-center">
                    <ContextMenu>
                      <ContextMenuTrigger>
                        {getStatusIcon(dog, slot)}
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem onClick={() => handleLogCare(dog.dog_id, slot, activeCategory)}>
                          Log {activeCategory === 'pottybreaks' ? 'Potty Break' : 'Feeding'} at {slot}
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <EmptyTableRow onRefresh={() => {
              if (onRefresh) onRefresh();
            }} />
          )}
        </TableBody>
      </Table>
      <TimeTableFooter 
        lastUpdateTime={lastUpdateTime}
        currentDate={currentDate}
      />
    </div>
  );
};

export default DogTimeTable;
