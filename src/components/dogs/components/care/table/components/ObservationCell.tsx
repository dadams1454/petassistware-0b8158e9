
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { AlertTriangle, PencilLine } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ObservationCellProps {
  dogHasObservation: boolean;
  observationDetails: {
    text?: string;
    type?: string;
    timeSlot?: string;
    category?: string;
  } | null;
  activeCategory: string;
  dogId: string;
  dogName: string;
  onObservationClick: () => void;
}

const ObservationCell: React.FC<ObservationCellProps> = ({
  dogHasObservation,
  observationDetails,
  activeCategory,
  dogId,
  dogName,
  onObservationClick
}) => {
  // Determine if we should show the observation based on category
  const shouldShowObservation = dogHasObservation && 
    observationDetails && 
    (!observationDetails.category || observationDetails.category === activeCategory);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onObservationClick();
  };
  
  // If observation exists for this dog and matches the active category
  if (shouldShowObservation) {
    // Get the observation text or use a default message
    const observationText = observationDetails?.text || 'No observation text';
    const observationType = observationDetails?.type || 'other';
    
    // Determine severity color based on observation type
    const typeColors = {
      'accident': 'text-red-500 dark:text-red-400',
      'heat': 'text-pink-500 dark:text-pink-400',
      'behavior': 'text-amber-500 dark:text-amber-400',
      'feeding': 'text-blue-500 dark:text-blue-400',
      'other': 'text-slate-500 dark:text-slate-400'
    };
    const colorClass = typeColors[observationType as keyof typeof typeColors] || typeColors.other;
    
    return (
      <TableCell className="max-w-[220px] p-2">
        <div className="flex items-start gap-2">
          <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${colorClass}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{observationType}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">{observationText}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 ml-1" 
            onClick={handleClick}
          >
            <PencilLine className="h-3.5 w-3.5" />
            <span className="sr-only">Edit observation</span>
          </Button>
        </div>
      </TableCell>
    );
  }
  
  // Empty state for dogs with no observations
  return (
    <TableCell className="p-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">No observations</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0" 
          onClick={handleClick}
        >
          <PencilLine className="h-3.5 w-3.5" />
          <span className="sr-only">Add observation</span>
        </Button>
      </div>
    </TableCell>
  );
};

export default ObservationCell;
