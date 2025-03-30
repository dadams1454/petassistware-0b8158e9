
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/standardized';

interface DogDeleteHandlerProps {
  dogId: string;
}

const DogDeleteHandler: React.FC<DogDeleteHandlerProps> = ({ dogId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDeleteDog = async () => {
    if (!dogId) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('dogs')
        .delete()
        .eq('id', dogId);
        
      if (error) throw error;
      
      toast({
        title: 'Dog deleted',
        description: 'The dog has been permanently deleted',
      });
      
      navigate('/dogs');
    } catch (error) {
      toast({
        title: 'Error deleting dog',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Dog
        </Button>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Dog Profile"
        description="Are you sure you want to delete this dog? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDeleteDog}
      />
    </>
  );
};

export default DogDeleteHandler;
