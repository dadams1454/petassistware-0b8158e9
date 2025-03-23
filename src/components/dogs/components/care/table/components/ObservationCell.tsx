
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, AlertCircle, Heart, Utensils, BadgeInfo } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  if (!dogHasObservation || !observationDetails) {
    return (
      <td className="px-4 py-2 text-sm">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground" 
          onClick={onObservationClick}
        >
          {activeCategory === 'feeding' ? 'Add feeding note' : 'Add observation'}
        </Button>
      </td>
    );
  }

  // Get the appropriate icon based on observation type
  const getObservationIcon = (type: string) => {
    switch (type) {
      case 'accident':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'heat':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'feeding':
        return <Utensils className="h-4 w-4 text-green-500" />;
      case 'behavior':
        return <AlertCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <BadgeInfo className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <td className="px-4 py-2 text-sm">
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center justify-start text-left font-normal w-full hover:bg-slate-100 dark:hover:bg-slate-800"
        onClick={onObservationClick}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 truncate">
                {getObservationIcon(observationDetails.type)}
                <span className="truncate">{observationDetails.text}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px]">
              <p className="font-semibold">{observationDetails.type.charAt(0).toUpperCase() + observationDetails.type.slice(1)}:</p>
              <p>{observationDetails.text}</p>
              {observationDetails.timeSlot && (
                <p className="text-xs text-muted-foreground mt-1">
                  Noted at: {observationDetails.timeSlot}
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Button>
    </td>
  );
};

export default ObservationCell;
