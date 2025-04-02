
import React, { memo } from 'react';
import { TableCell } from '@/components/ui/table';
import { AlertTriangle, Heart, Activity, MessageCircle, PencilLine } from 'lucide-react';

interface ObservationDetails {
  text: string;
  type: string;
  timeSlot?: string;
  category?: string;
}

interface ObservationCellProps {
  dogId: string;
  dogName: string;
  dogHasObservation: boolean;
  observationDetails: ObservationDetails | null;
  activeCategory: string;
  onClick: () => void;
}

// Memoize the component to prevent unnecessary re-renders
const ObservationCell: React.FC<ObservationCellProps> = memo(({
  dogId,
  dogName,
  dogHasObservation,
  observationDetails,
  activeCategory,
  onClick
}) => {
  // Function to get observation icon based on type
  const getObservationIcon = (type: string) => {
    switch (type) {
      case 'accident':
        return <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />;
      case 'heat':
        return <Heart className="h-4 w-4 text-red-500 flex-shrink-0" />;
      case 'behavior':
        return <Activity className="h-4 w-4 text-blue-500 flex-shrink-0" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500 flex-shrink-0" />;
    }
  };

  // Render empty cell if no observation
  if (!dogHasObservation) {
    return (
      <TableCell onClick={onClick} className="cursor-pointer hover:bg-muted/50 text-center">
        <div className="flex justify-center items-center h-full w-full opacity-30 hover:opacity-60">
          <PencilLine className="h-3.5 w-3.5" />
        </div>
      </TableCell>
    );
  }

  // Render observation cell with details
  return (
    <TableCell 
      onClick={onClick} 
      className="cursor-pointer hover:bg-primary/5 p-0"
    >
      <div className="py-2 px-2 text-xs">
        <div className="flex items-start gap-1.5">
          {observationDetails && getObservationIcon(observationDetails.type)}
          <div className="line-clamp-2 text-left">
            {observationDetails?.text || `Click to add observation for ${dogName}`}
          </div>
        </div>
      </div>
    </TableCell>
  );
});

export default ObservationCell;
