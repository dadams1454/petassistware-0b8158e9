
import React, { useEffect } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
import TimeSlotHeaders from '../TimeSlotHeaders';
import DogTimeRow from '../DogTimeRow';
import EmptyTableRow from '../EmptyTableRow';
import { timeSlots, getDogRowColor } from '../dogGroupColors';
import { CareCategory } from './types';

interface TableContainerProps {
  dogs: DogCareStatus[];
  activeCategory: string;
  timeSlots: string[];
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, timeSlot: string, category: string) => boolean;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onRefresh?: () => void;
  careCategories: CareCategory[];
}

const TableContainer: React.FC<TableContainerProps> = ({
  dogs,
  activeCategory,
  timeSlots,
  hasPottyBreak,
  hasCareLogged,
  onCellClick,
  onRefresh,
  careCategories
}) => {
  // Always show the currently selected category table
  const selectedCategory = careCategories.find(cat => cat.id === activeCategory) || careCategories[0];
  
  useEffect(() => {
    console.log(`TableContainer rendering for category: ${activeCategory} with ${dogs.length} dogs`);
  }, [activeCategory, dogs.length]);

  return (
    <div className="mb-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="p-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center">
          <div className="text-indigo-600 dark:text-indigo-400">
            {selectedCategory.icon}
          </div>
          <h3 className="text-md font-medium ml-2 text-slate-800 dark:text-slate-200">
            {/* Don't display label for potty breaks */}
            {selectedCategory.id === 'pottybreaks' ? 'Dog Care Schedule' : selectedCategory.name + ' Schedule'}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {selectedCategory.id === 'all' 
            ? 'Showing all care activities' 
            : selectedCategory.id === 'pottybreaks'
              ? 'Click on a time slot to mark or unmark a potty break'
              : `Showing schedule for ${selectedCategory.name}`}
        </p>
      </div>
      
      {dogs.length > 0 ? (
        <div className="overflow-x-auto bg-white dark:bg-slate-900">
          <div className="min-w-max">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100 dark:bg-slate-800/50">
                  <TimeSlotHeaders timeSlots={timeSlots} />
                </TableRow>
              </TableHeader>
              <TableBody>
                {dogs.map((dog, index) => (
                  <DogTimeRow
                    key={`${dog.dog_id}-${activeCategory}-row`}
                    dog={dog}
                    timeSlots={timeSlots}
                    rowColor={getDogRowColor(index)}
                    activeCategory={activeCategory}
                    hasPottyBreak={hasPottyBreak}
                    hasCareLogged={hasCareLogged}
                    onCellClick={onCellClick}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <EmptyTableRow onRefresh={onRefresh} />
      )}
    </div>
  );
};

export default TableContainer;
