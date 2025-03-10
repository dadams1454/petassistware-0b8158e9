import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DogIcon } from 'lucide-react';

import PuppiesTable from './puppies/PuppiesTable';
import EditPuppyDialog from './puppies/EditPuppyDialog';
import DeletePuppyDialog from './puppies/DeletePuppyDialog';
import PuppyDetail from './puppies/PuppyDetail';

interface PuppiesListProps {
  puppies: Puppy[];
  litterId: string;
  onRefresh: () => Promise<any>;
}

const PuppiesList = ({ puppies, litterId, onRefresh }: PuppiesListProps) => {
  const { toast } = useToast();
  const [editingPuppy, setEditingPuppy] = useState<Puppy | null>(null);
  const [deletingPuppy, setDeletingPuppy] = useState<Puppy | null>(null);
  const [viewingPuppy, setViewingPuppy] = useState<Puppy | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const handleEditPuppy = (puppy: Puppy) => {
    setEditingPuppy(puppy);
    setIsEditDialogOpen(true);
  };

  const handleDeletePuppy = (puppy: Puppy) => {
    setDeletingPuppy(puppy);
    setIsDeleteDialogOpen(true);
  };

  const handleViewPuppy = (puppy: Puppy) => {
    setViewingPuppy(puppy);
    setIsDetailDialogOpen(true);
  };

  const handleDeleteSuccess = async () => {
    setIsDeleteDialogOpen(false);
    await onRefresh();
    toast({
      title: "Puppy Deleted",
      description: "The puppy has been removed from this litter.",
    });
  };

  const handleEditSuccess = async () => {
    setIsEditDialogOpen(false);
    await onRefresh();
    toast({
      title: "Puppy Updated",
      description: "The puppy information has been updated successfully.",
    });
  };

  return (
    <div>
      {puppies.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <DogIcon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium">No Puppies Yet</h3>
          <p className="text-muted-foreground mb-4">
            There are no puppies in this litter yet. Add your first puppy.
          </p>
        </div>
      ) : (
        <PuppiesTable 
          puppies={puppies} 
          onEditPuppy={handleEditPuppy}
          onDeletePuppy={handleDeletePuppy}
          onViewPuppy={handleViewPuppy}
        />
      )}

      {/* Edit Puppy Dialog */}
      {editingPuppy && (
        <EditPuppyDialog
          puppy={editingPuppy}
          litterId={litterId}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Puppy Dialog */}
      {deletingPuppy && (
        <DeletePuppyDialog
          puppy={deletingPuppy}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteSuccess}
        />
      )}

      {/* Puppy Detail Dialog */}
      {viewingPuppy && (
        <PuppyDetail
          puppy={viewingPuppy}
          litterId={litterId}
          isOpen={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
        />
      )}
    </div>
  );
};

export default PuppiesList;
