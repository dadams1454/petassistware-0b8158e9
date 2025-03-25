
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Edit, Trash2, UserPlus } from 'lucide-react';
import DogAssignmentDialog from './DogAssignmentDialog';
import { useDailyCare } from '@/contexts/dailyCare';

interface DogGroupCardProps {
  group: {
    id: string;
    name: string;
    description?: string;
    color?: string;
  };
  onEdit: (group: any) => void;
  onDelete: (groupId: string) => void;
}

const DogGroupCard: React.FC<DogGroupCardProps> = ({ group, onEdit, onDelete }) => {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const { dogStatuses } = useDailyCare();

  // Get background color based on group color
  const getGroupColor = (color: string | undefined): string => {
    switch (color) {
      case 'blue': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'teal': return 'bg-teal-100 border-teal-300 text-teal-800';
      case 'yellow': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'red': return 'bg-red-100 border-red-300 text-red-800';
      case 'green': return 'bg-green-100 border-green-300 text-green-800';
      case 'purple': return 'bg-purple-100 border-purple-300 text-purple-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <>
      <Card className={`border overflow-hidden ${getGroupColor(group.color)}`}>
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <h3 className="font-medium text-lg">{group.name}</h3>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => onEdit(group)}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                className="h-8 w-8 p-0 hover:text-red-600 hover:bg-red-50"
                onClick={() => onDelete(group.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
          
          {group.description && (
            <p className="text-sm mb-4 opacity-90">{group.description}</p>
          )}
          
          <div className="mt-4 pt-3 border-t border-current border-opacity-20 flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs p-2"
              onClick={() => setAssignDialogOpen(true)}
            >
              <UserPlus className="h-3.5 w-3.5 mr-1" />
              Assign Dogs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dog Assignment Dialog */}
      {dogStatuses && (
        <DogAssignmentDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          groupId={group.id}
          groupName={group.name}
          dogs={dogStatuses}
        />
      )}
    </>
  );
};

export default DogGroupCard;
