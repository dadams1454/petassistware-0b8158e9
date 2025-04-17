import React from 'react';
import { DogCareStatus, DogFlag } from '@/types/dailyCare';
import DogAvatar from '@/components/common/avatars/DogAvatar';
import { CareLog } from '@/types/dailyCare';

export interface DogNameCellProps {
  dog: DogCareStatus;
  onClick?: (dog: DogCareStatus) => void;
  onCareLog?: (dog: DogCareStatus) => void;
  onObservationClick?: (dog: DogCareStatus) => void;
  showLastObservation?: boolean;
}

const DogNameCell: React.FC<DogNameCellProps> = ({
  dog,
  onClick,
  onCareLog,
  onObservationClick,
  showLastObservation = true,
}) => {
  const handleDogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(dog);
  };

  const handleCareLogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCareLog?.(dog);
  };

  const handleObservation = (e: React.MouseEvent) => {
    e.stopPropagation();
    onObservationClick?.(dog);
  };
  
  return (
    <div className="flex items-center space-x-2 min-w-[200px]">
      <DogAvatar
        name={dog.name || dog.dog_name || 'Unknown'}
        photoUrl={dog.photo_url || dog.dog_photo}
        flags={dog.flags || []}
        onClick={handleDogClick}
        dogId={dog.dog_id}
        size="md"
      />
      
      <div>
        <div className="font-medium">{dog.name || dog.dog_name || 'Unknown'}</div>
        <div className="text-sm text-gray-500">{dog.breed}</div>
        {showLastObservation && dog.last_care && (
          <div className="text-xs text-gray-400">
            Last {dog.last_care.category}: {dog.last_care.task_name} -{' '}
            {new Date(dog.last_care.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DogNameCell;
