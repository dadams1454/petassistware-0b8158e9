
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';
import DogForm from '@/components/dogs/DogForm';
import DogsList from '@/components/dogs/DogsList';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const DogsPage = () => {
  const { user } = useAuth();
  const [selectedDog, setSelectedDog] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch dogs
  const { data: dogs, isLoading } = useQuery({
    queryKey: ['dogs'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .order('name');
      
      if (error) {
        toast({
          title: 'Error fetching dogs',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }
      
      return data || [];
    },
    enabled: !!user,
  });

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
    onError: (error) => {
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

          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DogsList 
              dogs={dogs || []}
              onView={() => {}} // We don't need this anymore as we navigate directly
              onEdit={handleEditDog}
              onDelete={handleDeleteDog}
            />
          )}

          {/* Add Dog Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Dog</DialogTitle>
              </DialogHeader>
              <DogForm 
                onSuccess={() => {
                  setIsAddDialogOpen(false);
                  queryClient.invalidateQueries({ queryKey: ['dogs'] });
                  queryClient.invalidateQueries({ queryKey: ['allDogs'] });
                }}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Edit Dog Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Dog</DialogTitle>
              </DialogHeader>
              {selectedDog && (
                <DogForm 
                  dog={selectedDog}
                  onSuccess={() => {
                    setIsEditDialogOpen(false);
                    queryClient.invalidateQueries({ queryKey: ['dogs'] });
                    queryClient.invalidateQueries({ queryKey: ['allDogs'] });
                  }}
                  onCancel={() => setIsEditDialogOpen(false)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default DogsPage;
