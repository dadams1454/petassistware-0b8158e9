
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/layouts/MainLayout';
import BackButton from '@/components/common/BackButton';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DogProfileHeader from '@/components/dogs/components/profile/DogProfileHeader';
import DogProfileDetails from '@/components/dogs/components/profile/DogProfileDetails';
import DogHealthRecords from '@/components/dogs/components/profile/DogHealthRecords';
import DogCareHistory from '@/components/dogs/components/profile/DogCareHistory';
import EditDogDialog from '@/components/dogs/components/details/EditDogDialog';
import { DogProfile } from '@/types/dog';

const DogProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Fetch the specific dog data
  const { data: dog, isLoading, error } = useQuery({
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

  if (isLoading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="container mx-auto py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
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
            <BackButton fallbackPath="/dogs" />
            <div className="p-8 bg-muted rounded-lg text-center mt-6">
              <h2 className="text-xl font-semibold mb-2">Dog not found</h2>
              <p className="text-muted-foreground">The requested dog could not be found or you don't have permission to view it.</p>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto py-8">
          <BackButton fallbackPath="/dogs" className="mb-6" />
          
          <DogProfileHeader 
            dog={dog} 
            onEdit={() => setIsEditDialogOpen(true)} 
          />
          
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
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default DogProfilePage;
