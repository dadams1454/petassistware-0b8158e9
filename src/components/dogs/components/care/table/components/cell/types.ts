
import { DogFlag } from '@/types/dailyCare';

export interface TimeSlotCellProps {
  dogId: string;
  dogName: string;
  timeSlot: string;
  category: string;
  hasPottyBreak: boolean;
  hasCareLogged: boolean;
  onClick: () => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  flags?: DogFlag[];
  isCurrentHour?: boolean;
  isIncident?: boolean;
  isActive?: boolean;
}

export interface AnimatedCellContentProps {
  isActive: boolean;
  children: React.ReactNode;
}
