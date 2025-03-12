
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PuppiesTable from './puppies/PuppiesTable';
import DeletePuppyDialog from './puppies/DeletePuppyDialog';
import EditPuppyDialog from './puppies/EditPuppyDialog';

interface PuppiesListProps {
  puppies: Puppy[];
  litterId: string;
  onRefresh: () => Promise<any>;
}

const PuppiesList: React.FC<PuppiesListProps> = ({ puppies, litterId, onRefresh }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPuppy, setSelectedPuppy] = useState<Puppy | null>(null);
  const [puppyToDelete, setPuppyToDelete] = useState<Puppy | null>(null);

  const handleEditPuppy = (puppy: Puppy) => {
    setSelectedPuppy(puppy);
    setIsEditDialogOpen(true);
  };

  const handleAddPuppy = () => {
    setSelectedPuppy(null);
    setIsAddDialogOpen(true);
  };

  const handleEditSuccess = async () => {
    setIsEditDialogOpen(false);
    setIsAddDialogOpen(false);
    setSelectedPuppy(null);
    await onRefresh();
    toast({
      title: "Success!",
      description: "Puppy updated successfully.",
    });
  };

  const handleDeletePuppy = async () => {
    if (!puppyToDelete) return;
    
    try {
      const { error } = await supabase
        .from('puppies')
        .delete()
        .eq('id', puppyToDelete.id);
      
      if (error) throw error;
      
      toast({
        title: "Puppy deleted",
        description: "The puppy has been successfully deleted.",
      });
      
      setPuppyToDelete(null);
      await onRefresh();
    } catch (error) {
      console.error('Error deleting puppy:', error);
      toast({
        title: "Error",
        description: "There was an error deleting the puppy.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <PuppiesTable 
        puppies={puppies} 
        onEditPuppy={handleEditPuppy}
        onDeletePuppy={setPuppyToDelete} 
        onAddPuppy={handleAddPuppy}
      />

      {/* Edit Puppy Dialog */}
      <EditPuppyDialog
        puppy={selectedPuppy}
        litterId={litterId}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={handleEditSuccess}
      />

      {/* Add Puppy Dialog */}
      <EditPuppyDialog
        puppy={null}
        litterId={litterId}
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <DeletePuppyDialog
        puppy={puppyToDelete}
        onClose={() => setPuppyToDelete(null)}
        onConfirm={handleDeletePuppy}
      />
    </div>
  );
};

export default PuppiesList;
