
import React from 'react';
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
}

const TimeTableContent: React.FC<TimeTableContentProps> = ({ 
  sortedDogs, 
  timeSlots, 
  activeCategory = 'pottybreaks',
  hasPottyBreak, 
  hasCareLogged,
  onCellClick,
  onCareLogClick
}) => {
  const categoryTitle = {
    'pottybreaks': 'Potty Breaks',
    'feeding': 'Feeding',
    'medications': 'Medications',
    'exercise': 'Exercise'
  }[activeCategory] || activeCategory;

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
                  <th key={slot} className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-r border-gray-200 dark:border-gray-700">
                    {slot}
                  </th>
                ))}
              </TableRow>
            </TableHeader>
            
            <TableBody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedDogs.length > 0 ? (
                sortedDogs.map((dog, index) => (
                  <DogTimeRow
                    key={dog.dog_id}
                    dog={dog}
                    timeSlots={timeSlots}
                    rowColor={getRowColor(index)}
                    activeCategory={activeCategory}
                    hasPottyBreak={hasPottyBreak}
                    hasCareLogged={hasCareLogged}
                    onCellClick={onCellClick}
                    onCareLogClick={onCareLogClick}
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
