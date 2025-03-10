
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import MainLayout from '@/layouts/MainLayout';
import PuppyProfile from '@/components/litters/puppies/PuppyProfile';
import PuppyForm from '@/components/litters/PuppyForm';
import DeletePuppyDialog from '@/components/litters/puppies/DeletePuppyDialog';

const PuppyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: puppy, isLoading, error, refetch } = useQuery({
    queryKey: ['puppy', id],
    queryFn: async () => {
      if (!id) throw new Error('Puppy ID is required');
      
      const { data, error } = await supabase
        .from('puppies')
        .select(`
          *,
          litter:litters(id, litter_name, birth_date)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const handleEditSuccess = async () => {
    setIsEditDialogOpen(false);
    await refetch();
    toast({
      title: "Success!",
      description: "Puppy updated successfully.",
    });
  };

  const handleDeletePuppy = async () => {
    if (!puppy) return;
    
    try {
      const { error } = await supabase
        .from('puppies')
        .delete()
        .eq('id', puppy.id);
      
      if (error) throw error;
      
      toast({
        title: "Puppy deleted",
        description: "The puppy has been successfully deleted.",
      });
      
      // Navigate back to the litter page
      navigate(`/litters/${puppy.litter_id}`);
    } catch (error) {
      console.error('Error deleting puppy:', error);
      toast({
        title: "Error",
        description: "There was an error deleting the puppy.",
        variant: "destructive",
      });
    }
  };

  const navigateToLitter = () => {
    if (puppy?.litter_id) {
      navigate(`/litters/${puppy.litter_id}`);
    } else {
      navigate('/litters');
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <p>Loading puppy details...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !puppy) {
    console.error("Error loading puppy:", error);
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="mt-6 text-center text-red-500">
            <p>Error loading puppy details. The puppy may not exist.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={navigateToLitter}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {puppy.name || `Puppy ${puppy.id.substring(0, 6)}`}
              </h1>
              <p className="text-muted-foreground">
                From litter: {puppy.litter?.litter_name || puppy.litter_id}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <PuppyProfile puppy={puppy} />
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Puppy Profile</DialogTitle>
          </DialogHeader>
          <PuppyForm 
            initialData={puppy} 
            litterId={puppy.litter_id || ''}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeletePuppyDialog
        puppy={isDeleteDialogOpen ? puppy : null}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeletePuppy}
      />
    </MainLayout>
  );
};

export default PuppyDetail;
