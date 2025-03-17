
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
import TimeSlotHeaders from '../TimeSlotHeaders';
import DogTimeRow from '../DogTimeRow';
import EmptyTableRow from '../EmptyTableRow';
import { getDogRowColor } from '../dogGroupColors';

interface TableContainerProps {
  dogs: DogCareStatus[];
  activeCategory: string;
  timeSlots: string[];
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, timeSlot: string, category: string) => boolean;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onRefresh?: () => void;
}

const TableContainer: React.FC<TableContainerProps> = ({
  dogs,
  activeCategory,
  timeSlots,
  hasPottyBreak,
  hasCareLogged,
  onCellClick,
  onRefresh
}) => {
  return (
    <div className="mb-4 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="overflow-x-auto bg-white dark:bg-slate-900">
        <div className="min-w-max">
          {dogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 dark:bg-slate-800/50">
                  <TimeSlotHeaders timeSlots={timeSlots} />
                </TableRow>
              </TableHeader>
              <TableBody>
                {dogs.map((dog, index) => (
                  <DogTimeRow
                    key={`${dog.dog_id}-row`}
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
          ) : (
            <EmptyTableRow onRefresh={onRefresh} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TableContainer;
