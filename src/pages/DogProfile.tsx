
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
import { DogProfile, DogGender, DogStatus, WeightUnit } from '@/types/dog';
import { Button } from '@/components/ui/button';
import GeneticsTab from '@/components/dogs/components/tabs/GeneticsTab';
import PedigreeTab from '@/components/dogs/components/tabs/PedigreeTab';

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
      
      // Ensure all required properties from DogProfile are set with defaults if missing
      const dogWithDefaults: DogProfile = {
        id: data.id,
        name: data.name,
        breed: data.breed,
        gender: (data.gender || 'male') as DogGender,
        birthdate: data.birthdate || '',
        color: data.color || '',
        weight: data.weight || 0,
        weight_unit: data.weight_unit || 'lbs' as WeightUnit,
        status: data.status || 'active' as DogStatus,
        photo_url: data.photo_url,
        microchip_number: data.microchip_number,
        registration_number: data.registration_number,
        notes: data.notes,
        is_pregnant: data.is_pregnant || false,
        last_heat_date: data.last_heat_date,
        tie_date: data.tie_date,
        litter_number: data.litter_number || 0,
        created_at: data.created_at || new Date().toISOString(),
        pedigree: data.pedigree || false,
        requires_special_handling: data.requires_special_handling || false,
        potty_alert_threshold: data.potty_alert_threshold,
        max_time_between_breaks: data.max_time_between_breaks,
        vaccination_type: data.vaccination_type,
        vaccination_notes: data.vaccination_notes,
        last_vaccination_date: data.last_vaccination_date,
        owner_id: data.owner_id,
        sire_id: data.sire_id,
        dam_id: data.dam_id,
        registration_organization: data.registration_organization,
        microchip_location: data.microchip_location,
        group_ids: data.group_ids,
      };
      
      return dogWithDefaults;
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
              <TabsTrigger value="pedigree">Pedigree</TabsTrigger>
              <TabsTrigger value="genetics">Genetics</TabsTrigger>
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

            <TabsContent value="pedigree" className="mt-4">
              <PedigreeTab dogId={dog.id} currentDog={dog} />
            </TabsContent>
            
            <TabsContent value="genetics" className="mt-4">
              <GeneticsTab dogId={dog.id} dogName={dog.name} />
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
