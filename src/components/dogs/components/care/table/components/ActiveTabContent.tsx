
import React from 'react';
import { TableHeader, TableRow, TableHead, TableBody, TableFooter, Table } from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import DogTimeRow from '../DogTimeRow';

interface ActiveTabContentProps {
  activeCategory: string;
  sortedDogs: DogCareStatus[];
  timeSlots: string[];
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, timeSlot: string, category: string) => boolean;
  hasObservation: (dogId: string, timeSlot: string) => boolean;
  getObservationDetails: (dogId: string) => { text: string; type: string; timeSlot?: string; category?: string } | null;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCellContextMenu: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCareLogClick: (dogId: string, dogName: string) => void;
  onDogClick: (dogId: string) => void;
  onRefresh: () => void;
  currentHour?: number;
  isMobile: boolean;
  isCellActive?: (dogId: string, timeSlot: string, category: string) => boolean;
}

const ActiveTabContent: React.FC<ActiveTabContentProps> = ({
  activeCategory,
  sortedDogs,
  timeSlots,
  hasPottyBreak,
  hasCareLogged,
  hasObservation,
  getObservationDetails,
  onCellClick,
  onCellContextMenu,
  onCareLogClick,
  onDogClick,
  currentHour,
  isMobile,
  isCellActive = () => false
}) => {
  // Helper function to get row color for alternating rows
  const getRowColor = (index: number) => {
    return index % 2 === 0
      ? 'bg-white dark:bg-gray-950'
      : 'bg-gray-50 dark:bg-gray-900/50';
  };

  return (
    <div className="relative overflow-x-auto">
      <Table className="w-full">
        <TableHeader className="sticky top-0 bg-white dark:bg-gray-950 z-10">
          <TableRow>
            <TableHead className="w-[15%] md:w-[20%] bg-white dark:bg-gray-950 sticky left-0 z-20 border-r border-gray-200 dark:border-gray-800">
              Dog
            </TableHead>
            <TableHead className="w-[20%] min-w-[200px] bg-white dark:bg-gray-950 sticky left-[15%] md:left-[20%] z-20 border-r border-gray-200 dark:border-gray-800">
              {activeCategory === 'feeding' ? 'Feeding Issues' : 'Observations'}
            </TableHead>
            {timeSlots.map((slot) => (
              <TableHead key={slot} className="text-center px-2 py-1 text-xs">
                {slot}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDogs.map((dog, index) => (
            <DogTimeRow
              key={dog.dog_id}
              dog={dog}
              timeSlots={timeSlots}
              rowColor={getRowColor(index)}
              activeCategory={activeCategory}
              hasPottyBreak={hasPottyBreak}
              hasCareLogged={hasCareLogged}
              hasObservation={hasObservation}
              getObservationDetails={getObservationDetails}
              onCellClick={onCellClick}
              onCellContextMenu={onCellContextMenu}
              onCareLogClick={onCareLogClick}
              onDogClick={onDogClick}
              currentHour={currentHour}
              isMobile={isMobile}
              isCellActive={isCellActive}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActiveTabContent;
