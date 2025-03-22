
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { AlertTriangle, Heart, Activity, MessageCircle } from 'lucide-react';

interface ObservationDetails {
  text: string;
  type: string;
  timeSlot?: string;
  category?: string;
}

interface ObservationCellProps {
  dogHasObservation: boolean;
  observationDetails: ObservationDetails | null;
  activeCategory: string;
}

const ObservationCell: React.FC<ObservationCellProps> = ({
  dogHasObservation,
  observationDetails,
  activeCategory
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
      case 'feeding':
        return <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500 flex-shrink-0" />;
    }
  };

  return (
    <TableCell className="p-2 border-r border-slate-200 dark:border-slate-700 max-w-[220px] cell-status-transition">
      {dogHasObservation && observationDetails ? (
        <div className="flex items-start gap-2">
          {getObservationIcon(observationDetails.type)}
          <div className="overflow-hidden">
            <div className="text-xs font-medium capitalize text-gray-700 dark:text-gray-300">
              {observationDetails.type}
            </div>
            <div className="text-xs line-clamp-3 text-gray-600 dark:text-gray-400">
              {observationDetails.text}
            </div>
          </div>
        </div>
      ) : (
        <span className="text-xs text-gray-400 dark:text-gray-600">
          {activeCategory === 'feeding' ? 'No feeding issues' : 'No observations'}
        </span>
      )}
    </TableCell>
  );
};

export default ObservationCell;
