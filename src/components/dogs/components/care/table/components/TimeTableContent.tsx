
import React, { useMemo } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getRowColor } from '../utils/tableUtils';
import DogTimeRow from '../DogTimeRow';

interface TimeTableContentProps {
  sortedDogs: DogCareStatus[];
  timeSlots: string[];
  activeCategory?: string;
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, timeSlot: string, category: string) => boolean;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCareLogClick: (dogId: string, dogName: string) => void;
  currentHour?: number;
  isMobile?: boolean;
}

const TimeTableContent: React.FC<TimeTableContentProps> = ({ 
  sortedDogs, 
  timeSlots, 
  activeCategory = 'pottybreaks',
  hasPottyBreak, 
  hasCareLogged,
  onCellClick,
  onCareLogClick,
  currentHour,
  isMobile = false
}) => {
  // Create a stable copy of dog data to prevent reference issues
  const preparedDogs = useMemo(() => {
    return sortedDogs.map(dog => ({
      ...dog,
      flags: dog.flags ? [...dog.flags].map(flag => ({...flag})) : []
    }));
  }, [sortedDogs]);
  
  const categoryTitle = {
    'pottybreaks': 'Potty Breaks',
    'feeding': 'Feeding',
    'medications': 'Medications',
    'exercise': 'Exercise'
  }[activeCategory] || activeCategory;

  // Determine if a time slot represents the current hour
  const isCurrentHour = (timeSlot: string) => {
    if (currentHour === undefined) return false;
    
    const hour = parseInt(timeSlot.split(':')[0]);
    const isPM = timeSlot.includes('PM');
    const is12Hour = hour === 12;
    
    // Convert slot to 24-hour format
    let slot24Hour = hour;
    if (isPM && !is12Hour) slot24Hour += 12;
    if (!isPM && is12Hour) slot24Hour = 0;
    
    return slot24Hour === currentHour;
  };

  return (
    <div className="relative overflow-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow sm:rounded-lg">
          <Table>
            <TableHeader className="bg-gray-100 dark:bg-slate-800/60">
              <TableRow>
                <th className="sticky left-0 z-10 bg-gray-100 dark:bg-slate-800/60 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[180px] border-b border-r border-gray-200 dark:border-gray-700">
                  Dog / {categoryTitle}
                </th>
                {timeSlots.map((slot) => (
                  <th 
                    key={slot} 
                    className={`px-3 py-3 text-center text-xs font-medium uppercase tracking-wider border-b border-r border-gray-200 dark:border-gray-700 ${
                      isCurrentHour(slot) 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                        : 'text-gray-500 dark:text-gray-300'
                    }`}
                  >
                    {slot}
                    {isCurrentHour(slot) && (
                      <div className="mt-1 h-1 w-full bg-blue-400 dark:bg-blue-600 rounded-full"></div>
                    )}
                  </th>
                ))}
              </TableRow>
            </TableHeader>
            
            <TableBody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
              {preparedDogs.length > 0 ? (
                preparedDogs.map((dog, index) => (
                  <DogTimeRow
                    key={`${dog.dog_id}-${activeCategory}-row`}
                    dog={dog}
                    timeSlots={timeSlots}
                    rowColor={getRowColor(index)}
                    activeCategory={activeCategory}
                    hasPottyBreak={hasPottyBreak}
                    hasCareLogged={hasCareLogged}
                    onCellClick={onCellClick}
                    onCareLogClick={onCareLogClick}
                    currentHour={currentHour}
                    isMobile={isMobile}
                  />
                ))
              ) : (
                <TableRow>
                  <td colSpan={timeSlots.length + 1} className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                    No dogs available
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TimeTableContent;
