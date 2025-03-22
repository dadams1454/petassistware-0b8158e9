
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { getColorClass } from '../utils/groupColorUtils';

interface DogGroupCardProps {
  group: any;
  onEdit: (group: any) => void;
  onDelete: (groupId: string) => void;
}

const DogGroupCard: React.FC<DogGroupCardProps> = ({ group, onEdit, onDelete }) => {
  const colorClass = getColorClass(group.color);
  
  return (
    <Card key={group.id} className={`border ${colorClass}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{group.name}</h3>
            {group.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {group.description}
              </p>
            )}
          </div>
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(group)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-500 hover:text-red-700 hover:bg-red-100"
              onClick={() => onDelete(group.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DogGroupCard;
