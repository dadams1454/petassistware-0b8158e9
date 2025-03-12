import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import AddWelpingPuppyDialog from '@/components/welping/AddWelpingPuppyDialog';
import WelpingProgressCard from '@/components/welping/WelpingProgressCard';
import WelpingPuppiesList from '@/components/welping/WelpingPuppiesList';
import LitterHeader from '@/components/litters/detail/LitterHeader';

const WelpingPage = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const {
    data: litter,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['litter-welping', id],
    queryFn: async () => {
      if (!id) throw new Error('Litter ID is required');
      const {
        data,
        error
      } = await supabase.from('litters').select(`
          *,
          dam:dogs!litters_dam_id_fkey(id, name, breed, photo_url),
          sire:dogs!litters_sire_id_fkey(id, name, breed, photo_url),
          puppies(*)
        `).eq('id', id).single();
      if (error) throw error;
      return data;
    }
  });

  const handleAddPuppySuccess = async () => {
    setIsAddDialogOpen(false);
    await refetch();
    toast({
      title: "Success!",
      description: "Puppy recorded successfully."
    });
  };

  const handleFinishWelping = () => {
    navigate(`/litters/${id}`);
    toast({
      title: "Welping Complete",
      description: "You can now manage the litter in the puppies section."
    });
  };

  if (isLoading) {
    return <MainLayout>
        <div className="container mx-auto py-6">
          <p>Loading litter details...</p>
        </div>
      </MainLayout>;
  }

  if (error || !litter) {
    console.error("Error loading litter:", error);
    return <MainLayout>
        <div className="container mx-auto py-6">
          <div className="mt-6 text-center text-red-500">
            <p>Error loading litter details. The litter may not exist.</p>
          </div>
        </div>
      </MainLayout>;
  }

  const puppies = litter.puppies || [];
  return <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-3xl">Whelping Session</h1>
          <div className="flex gap-3">
            <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Record New Puppy
            </Button>
            <Button onClick={handleFinishWelping} variant="outline" className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Finish Whelping
            </Button>
          </div>
        </div>
        
        <LitterHeader litter={litter} sire={litter.sire} dam={litter.dam} onEditClick={() => {}} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <WelpingProgressCard litter={litter} puppiesCount={puppies.length} />
          
          <div className="lg:col-span-2">
            <WelpingPuppiesList puppies={puppies} litterId={litter.id} onAddPuppy={() => setIsAddDialogOpen(true)} onRefresh={refetch} />
          </div>
        </div>
      </div>

      <AddWelpingPuppyDialog litterId={litter.id} isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSuccess={handleAddPuppySuccess} />
    </MainLayout>;
};

export default WelpingPage;
