
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
    <div className="mb-8">
      <div className="p-2 bg-background border-b border-muted">
        <div className="flex items-center">
          {selectedCategory.icon}
          <h3 className="text-md font-medium ml-2">
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
        <div className="overflow-x-auto">
          <div className="min-w-max">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
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
