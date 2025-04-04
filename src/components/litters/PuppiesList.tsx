
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import PuppiesTable from './puppies/PuppiesTable';
import DeletePuppyDialog from './puppies/DeletePuppyDialog';
import EditPuppyDialog from './puppies/EditPuppyDialog';
import { Puppy } from '@/types/litter';
import { PuppyFormData } from './puppies/types';

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

  // Transform puppies to match the expected type in PuppiesTable
  const adaptedPuppies = puppies.map(puppy => ({
    ...puppy,
    color: puppy.color || '',  // Ensure color is not undefined
    gender: puppy.gender || 'Unknown', // Ensure gender is not undefined
    birth_date: puppy.birth_date || '', // Ensure birth_date is not undefined
    status: (puppy.status as 'Available' | 'Reserved' | 'Sold' | 'Unavailable') || 'Available'
  })) as PuppyFormData[];

  return (
    <div>
      <PuppiesTable 
        puppies={adaptedPuppies as any} 
        onEditPuppy={handleEditPuppy as any}
        onDeletePuppy={setPuppyToDelete as any} 
        onAddPuppy={handleAddPuppy}
      />

      {/* Edit Puppy Dialog */}
      <EditPuppyDialog
        puppy={selectedPuppy as any}
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
        puppy={puppyToDelete as any}
        onClose={() => setPuppyToDelete(null)}
        onConfirm={handleDeletePuppy}
      />
    </div>
  );
};

export default PuppiesList;
