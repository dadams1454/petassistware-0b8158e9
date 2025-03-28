
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/layouts/MainLayout';
import BackButton from '@/components/common/BackButton';
import LitterHeader from '@/components/litters/detail/LitterHeader';
import LitterInfo from '@/components/litters/detail/LitterInfo';
import LitterTabs from '@/components/litters/detail/LitterTabs';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/standardized';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LitterForm from '@/components/litters/LitterForm';
import { toast } from '@/components/ui/use-toast';
import { Litter } from '@/types/litter'; // Import from regular .ts file

const LitterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Skip this query if we're on the "new" route - this is the fix for the error
  const { data: litter, isLoading, error, refetch } = useQuery({
    queryKey: ['litter', id],
    queryFn: async () => {
      if (!id || id === 'new') {
        throw new Error('Invalid litter ID');
      }

      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dogs!litters_dam_id_fkey(*),
          sire:dogs!litters_sire_id_fkey(*),
          puppies(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error loading litter:', error);
        throw error;
      }

      // We need to use a type assertion here because the data returned from Supabase
      // doesn't exactly match our Litter type definition
      const rawData = data as any;
      
      // Create a processed data object with the proper Litter type
      const processedData: Litter = {
        ...rawData,
        // Explicitly add the updated_at field with a fallback to created_at
        updated_at: rawData.updated_at || rawData.created_at
      };

      console.log('Processed litter data:', processedData);
      return processedData;
    },
    enabled: !!id && id !== 'new', // Only run the query if id exists and is not "new"
  });

  // If we're trying to access a non-existent litter ID
  if (error && id !== 'new') {
    return (
      <MainLayout>
        <div className="container mx-auto py-6 space-y-6">
          <BackButton fallbackPath="/litters" />
          <ErrorState 
            title="Litter Not Found"
            message="The litter you're looking for doesn't exist or you don't have permission to view it."
            onRetry={() => navigate('/litters')}
            actionLabel="Back to Litters"
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <BackButton fallbackPath="/litters" />
          {isLoading ? (
            <h1 className="text-3xl font-bold">Loading Litter...</h1>
          ) : litter ? (
            <h1 className="text-3xl font-bold">
              {litter.litter_name || "Unnamed Litter"}
            </h1>
          ) : (
            <h1 className="text-3xl font-bold">Litter Not Found</h1>
          )}
        </div>

        {isLoading ? (
          <LoadingState 
            message="Loading litter details..." 
            showSkeleton={true}
            skeletonVariant="card"
            skeletonCount={3}
          />
        ) : litter ? (
          <div className="space-y-6">
            <LitterHeader 
              litter={litter} 
              sire={litter.sire}
              dam={litter.dam}
              onEditClick={() => setIsEditDialogOpen(true)} 
            />
            <LitterInfo litter={litter} />
            <LitterTabs 
              litterId={litter.id} 
              litterName={litter.litter_name}
              dogBreed={litter.dam?.breed}
              puppies={litter.puppies}
            />
          </div>
        ) : id !== 'new' ? (
          <EmptyState
            title="Litter Not Found"
            description="The litter you're looking for doesn't exist or you don't have permission to view it."
            action={{
              label: "Go to Litters",
              onClick: () => navigate('/litters')
            }}
          />
        ) : null}
      </div>

      {/* Edit Litter Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Litter</DialogTitle>
          </DialogHeader>
          {litter && (
            <LitterForm 
              initialData={litter}
              onSuccess={handleEditSuccess} 
            />
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
  
  // Function for handling edit success
  async function handleEditSuccess() {
    setIsEditDialogOpen(false);
    await refetch();
    toast({
      title: "Success!",
      description: "Litter updated successfully.",
    });
  }
};

export default LitterDetail;
