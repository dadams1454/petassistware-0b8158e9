
import React from 'react';
import AnimatedCell from '../../components/AnimatedCell';
import CellContent from '../../components/CellContent';

interface AnimatedCellContentProps {
  dogName: string;
  timeSlot: string;
  category: string;
  hasPottyBreak: boolean;
  hasCareLogged: boolean;
  isActive: boolean;
  isCurrentHour?: boolean;
  isIncident?: boolean;
}

/**
 * Combines AnimatedCell with CellContent for a reusable animated cell content
 */
export const AnimatedCellContent: React.FC<AnimatedCellContentProps> = ({
  dogName,
  timeSlot,
  category,
  hasPottyBreak,
  hasCareLogged,
  isActive,
  isCurrentHour = false,
  isIncident = false
}) => {
  return (
    <AnimatedCell isActive={isActive} className="p-1 flex items-center justify-center">
      <CellContent 
        dogName={dogName}
        timeSlot={timeSlot}
        category={category}
        hasPottyBreak={hasPottyBreak || isActive}
        hasCareLogged={hasCareLogged || isActive}
        isCurrentHour={isCurrentHour}
        isIncident={isIncident}
      />
    </AnimatedCell>
  );
};

export default AnimatedCellContent;
