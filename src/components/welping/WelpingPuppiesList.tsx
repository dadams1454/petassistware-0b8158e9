
import React, { useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Plus, Clock } from 'lucide-react';
import EditPuppyDialog from '@/components/litters/puppies/EditPuppyDialog';
import DeletePuppyDialog from '@/components/litters/puppies/DeletePuppyDialog';
import WelpingPuppiesTable from './WelpingPuppiesTable';

interface WelpingPuppiesListProps {
  puppies: Puppy[];
  litterId: string;
  onAddPuppy: () => void;
  onRefresh: () => Promise<any>;
}

const WelpingPuppiesList: React.FC<WelpingPuppiesListProps> = ({ 
  puppies, 
  litterId, 
  onAddPuppy,
  onRefresh 
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPuppy, setSelectedPuppy] = useState<Puppy | null>(null);
  const [puppyToDelete, setPuppyToDelete] = useState<Puppy | null>(null);

  const handleEditPuppy = (puppy: Puppy) => {
    setSelectedPuppy(puppy);
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = async () => {
    setIsEditDialogOpen(false);
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
        description: "The puppy has been deleted from the records.",
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

  // Sort puppies by birth time (assumed to be created_at)
  const sortedPuppies = [...puppies].sort((a, b) => {
    return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Puppies Born</h2>
        <Button 
          onClick={onAddPuppy} 
          size="sm"
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Record New Puppy
        </Button>
      </div>
      
      {puppies.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-muted-foreground/50">
          <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-4">
            No puppies have been recorded yet for this whelping session.
          </p>
          <Button 
            onClick={onAddPuppy} 
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Record First Puppy
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <WelpingPuppiesTable 
            puppies={sortedPuppies}
            onEditPuppy={handleEditPuppy}
            onDeletePuppy={setPuppyToDelete}
          />
        </div>
      )}
      
      {/* Edit Puppy Dialog */}
      <EditPuppyDialog
        puppy={selectedPuppy}
        litterId={litterId}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
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

export default WelpingPuppiesList;
