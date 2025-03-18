
import React from 'react';
import { MessageCircle, AlertTriangle, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ObservationPreviewProps {
  hasObservation: boolean;
  onOpenDialog: () => void;
  existingObservations: Array<{
    observation: string;
    observation_type: 'accident' | 'heat' | 'behavior' | 'other';
    created_at: string;
  }>;
}

const ObservationPreview: React.FC<ObservationPreviewProps> = ({ 
  hasObservation, 
  onOpenDialog, 
  existingObservations 
}) => {
  // Get the most recent observation for preview
  const latestObservation = existingObservations.length > 0 
    ? existingObservations[0] 
    : null;
  
  // Determine observation count text
  const observationCountText = existingObservations.length > 1 
    ? `+${existingObservations.length - 1} more` 
    : '';
  
  // Get observation type icon
  const getObservationTypeIcon = (type: 'accident' | 'heat' | 'behavior' | 'other') => {
    switch (type) {
      case 'accident':
        return <AlertTriangle className="h-3 w-3 text-amber-500" />;
      case 'heat':
        return <Heart className="h-3 w-3 text-red-500" />;
      case 'behavior':
        return <Eye className="h-3 w-3 text-blue-500" />;
      default:
        return <MessageCircle className="h-3 w-3 text-gray-500" />;
    }
  };
  
  // Truncate observation text for preview
  const truncateText = (text: string, maxLength: number = 30) => {
    if (!text) return '';
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };
  
  return (
    <div className="mt-1">
      {hasObservation && latestObservation ? (
        <div 
          className="text-xs rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-1 flex flex-col" 
          onClick={onOpenDialog}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {getObservationTypeIcon(latestObservation.observation_type)}
              <span className="font-medium capitalize text-[10px]">
                {latestObservation.observation_type}
              </span>
            </div>
            {existingObservations.length > 1 && (
              <Badge variant="secondary" className="text-[10px] py-0 px-1 h-4">
                {observationCountText}
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
            {truncateText(latestObservation.observation)}
          </p>
        </div>
      ) : (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onOpenDialog} 
          className="w-full mt-1 text-xs px-2 py-0.5 h-6 justify-start"
        >
          <MessageCircle className="h-3 w-3 mr-1" />
          {hasObservation ? "View Observations" : "Add Observation"}
        </Button>
      )}
    </div>
  );
};

export default ObservationPreview;
