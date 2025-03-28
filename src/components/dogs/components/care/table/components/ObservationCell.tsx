
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { StickyNote, AlertTriangle } from 'lucide-react';

interface ObservationCellProps {
  dogId: string;
  dogName: string;
  dogHasObservation: boolean;
  observationDetails: { text: string; type: string } | null;
  onClick: () => void;
  activeCategory: string;
}

const ObservationCell: React.FC<ObservationCellProps> = ({
  dogId,
  dogName,
  dogHasObservation,
  observationDetails,
  onClick,
  activeCategory
}) => {
  // Determine what icon to show based on observation type
  const getIcon = () => {
    if (!dogHasObservation) return null;

    if (observationDetails?.type === 'accident' || observationDetails?.type === 'warning') {
      return (
        <AlertTriangle 
          className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-1.5" 
          aria-label="Warning or incident observation"
        />
      );
    }
    
    return (
      <StickyNote 
        className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-1.5" 
        aria-label="General observation"
      />
    );
  };

  // Get a short preview of the observation text
  const getObservationPreview = () => {
    if (!dogHasObservation || !observationDetails?.text) return null;
    
    const text = observationDetails.text;
    return text.length > 20 ? `${text.substring(0, 20)}...` : text;
  };

  return (
    <TableCell 
      onClick={onClick}
      className={`
        px-4 py-2 
        cursor-pointer
        text-sm text-muted-foreground
        ${dogHasObservation ? 'hover:bg-slate-100 dark:hover:bg-slate-800' : ''}
      `}
    >
      <div className="flex items-center">
        {getIcon()}
        {getObservationPreview() ? (
          <span className="text-xs truncate max-w-[120px]">
            {getObservationPreview()}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground italic">
            {dogHasObservation ? "Click to view" : "No notes"}
          </span>
        )}
      </div>
    </TableCell>
  );
};

export default ObservationCell;
