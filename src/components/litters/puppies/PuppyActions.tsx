
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PuppyActionsProps {
  puppy: Puppy;
  onEdit: (puppy: Puppy) => void;
  onDelete: (puppy: Puppy) => void;
}

const PuppyActions: React.FC<PuppyActionsProps> = ({ puppy, onEdit, onDelete }) => {
  return (
    <div className="flex justify-end">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(puppy)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-destructive"
        onClick={() => onDelete(puppy)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PuppyActions;
