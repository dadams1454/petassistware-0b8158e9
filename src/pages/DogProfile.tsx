
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Trash2 } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DogProfileDetails from '@/components/dogs/components/profile/DogProfileDetails';
import DogHealthRecords from '@/components/dogs/components/profile/DogHealthRecords';
import DogCareHistory from '@/components/dogs/components/profile/DogCareHistory';
import EditDogDialog from '@/components/dogs/components/details/EditDogDialog';
import { DogProfile } from '@/types/dog';
import { Button } from '@/components/ui/button';

// Import standardized components
import {
  PageHeader,
  LoadingState,
  ErrorState,
  ConfirmDialog
} from '@/components/ui/standardized';

const DogProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch the specific dog data
  const { data: dog, isLoading, error, refetch } = useQuery({
    queryKey: ['dog', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        toast({
          title: 'Error fetching dog details',
          description: error.message,
          variant: 'destructive',
        });
        throw new Error(error.message);
      }
      
      return data as DogProfile;
    },
  });

  const handleDeleteDog = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('dogs')
        .delete()
        .eq('id', id);
        
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

  if (isLoading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="container mx-auto py-8">
            <LoadingState message="Loading dog profile..." />
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (error || !dog) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="container mx-auto py-8">
            <ErrorState
              title="Dog not found"
              message="The requested dog could not be found or you don't have permission to view it."
              onRetry={() => refetch()}
            />
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto py-8">
          <PageHeader
            title={dog.name}
            subtitle={`${dog.breed || 'Unknown Breed'} · ${dog.gender || 'Unknown Gender'}`}
            backLink="/dogs"
            action={
              <Button onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Dog
              </Button>
            }
          />
          
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
          
          <Tabs defaultValue="details" className="mt-6">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="health">Health Records</TabsTrigger>
              <TabsTrigger value="care">Care History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-4">
              <DogProfileDetails dog={dog} />
            </TabsContent>
            
            <TabsContent value="health" className="mt-4">
              <DogHealthRecords dogId={dog.id} />
            </TabsContent>
            
            <TabsContent value="care" className="mt-4">
              <DogCareHistory dogId={dog.id} />
            </TabsContent>
          </Tabs>
          
          {/* Edit Dialog */}
          <EditDogDialog 
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            dog={dog}
          />
          
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
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default DogProfilePage;
