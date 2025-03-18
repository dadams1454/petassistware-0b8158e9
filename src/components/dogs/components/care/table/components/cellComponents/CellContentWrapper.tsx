
import React from 'react';
import { DogFlag } from '@/types/dailyCare';
import CellContent from '../../components/CellContent';
import ObservationIcon from './ObservationIcon';

interface CellContentWrapperProps {
  dogName: string;
  timeSlot: string;
  category: string;
  hasPottyBreak: boolean;
  hasCareLogged: boolean;
  flags?: DogFlag[];
  isCurrentHour?: boolean;
  hasObservation?: boolean;
  showObservationHelpers?: boolean;
  isMobile?: boolean;
  onObservationIconClick?: (e: React.MouseEvent) => void;
}

const CellContentWrapper: React.FC<CellContentWrapperProps> = ({
  dogName,
  timeSlot,
  category,
  hasPottyBreak,
  hasCareLogged,
  flags = [],
  isCurrentHour = false,
  hasObservation = false,
  showObservationHelpers = false,
  isMobile = false,
  onObservationIconClick = () => {}
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Main content (checkmark or indicator) */}
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
      
      {/* Observation icon (only if observation helpers should be shown) */}
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
