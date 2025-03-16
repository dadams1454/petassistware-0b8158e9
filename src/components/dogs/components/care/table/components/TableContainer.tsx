
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent } from '@/components/ui/tabs';
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
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onRefresh?: () => void;
  careCategories: CareCategory[];
}

const TableContainer: React.FC<TableContainerProps> = ({
  dogs,
  activeCategory,
  timeSlots,
  hasPottyBreak,
  onCellClick,
  onRefresh,
  careCategories
}) => {
  return (
    <Tabs defaultValue="all" value={activeCategory}>
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
                        key={dog.dog_id}
                        dog={dog}
                        timeSlots={timeSlots}
                        rowColor={getDogRowColor(index)}
                        activeCategory={category.id}
                        hasPottyBreak={hasPottyBreak}
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
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TableContainer;
