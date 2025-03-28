
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
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, timeSlot: string, category: string) => boolean;
  hasObservation: (dogId: string, timeSlot: string) => boolean;
  getObservationDetails: (dogId: string) => any;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCellContextMenu: (event: React.MouseEvent, dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCareLogClick: (dogId: string, dogName: string) => void;
  onDogClick: (dogId: string) => void;
  onObservationClick: (dogId: string, dogName: string) => void;
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
  hideTopLevelTabs = false,
  timeSlots = []
}) => {
  // Show no dogs state if the array is empty
  if (!dogsStatus || dogsStatus.length === 0) {
    return <NoDogsState onRefresh={onRefresh} />;
  }

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
        />
      </TableContainer>
      
      {/* Loading overlay */}
      {showLoading && <TableLoadingOverlay isLoading={true} />}
    </div>
  );
};

export default TableContentManager;
