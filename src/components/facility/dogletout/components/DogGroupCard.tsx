
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';

interface DogGroupCardProps {
  group: {
    id: string;
    name: string;
    description?: string;
    color?: string;
  };
  onEdit: (groupId: string) => void;
  onDelete: (groupId: string) => void;
}

const DogGroupCard: React.FC<DogGroupCardProps> = ({ group, onEdit, onDelete }) => {
  // Determine background color based on group color
  const getBgColor = () => {
    switch (group.color) {
      case 'blue': return 'bg-blue-100 dark:bg-blue-900/20';
      case 'green': return 'bg-green-100 dark:bg-green-900/20';
      case 'teal': return 'bg-teal-100 dark:bg-teal-900/20';
      case 'purple': return 'bg-purple-100 dark:bg-purple-900/20';
      case 'yellow': return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'red': return 'bg-red-100 dark:bg-red-900/20';
      default: return 'bg-gray-100 dark:bg-gray-800/50';
    }
  };

  // Determine border color based on group color
  const getBorderColor = () => {
    switch (group.color) {
      case 'blue': return 'border-blue-300 dark:border-blue-800';
      case 'green': return 'border-green-300 dark:border-green-800';
      case 'teal': return 'border-teal-300 dark:border-teal-800';
      case 'purple': return 'border-purple-300 dark:border-purple-800';
      case 'yellow': return 'border-yellow-300 dark:border-yellow-800';
      case 'red': return 'border-red-300 dark:border-red-800';
      default: return 'border-gray-300 dark:border-gray-700';
    }
  };

  return (
    <Card className={`${getBgColor()} border ${getBorderColor()} shadow-sm`}>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
        {group.description && (
          <p className="text-sm text-muted-foreground">{group.description}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onEdit(group.id)}
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <Edit2 className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete(group.id)}
          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-100"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DogGroupCard;
