
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, X, Plus } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { DogGroup } from '../hooks/useDogGroups';

interface DogGroupCardProps {
  group: DogGroup;
  isSelected?: boolean;
  dogsData?: DogCareStatus[];
  onSelect?: (group: DogGroup) => void;
  onClose?: () => void;
  onAddDog?: (group: DogGroup) => void;
  onRemoveDog?: (groupId: string, dogId: string) => void;
  onEdit?: (group: DogGroup) => void;
  onDelete?: (groupId: string) => void;
}

const DogGroupCard: React.FC<DogGroupCardProps> = ({
  group,
  isSelected = false,
  dogsData = [],
  onSelect,
  onClose,
  onAddDog,
  onRemoveDog,
  onEdit,
  onDelete
}) => {
  // If we have dogIds in the group, filter the dogs data to get only those dogs
  const groupDogs = dogsData.filter(dog => 
    group.dogIds && group.dogIds.includes(dog.dog_id)
  );
  
  // Handle card management UI
  const renderManagementUI = () => {
    if (onEdit && onDelete) {
      return (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(group)}
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => onDelete && onDelete(group.id)}
          >
            <X className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      );
    }

    // Original dog let out management UI
    return (
      <div className="flex gap-2">
        {onAddDog && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onAddDog(group)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Dog
          </Button>
        )}
        
        {!isSelected ? (
          onSelect && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onSelect(group)}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Manage
            </Button>
          )
        ) : (
          onClose && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4 mr-1" />
              Close
            </Button>
          )
        )}
      </div>
    );
  };
  
  return (
    <Card 
      key={group.id} 
      className={`mb-4 overflow-hidden transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
    >
      <div 
        className="h-2" 
        style={{ backgroundColor: group.color || '#1890ff' }}
      />
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{group.name}</h3>
          {renderManagementUI()}
        </div>
        
        {(dogsData && dogsData.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {!group.dogIds || group.dogIds.length === 0 ? (
              <p className="text-sm text-muted-foreground">No dogs in this group</p>
            ) : (
              groupDogs.map(dog => (
                <Badge 
                  key={dog.dog_id} 
                  variant="outline"
                  className="flex items-center"
                >
                  {dog.dog_name}
                  {isSelected && onRemoveDog && (
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => onRemoveDog(group.id, dog.dog_id)}
                    />
                  )}
                </Badge>
              ))
            )}
          </div>
        )}
        
        {group.description && (
          <p className="text-sm text-muted-foreground">{group.description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DogGroupCard;
