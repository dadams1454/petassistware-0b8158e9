
import React, { useState } from 'react';
import { TableCell } from '@/components/ui/table';
import { AlertCircle, Dog, Heart, Flame, MessageCircle, Eye } from 'lucide-react';
import { DogCareStatus, DogFlag } from '@/types/dailyCare';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import ObservationDialog from './ObservationDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';

interface DogNameCellProps {
  dog: DogCareStatus;
  activeCategory: string;
  hasObservation?: boolean;
  onAddObservation?: (dogId: string, observation: string, observationType: 'accident' | 'heat' | 'behavior' | 'other') => Promise<void>;
  existingObservations?: Array<{
    observation: string;
    observation_type: 'accident' | 'heat' | 'behavior' | 'other';
    created_at: string;
  }>;
}

const DogNameCell: React.FC<DogNameCellProps> = ({ 
  dog, 
  activeCategory,
  hasObservation = false,
  onAddObservation,
  existingObservations = []
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [observationDialogOpen, setObservationDialogOpen] = useState(false);
  
  // Determine if dog is female based on gender field
  const isFemale = dog.sex?.toLowerCase() === 'female';
  
  const genderColor = isFemale ? 'text-pink-500 dark:text-pink-400' : 'text-blue-500 dark:text-blue-400';
  
  // Check for special conditions
  const isInHeat = dog.flags?.some(flag => flag.type === 'in_heat');
  const isPregnant = dog.flags?.some(flag => 
    flag.type === 'special_attention' && 
    flag.value?.toLowerCase().includes('pregnant')
  );
  const hasSpecialAttention = dog.flags?.some(flag => 
    flag.type === 'special_attention' && 
    !flag.value?.toLowerCase().includes('pregnant')
  );
  const hasIncompatibility = dog.flags?.some(flag => flag.type === 'incompatible');
  
  // Get special attention value for tooltip
  const specialAttentionValue = dog.flags?.find(flag => 
    flag.type === 'special_attention' && 
    !flag.value?.toLowerCase().includes('pregnant')
  )?.value || "Needs special attention";
  
  // Handle navigation to dog detail page
  const handleNavigateToDog = () => {
    navigate(`/dogs/${dog.dog_id}`);
  };
  
  // Get the most recent observation for preview
  const latestObservation = existingObservations.length > 0 
    ? existingObservations[0] 
    : null;
  
  // Determine observation count text
  const observationCountText = existingObservations.length > 1 
    ? `+${existingObservations.length - 1} more` 
    : '';
  
  // Truncate observation text for preview
  const truncateText = (text: string, maxLength: number = 30) => {
    if (!text) return '';
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };
  
  // Get observation type icon
  const getObservationTypeIcon = (type: 'accident' | 'heat' | 'behavior' | 'other') => {
    switch (type) {
      case 'accident':
        return <AlertCircle className="h-3 w-3 text-amber-500" />;
      case 'heat':
        return <Heart className="h-3 w-3 text-red-500" />;
      case 'behavior':
        return <Eye className="h-3 w-3 text-blue-500" />;
      default:
        return <MessageCircle className="h-3 w-3 text-gray-500" />;
    }
  };
  
  return (
    <TableCell className="font-medium sticky left-0 z-10 border-r border-slate-200 bg-white dark:bg-slate-900">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          {dog.dog_photo ? (
            <img 
              src={dog.dog_photo} 
              alt={dog.dog_name} 
              onClick={handleNavigateToDog}
              className={`w-8 h-8 rounded-full object-cover border-2 ${isFemale ? 'border-pink-300' : 'border-blue-300'} cursor-pointer hover:opacity-80 transition-opacity`}
            />
          ) : (
            <div 
              onClick={handleNavigateToDog}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${isFemale ? 'bg-pink-100' : 'bg-blue-100'} cursor-pointer hover:opacity-80 transition-opacity`}
            >
              <Dog className={`h-4 w-4 ${genderColor}`} />
            </div>
          )}
          <div className="flex flex-col">
            <div className="flex items-center">
              <span 
                onClick={handleNavigateToDog}
                className={`text-sm font-medium ${genderColor} cursor-pointer hover:underline`}
              >
                {dog.dog_name}
              </span>
              
              {/* Special condition indicators */}
              {isPregnant && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Heart className="h-4 w-4 ml-1 text-pink-500 fill-pink-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Pregnant</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {isInHeat && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Flame className="h-4 w-4 ml-1 text-red-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>In Heat</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {hasIncompatibility && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-1 text-amber-500">⚠️</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Incompatible with other dogs</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {hasSpecialAttention && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertCircle className="h-4 w-4 ml-1 text-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{specialAttentionValue}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {dog.breed} {dog.color ? `• ${dog.color}` : ''}
            </span>
          </div>
        </div>
        
        {/* Observation section that replaces the "+ Log Break" button */}
        <div className="mt-1">
          {hasObservation && latestObservation ? (
            <div 
              className="text-xs rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-1 flex flex-col" 
              onClick={() => setObservationDialogOpen(true)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {getObservationTypeIcon(latestObservation.observation_type)}
                  <span className="font-medium capitalize text-[10px]">{latestObservation.observation_type}</span>
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
              onClick={() => onAddObservation && setObservationDialogOpen(true)} 
              className="w-full mt-1 text-xs px-2 py-0.5 h-6 justify-start"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              {hasObservation ? "View Observations" : "Add Observation"}
            </Button>
          )}
        </div>
      </div>
      
      {/* Observation Dialog */}
      {onAddObservation && (
        <ObservationDialog
          open={observationDialogOpen}
          onOpenChange={setObservationDialogOpen}
          dogId={dog.dog_id}
          dogName={dog.dog_name}
          onSubmit={onAddObservation}
          existingObservations={existingObservations}
          isMobile={isMobile}
        />
      )}
    </TableCell>
  );
};

export default DogNameCell;
