
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '@/components/ui/standardized';
import { useDogMutation } from '../../hooks/useDogMutation';
import { toast } from 'sonner';

interface DogDeleteHandlerProps {
  dogId: string;
  dogName: string;
}

const DogDeleteHandler: React.FC<DogDeleteHandlerProps> = ({ dogId, dogName }) => {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { deleteDog, isDeleting } = useDogMutation();

  const handleDelete = async () => {
    try {
      await deleteDog(dogId);
      toast.success(`${dogName} has been deleted.`);
      navigate('/dogs');
    } catch (error) {
      toast.error('Failed to delete dog.');
      console.error('Delete error:', error);
    }
  };

  return (
    <>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => setConfirmOpen(true)}
        className="flex items-center gap-1"
      >
        <Trash2 className="h-4 w-4" />
        Delete Dog
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete ${dogName}`}
        description={`Are you sure you want to delete ${dogName}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      >
        {/* The Dialog trigger button is outside this component, but we need to provide children */}
        <span />
      </ConfirmDialog>
    </>
  );
};

export default DogDeleteHandler;
