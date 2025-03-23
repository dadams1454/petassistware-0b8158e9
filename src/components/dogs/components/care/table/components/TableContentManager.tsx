
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import ActiveTabContent from './ActiveTabContent';
import useTimeManager from './TimeManager';
import NoDogsState from './NoDogsState';
import TableLoadingOverlay from './TableLoadingOverlay';
import { Observation } from '../hooks/useObservations';

interface TableContentManagerProps {
  activeCategory: string;
  dogsStatus: DogCareStatus[];
  sortedDogs: DogCareStatus[];
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, timeSlot: string) => boolean;
  hasObservation: (dogId: string, timeSlot: string) => boolean;
  getObservationDetails: (dogId: string) => Observation | null;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, hasPottyBreak: boolean, hasCareLogged: boolean) => void;
  onCellContextMenu: (e: React.MouseEvent, dogId: string, dogName: string, timeSlot: string) => void;
  onCareLogClick: (dogId: string, dogName: string) => void;
  onDogClick: (dogId: string) => void;
  onObservationClick: (dogId: string) => void;
  onRefresh: () => void;
  onCategoryChange?: (category: string) => void;
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
  onCategoryChange,
  showLoading
}) => {
  // Use the time manager hook to get time slots and current hour
  const { timeSlots, currentHour } = useTimeManager(activeCategory);

  // Create adapter functions for compatibility
  const adaptedHasPottyBreak = (dogId: string, timeSlot: string) => {
    return hasPottyBreak(dogId, timeSlot);
  };
  
  const adaptedHasCareLogged = (dogId: string, timeSlot: string) => {
    return hasCareLogged(dogId, timeSlot);
  };
  
  const adaptedOnCellClick = (dogId: string, dogName: string, timeSlot: string, hasPottyBreakValue: boolean, hasCareLoggedValue: boolean) => {
    onCellClick(dogId, dogName, timeSlot, hasPottyBreakValue, hasCareLoggedValue);
  };

  return (
    <div className="relative table-refresh-transition" onClick={(e) => e.stopPropagation()}>
      {/* Loading Overlay */}
      <TableLoadingOverlay isLoading={showLoading} />
      
      {dogsStatus.length > 0 ? (
        <ActiveTabContent
          activeCategory={activeCategory}
          sortedDogs={sortedDogs}
          timeSlots={timeSlots}
          hasPottyBreak={adaptedHasPottyBreak}
          hasCareLogged={adaptedHasCareLogged}
          hasObservation={hasObservation}
          getObservationDetails={getObservationDetails}
          onCellClick={adaptedOnCellClick}
          onCellContextMenu={onCellContextMenu}
          onCareLogClick={onCareLogClick}
          onDogClick={onDogClick}
          onObservationClick={onObservationClick}
          onRefresh={onRefresh}
          onCategoryChange={onCategoryChange}
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
