
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import ActiveTabContent from './ActiveTabContent';
import useTimeManager from './TimeManager';
import NoDogsState from './NoDogsState';
import TableLoadingOverlay from './TableLoadingOverlay';

interface TableContentManagerProps {
  activeCategory: string;
  dogsStatus: DogCareStatus[];
  sortedDogs: DogCareStatus[];
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, timeSlot: string, category: string) => boolean;
  hasObservation: (dogId: string, timeSlot: string) => boolean;
  getObservationDetails: (dogId: string) => { text: string; type: string } | null;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCellContextMenu: (e: React.MouseEvent, dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCareLogClick: (dogId: string, dogName: string) => void;
  onDogClick: (dogId: string) => void;
  onObservationClick: (dogId: string, dogName: string) => void;
  onRefresh: () => void;
  showLoading: boolean;
}

const TableContentManager: React.FC<TableContentManagerProps> = ({
  activeCategory,
  dogsStatus,
  sortedDogs,
  hasPottyBreak,
  hasCareLogged,
  hasObservation,
  getObservationDetails,
  onCellClick,
  onCellContextMenu,
  onCareLogClick,
  onDogClick,
  onObservationClick,
  onRefresh,
  showLoading
}) => {
  // Use the time manager hook to get time slots and current hour
  const { timeSlots, currentHour } = useTimeManager(activeCategory);

  return (
    <div className="relative table-refresh-transition" onClick={(e) => e.stopPropagation()}>
      {/* Loading Overlay */}
      <TableLoadingOverlay isLoading={showLoading} />
      
      {dogsStatus.length > 0 ? (
        <ActiveTabContent
          activeCategory={activeCategory}
          sortedDogs={sortedDogs}
          timeSlots={timeSlots}
          hasPottyBreak={hasPottyBreak}
          hasCareLogged={hasCareLogged}
          hasObservation={hasObservation}
          getObservationDetails={getObservationDetails}
          onCellClick={onCellClick}
          onCellContextMenu={onCellContextMenu}
          onCareLogClick={onCareLogClick}
          onDogClick={onDogClick}
          onObservationClick={onObservationClick}
          onRefresh={onRefresh}
          currentHour={currentHour}
          isMobile={false}
        />
      ) : (
        <NoDogsState onRefresh={onRefresh} isRefreshing={showLoading} />
      )}
    </div>
  );
};

export default TableContentManager;
