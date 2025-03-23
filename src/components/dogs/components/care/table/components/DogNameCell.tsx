
import React, { useEffect, useState } from 'react';
import { TableCell } from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import { fetchDogGroups } from '@/services/dailyCare/dogGroupsService';
import { 
  DogAvatar, 
  DogNameDisplay, 
  DogGroupBadges, 
  DogObservationNote, 
  LogCareAction 
} from './dog-name';

interface DogNameCellProps {
  dog: DogCareStatus;
  onCareLogClick: (e: React.MouseEvent) => void;
  onDogClick: (e: React.MouseEvent) => void;
  activeCategory: string;
  hasObservation?: boolean;
  observationText?: string;
  observationType?: string;
}

const DogNameCell: React.FC<DogNameCellProps> = ({ 
  dog, 
  onCareLogClick, 
  onDogClick,
  activeCategory,
  hasObservation = false,
  observationText = '',
  observationType = ''
}) => {
  // Get gender-based background color using pastel colors
  const genderBackgroundColor = dog.sex === 'male' 
    ? 'bg-blue-50 dark:bg-blue-950/30' 
    : 'bg-pink-50 dark:bg-pink-950/30';
  
  const [dogGroups, setDogGroups] = useState<{id: string; name: string; color: string | null}[]>([]);
  
  // Fetch dog groups for this dog
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groups = await fetchDogGroups();
        
        // In a real implementation, you would filter by dog ID
        // This is a placeholder until you implement the actual API
        const randomInclude = Math.random() > 0.5;
        if (randomInclude) {
          const randomIndex = Math.floor(Math.random() * groups.length);
          if (groups[randomIndex]) {
            setDogGroups([groups[randomIndex]]);
          }
        }
      } catch (error) {
        console.error('Error fetching dog groups:', error);
      }
    };
    
    fetchGroups();
  }, [dog.dog_id]);
  
  // Handle the log care click with proper event handling
  const handleLogCareClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop propagation to prevent other handlers from firing
    e.preventDefault(); // Prevent default behavior
    console.log(`Log care button clicked for ${dog.dog_name}`);
    onCareLogClick(e);
  };
  
  // Handle the dog name/image click with proper event handling
  const handleDogNameClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop propagation to prevent other handlers from firing
    console.log(`Dog name clicked for ${dog.dog_name}`);
    onDogClick(e);
  };
  
  return (
    <TableCell 
      className={`whitespace-nowrap sticky left-0 z-10 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 ${genderBackgroundColor}`}
    >
      <div className="flex items-center gap-3 max-w-[160px]">
        {/* Dog Avatar with Status Indicators */}
        <DogAvatar dog={dog} onClick={handleDogNameClick} />
        
        <div className="overflow-hidden flex flex-col">
          {/* Dog Name Display */}
          <DogNameDisplay dogName={dog.dog_name} onClick={handleDogNameClick} />
          
          {/* Dog Group Badges */}
          <DogGroupBadges dogGroups={dogGroups} />
          
          {/* Log Care Action Button */}
          <LogCareAction 
            dogId={dog.dog_id} 
            dogName={dog.dog_name} 
            activeCategory={activeCategory} 
            onLogCareClick={handleLogCareClick} 
          />
          
          {/* Observation Note */}
          <DogObservationNote 
            hasObservation={hasObservation} 
            observationText={observationText} 
            observationType={observationType} 
          />
        </div>
      </div>
    </TableCell>
  );
};

export default DogNameCell;
