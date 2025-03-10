
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
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5"
        onClick={() => onEdit(puppy)}
      >
        <Edit className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Edit</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5 text-destructive hover:bg-destructive/10"
        onClick={() => onDelete(puppy)}
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Delete</span>
      </Button>
    </div>
  );
};

export default PuppyActions;
