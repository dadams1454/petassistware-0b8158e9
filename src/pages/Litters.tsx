
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/layouts/MainLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import LittersList from '@/components/litters/LittersList';
import LitterForm from '@/components/litters/LitterForm';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const Litters = () => {
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLitter, setSelectedLitter] = useState<Litter | null>(null);

  const { data: litters, isLoading, error, refetch } = useQuery({
    queryKey: ['litters'],
    queryFn: async () => {
      // Query the litters with all needed information including dam/sire gender and ALL puppy data
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dogs!litters_dam_id_fkey(id, name, breed, gender),
          sire:dogs!litters_sire_id_fkey(id, name, breed, gender),
          puppies!puppies_litter_id_fkey(*)
        `)
        .order('birth_date', { ascending: false });

      if (error) throw error;
      console.log('Fetched litters data:', data);
      return data || [];
    }
  });

  const handleEditSuccess = async () => {
    setIsEditDialogOpen(false);
    setSelectedLitter(null);
    await refetch();
    toast({
      title: "Success!",
      description: "Litter updated successfully.",
    });
  };

  const handleEditLitter = (litter: Litter) => {
    setSelectedLitter(litter);
    setIsEditDialogOpen(true);
  };

  if (error) {
    console.error("Error loading litters:", error);
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Litters</h1>
          <Button 
            onClick={() => navigate('/litters/new')}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            New Litter
          </Button>
        </div>

        <DashboardCard>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading litters...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              <p>There was an error loading litters. Please try again.</p>
            </div>
          ) : (
            <LittersList 
              litters={litters || []} 
              onEditLitter={handleEditLitter}
              onRefresh={refetch}
            />
          )}
        </DashboardCard>
      </div>

      {/* Edit Litter Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Litter</DialogTitle>
          </DialogHeader>
          {selectedLitter && (
            <LitterForm 
              initialData={selectedLitter} 
              onSuccess={handleEditSuccess} 
            />
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Litters;
