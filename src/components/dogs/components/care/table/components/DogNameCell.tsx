
import React, { useEffect, useState } from 'react';
import { TableCell } from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import { MessageCircle, Paintbrush, Users } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import DogColorPicker from '@/components/personalization/DogColorPicker';
import { fetchDogGroups } from '@/services/dailyCare/dogGroupsService';
import { Badge } from '@/components/ui/badge';

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
        // This would ideally be a specific API call to get groups for a specific dog
        // For now, we'll simulate it by fetching all groups
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
  
  // Determine button text based on category
  const getButtonText = () => {
    if (activeCategory === 'pottybreaks') {
      return 'Note';
    }
    return activeCategory;
  };
  
  // Format the observation type for display
  const getObservationTypeLabel = () => {
    switch (observationType) {
      case 'accident':
        return 'Accident';
      case 'heat':
        return 'Heat cycle';
      case 'behavior':
        return 'Behavior';
      case 'other':
        return 'Note';
      default:
        return 'Observation';
    }
  };
  
  // Get group badge color
  const getGroupBadgeColor = (color: string | null) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'teal': return 'bg-teal-100 text-teal-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'red': return 'bg-red-100 text-red-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'purple': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
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
      className={`whitespace-nowrap sticky left-0 z-10 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 ${dog.sex === 'male' 
        ? 'bg-blue-50 dark:bg-blue-950/30' 
        : 'bg-pink-50 dark:bg-pink-950/30'}`}
    >
      <div className="flex items-center gap-3 max-w-[160px]">
        <div 
          className="flex-shrink-0 h-10 w-10 cursor-pointer relative" 
          onClick={handleDogNameClick}
          title={`View ${dog.dog_name}'s details`}
        >
          <img 
            src={dog.dog_photo || '/placeholder.svg'} 
            alt={dog.dog_name}
            className="h-full w-full rounded-full object-cover"
          />
          
          {/* Special conditions indicators */}
          {dog.flags && dog.flags.some(flag => flag.type === 'in_heat') && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-pink-500 rounded-full border-2 border-white dark:border-gray-900" 
                  title="In heat">
            </span>
          )}
          
          {dog.flags && dog.flags.some(flag => flag.type === 'pregnant') && (
            <span className="absolute -bottom-1 -right-1 h-4 w-4 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900"
                  title="Pregnant">
            </span>
          )}
        </div>
        
        <div className="overflow-hidden flex flex-col">
          <div 
            className="font-medium truncate max-w-[100px] cursor-pointer hover:text-blue-600 dark:hover:text-blue-400" 
            title={dog.dog_name}
            onClick={handleDogNameClick}
          >
            {dog.dog_name}
          </div>
          
          {/* Dog group badges */}
          {dogGroups.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1 mb-1">
              {dogGroups.map(group => (
                <Badge 
                  key={group.id} 
                  variant="outline" 
                  className={`text-xs py-0 px-1.5 ${getGroupBadgeColor(group.color)}`}
                >
                  <Users className="h-2.5 w-2.5 mr-0.5" />
                  {group.name}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-1 mt-1">
            <button
              onClick={handleLogCareClick}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[60px] z-20 relative"
              title={`Log ${activeCategory} for ${dog.dog_name}`}
            >
              Log {activeCategory === 'pottybreaks' 
                ? 'Note' 
                : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
            </button>
            
            <DogColorPicker 
              dogId={dog.dog_id}
              dogName={dog.dog_name}
              trigger={
                <button
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 ml-1"
                  title={`Customize ${dog.dog_name}'s appearance`}
                >
                  <Paintbrush className="h-3 w-3" />
                </button>
              }
            />
          </div>
          
          {/* Observation display - show text instead of icon */}
          {hasObservation && observationText && (
            <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 max-w-[140px]">
              <MessageCircle 
                size={12} 
                className="flex-shrink-0 text-amber-500 dark:text-amber-400 fill-amber-100 dark:fill-amber-900/30" 
                aria-label="Observation"
              />
              <span className="truncate" title={observationText}>
                <span className="font-medium">{observationType === 'accident' ? 'Accident' : 
                  observationType === 'heat' ? 'Heat cycle' : 
                  observationType === 'behavior' ? 'Behavior' : 
                  observationType === 'other' ? 'Note' : 'Observation'}:</span> {observationText}
              </span>
            </div>
          )}
        </div>
      </div>
    </TableCell>
  );
};

export default DogNameCell;
