
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import MainLayout from '@/layouts/MainLayout';
import LitterForm from '@/components/litters/LitterForm';
import LitterHeader from '@/components/litters/detail/LitterHeader';
import LitterInfo from '@/components/litters/detail/LitterInfo';
import LitterTabs from '@/components/litters/detail/LitterTabs';

const LitterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: litter, isLoading, error, refetch } = useQuery({
    queryKey: ['litter', id],
    queryFn: async () => {
      if (!id) throw new Error('Litter ID is required');
      
      // Update the query to explicitly get all puppies data
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dogs!litters_dam_id_fkey(id, name, breed, photo_url),
          sire:dogs!litters_sire_id_fkey(id, name, breed, photo_url),
          puppies!puppies_litter_id_fkey(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      console.log('Fetched detailed litter data:', data);
      return data;
    }
  });

  const handleEditSuccess = async () => {
    setIsEditDialogOpen(false);
    await refetch();
    toast({
      title: "Success!",
      description: "Litter updated successfully.",
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <p>Loading litter details...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !litter) {
    console.error("Error loading litter:", error);
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="mt-6 text-center text-red-500">
            <p>Error loading litter details. The litter may not exist.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <LitterHeader 
          litter={litter} 
          sire={litter.sire}
          dam={litter.dam}
          onEditClick={() => setIsEditDialogOpen(true)} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LitterInfo litter={litter} />
          <div className="lg:col-span-2">
            <LitterTabs 
              litterId={litter.id} 
              litterName={litter.litter_name} 
              dogBreed={litter.sire?.breed || litter.dam?.breed} 
            />
          </div>
        </div>
      </div>

      {/* Edit Litter Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Litter</DialogTitle>
          </DialogHeader>
          <LitterForm 
            initialData={litter} 
            onSuccess={handleEditSuccess} 
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default LitterDetail;
