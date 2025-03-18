
import React, { useState } from 'react';
import { TableCell } from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import { useNavigate } from 'react-router-dom';
import ObservationDialog from './ObservationDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import DogAvatar from './dogNameCell/DogAvatar';
import DogConditionIndicators from './dogNameCell/DogConditionIndicators';
import ObservationPreview from './dogNameCell/ObservationPreview';

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
  
  // Handle navigation to dog detail page
  const handleNavigateToDog = () => {
    navigate(`/dogs/${dog.dog_id}`);
  };
  
  // Handle opening the observation dialog
  const handleOpenObservationDialog = () => {
    if (onAddObservation) {
      setObservationDialogOpen(true);
    }
  };
  
  return (
    <TableCell className="font-medium sticky left-0 z-10 border-r border-slate-200 bg-white dark:bg-slate-900">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          {/* Dog Avatar Component */}
          <DogAvatar
            photoUrl={dog.dog_photo}
            dogName={dog.dog_name}
            isFemale={isFemale}
            onClick={handleNavigateToDog}
          />
          
          <div className="flex flex-col">
            <div className="flex items-center">
              <span 
                onClick={handleNavigateToDog}
                className={`text-sm font-medium ${isFemale ? 'text-pink-500 dark:text-pink-400' : 'text-blue-500 dark:text-blue-400'} cursor-pointer hover:underline`}
              >
                {dog.dog_name}
              </span>
              
              {/* Dog Condition Indicators Component */}
              <DogConditionIndicators flags={dog.flags || []} />
            </div>
            
            <span className="text-xs text-gray-500">
              {dog.breed} {dog.color ? `• ${dog.color}` : ''}
            </span>
          </div>
        </div>
        
        {/* Observation Preview Component */}
        <ObservationPreview
          hasObservation={hasObservation}
          onOpenDialog={handleOpenObservationDialog}
          existingObservations={existingObservations}
        />
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
