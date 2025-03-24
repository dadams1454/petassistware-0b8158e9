
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';
import DogsList from '@/components/dogs/DogsList';
import DogFormDialog from '@/components/dogs/components/dialogs/DogFormDialog';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const DogsPage = () => {
  const { user } = useAuth();
  const [selectedDog, setSelectedDog] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Delete dog mutation
  const deleteDogMutation = useMutation({
    mutationFn: async (dogId: string) => {
      const { error } = await supabase
        .from('dogs')
        .delete()
        .eq('id', dogId);

      if (error) throw new Error(error.message);
      return dogId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogs'] });
      queryClient.invalidateQueries({ queryKey: ['allDogs'] });
      toast({
        title: 'Dog deleted',
        description: 'Dog has been successfully removed',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting dog',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleAddDog = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditDog = (dog: any) => {
    setSelectedDog(dog);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDog = (dogId: string) => {
    if (window.confirm('Are you sure you want to delete this dog?')) {
      deleteDogMutation.mutate(dogId);
    }
  };

  const handleFormSuccess = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['dogs'] });
    queryClient.invalidateQueries({ queryKey: ['allDogs'] });
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Dogs</h1>
            <Button onClick={handleAddDog}>
              <Plus className="mr-2 h-4 w-4" /> Add Dog
            </Button>
          </div>

          {/* The DogsList component now handles its own data fetching and doesn't require props */}
          <DogsList />

          {/* Add Dog Dialog */}
          <DogFormDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsAddDialogOpen(false)}
            title="Add New Dog"
          />

          {/* Edit Dog Dialog */}
          <DogFormDialog
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsEditDialogOpen(false)}
            dog={selectedDog}
            title="Edit Dog"
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default DogsPage;
