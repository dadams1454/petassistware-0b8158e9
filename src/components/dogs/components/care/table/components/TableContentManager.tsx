
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import TimeTableContent from './TimeTableContent';
import TimeTableHeader from '../components/TimeTableHeader';
import NoDogsState from './NoDogsState';
import TableContainer from './TableContainer';
import TableLoadingOverlay from './TableLoadingOverlay';

interface TableContentManagerProps {
  activeCategory: string;
  dogsStatus: DogCareStatus[];
  sortedDogs: DogCareStatus[];
  hasCareLogged: (dogId: string, hour: number) => boolean;
  hasObservation: (dogId: string, hour: number) => boolean;
  getObservationDetails: (dogId: string, hour: number) => any;
  onCellClick: (dogId: string, hour: number) => void;
  onCellContextMenu: (event: React.MouseEvent, dogId: string, hour: number) => void;
  onCareLogClick: (dogId: string) => void;
  onDogClick: (dogId: string) => void;
  onObservationClick: (dogId: string, hour: number) => void;
  onRefresh: () => void;
  onCategoryChange: (category: string) => void;
  showLoading: boolean;
  hideTopLevelTabs?: boolean;
  timeSlots?: string[];
}

const TableContentManager: React.FC<TableContentManagerProps> = ({
  activeCategory,
  dogsStatus,
  sortedDogs,
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
  showLoading,
  hideTopLevelTabs = false,
  timeSlots = []
}) => {
  // Show no dogs state if the array is empty
  if (!dogsStatus || dogsStatus.length === 0) {
    return <NoDogsState onRefresh={onRefresh} />;
  }

  // Create wrapper functions to adapt to the TimeTableContent interface which uses strings
  const hasCareLoggedWrapper = (dogId: string, timeSlot: string, category: string): boolean => {
    const hourIndex = timeSlots.indexOf(timeSlot);
    const hour = hourIndex >= 0 ? hourIndex : 0;
    return hasCareLogged(dogId, hour);
  };

  const hasObservationWrapper = (dogId: string, timeSlot: string): boolean => {
    const hourIndex = timeSlots.indexOf(timeSlot);
    const hour = hourIndex >= 0 ? hourIndex : 0;
    return hasObservation(dogId, hour);
  };

  const getObservationDetailsWrapper = (dogId: string): any => {
    return getObservationDetails(dogId, 0);
  };

  const onCellClickWrapper = (dogId: string, dogName: string, timeSlot: string, category: string): void => {
    const hourIndex = timeSlots.indexOf(timeSlot);
    const hour = hourIndex >= 0 ? hourIndex : 0;
    onCellClick(dogId, hour);
  };

  const onCellContextMenuWrapper = (e: React.MouseEvent, dogId: string, dogName: string, timeSlot: string, category: string): void => {
    const hourIndex = timeSlots.indexOf(timeSlot);
    const hour = hourIndex >= 0 ? hourIndex : 0;
    onCellContextMenu(e, dogId, hour);
  };

  const onCareLogClickWrapper = (dogId: string, dogName: string): void => {
    onCareLogClick(dogId);
  };

  const onObservationClickWrapper = (dogId: string, dogName: string): void => {
    onObservationClick(dogId, 0);
  };

  return (
    <div className="relative">
      {/* Top section with category tabs */}
      <TimeTableHeader 
        activeCategory={activeCategory} 
        onCategoryChange={onCategoryChange}
        hideTopLevelTabs={hideTopLevelTabs}
      />
      
      {/* Container with required props */}
      <TableContainer 
        activeCategory={activeCategory} 
        dogsCount={dogsStatus.length} 
        onRefresh={onRefresh}
      >
        {/* Main table content */}
        <TimeTableContent
          sortedDogs={sortedDogs}
          timeSlots={timeSlots}
          activeCategory={activeCategory}
          hasCareLogged={hasCareLoggedWrapper}
          hasObservation={hasObservationWrapper}
          getObservationDetails={getObservationDetailsWrapper}
          onCellClick={onCellClickWrapper}
          onCellContextMenu={onCellContextMenuWrapper}
          onCareLogClick={onCareLogClickWrapper}
          onDogClick={onDogClick}
          onObservationClick={onObservationClickWrapper}
        />
      </TableContainer>
      
      {/* Loading overlay */}
      {showLoading && <TableLoadingOverlay isLoading={true} />}
    </div>
  );
};

export default TableContentManager;
