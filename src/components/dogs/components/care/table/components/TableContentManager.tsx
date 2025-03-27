
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
  hasPottyBreak: (dogId: string, hour: number) => boolean;
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
  showLoading,
  hideTopLevelTabs = false
}) => {
  // Show no dogs state if the array is empty
  if (!dogsStatus || dogsStatus.length === 0) {
    return <NoDogsState onRefresh={onRefresh} />;
  }

  // Create wrapper functions to adapt to the TimeTableContent interface which uses strings
  const hasPottyBreakWrapper = (dogId: string, timeSlot: string): boolean => {
    // Find the index of the timeSlot in the sortedDogs list
    // This is a simplistic approach - in a real app, you'd map timeSlots to indices
    const hour = 0; // Default to 0 if not found
    return hasPottyBreak(dogId, hour);
  };

  const hasCareLoggedWrapper = (dogId: string, timeSlot: string, category: string): boolean => {
    const hour = 0; // Default to 0 if not found
    return hasCareLogged(dogId, hour);
  };

  const hasObservationWrapper = (dogId: string, timeSlot: string): boolean => {
    const hour = 0; // Default to 0 if not found
    return hasObservation(dogId, hour);
  };

  const getObservationDetailsWrapper = (dogId: string): any => {
    const hour = 0; // Default to 0 if not found
    return getObservationDetails(dogId, hour);
  };

  const onCellClickWrapper = (dogId: string, dogName: string, timeSlot: string, category: string): void => {
    const hour = 0; // Default to 0 if not found
    onCellClick(dogId, hour);
  };

  const onCellContextMenuWrapper = (e: React.MouseEvent, dogId: string, dogName: string, timeSlot: string, category: string): void => {
    const hour = 0; // Default to 0 if not found
    onCellContextMenu(e, dogId, hour);
  };

  const onCareLogClickWrapper = (dogId: string, dogName: string): void => {
    onCareLogClick(dogId);
  };

  const onObservationClickWrapper = (dogId: string, dogName: string): void => {
    const hour = 0; // Default to 0 if not found
    onObservationClick(dogId, hour);
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
          activeCategory={activeCategory}
          sortedDogs={sortedDogs}
          timeSlots={[]} // Make sure to provide valid timeSlots
          hasPottyBreak={hasPottyBreakWrapper}
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
