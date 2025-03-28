
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

  // Get the current hour
  const now = new Date();
  const currentHour = now.getHours();

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
          hasCareLogged={hasCareLogged}
          hasObservation={hasObservation}
          getObservationDetails={getObservationDetails}
          onCellClick={onCellClick}
          onCellContextMenu={onCellContextMenu}
          onCareLogClick={onCareLogClick}
          onDogClick={onDogClick}
          onObservationClick={onObservationClick}
          currentHour={currentHour}
        />
      </TableContainer>
      
      {/* Loading overlay */}
      {showLoading && <TableLoadingOverlay isLoading={true} />}
    </div>
  );
};

export default TableContentManager;
