
import React from 'react';
import CellContent from '../../components/CellContent';
import ObservationIcon from './ObservationIcon';

interface CellContentWrapperProps {
  dogName: string;
  timeSlot: string;
  category: string;
  hasPottyBreak: boolean;
  hasCareLogged: boolean;
  flags: any[];
  isCurrentHour: boolean;
  hasObservation: boolean;
  showObservationHelpers: boolean;
  isMobile: boolean;
  onObservationIconClick: (e: React.MouseEvent) => void;
}

const CellContentWrapper: React.FC<CellContentWrapperProps> = ({
  dogName,
  timeSlot,
  category,
  hasPottyBreak,
  hasCareLogged,
  flags,
  isCurrentHour,
  hasObservation,
  showObservationHelpers,
  isMobile,
  onObservationIconClick
}) => {
  return (
    <div className="w-full h-full p-1 flex items-center justify-center">
      <CellContent 
        dogName={dogName}
        timeSlot={timeSlot}
        category={category}
        hasPottyBreak={hasPottyBreak}
        hasCareLogged={hasCareLogged}
        flags={flags}
        isCurrentHour={isCurrentHour}
        hasObservation={hasObservation}
      />
      
      {/* Show observation icon if the cell has observation capabilities */}
      {showObservationHelpers && (
        <ObservationIcon
          hasObservation={hasObservation}
          onClick={onObservationIconClick}
          position={isMobile ? 'mobile' : 'desktop'}
        />
      )}
    </div>
  );
};

export default CellContentWrapper;
