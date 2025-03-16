
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs } from '@/components/ui/tabs';
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
  // Filter to only show the active category and 'All' tables 
  // if the active category is not 'All'
  const categoriesToShow = activeCategory === 'all' 
    ? careCategories 
    : careCategories.filter(cat => cat.id === activeCategory || cat.id === 'all');

  return (
    <Tabs defaultValue="all" value={activeCategory}>
      {/* Display individual tables for each category */}
      {categoriesToShow.map(category => (
        <div key={category.id} className="mb-8">
          <div className="p-2 bg-background border-b border-muted">
            <div className="flex items-center">
              {category.icon}
              <h3 className="text-md font-medium ml-2">
                {category.name} Schedule
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {category.id === 'all' 
                ? 'Showing all care activities' 
                : `Showing schedule for ${category.name}`}
              
              {category.id === 'pottybreaks' ? (
                <span className="ml-2 text-sm text-blue-500">
                  Click on a time slot to mark or unmark a potty break
                </span>
              ) : (
                <span className="ml-2 text-sm text-blue-500">
                  Click on a time slot to log care
                </span>
              )}
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
                        key={`${dog.dog_id}-${category.id}`}
                        dog={dog}
                        timeSlots={timeSlots}
                        rowColor={getDogRowColor(index)}
                        activeCategory={category.id}
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
      ))}
    </Tabs>
  );
};

export default TableContainer;
