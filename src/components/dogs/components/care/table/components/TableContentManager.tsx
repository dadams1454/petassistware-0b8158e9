
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

  return (
    <TableContainer>
      {/* Top section with category tabs */}
      <TimeTableHeader 
        activeCategory={activeCategory} 
        onCategoryChange={onCategoryChange}
        hideTopLevelTabs={hideTopLevelTabs}
      />
      
      {/* Main table content */}
      <TimeTableContent
        activeCategory={activeCategory}
        sortedDogs={sortedDogs}
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
      
      {/* Loading overlay */}
      {showLoading && <TableLoadingOverlay />}
    </TableContainer>
  );
};

export default TableContentManager;
