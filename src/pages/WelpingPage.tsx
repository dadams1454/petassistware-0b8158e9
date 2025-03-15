
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/layouts/MainLayout';
import { Litter, Puppy } from '@/components/litters/puppies/types';
import WelpingHeader from '@/components/welping/WelpingHeader';
import LitterInfoCard from '@/components/welping/LitterInfoCard';
import WelpingTabs from '@/components/welping/WelpingTabs';
import WelpingLoadingState from '@/components/welping/WelpingLoadingState';

const WelpingPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('record');

  const { data: litter, isLoading, error, refetch } = useQuery({
    queryKey: ['welping-litter', id],
    queryFn: async () => {
      if (!id) throw new Error('Litter ID is required');
      
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dogs!litters_dam_id_fkey(id, name, breed, color, photo_url),
          sire:dogs!litters_sire_id_fkey(id, name, breed, color, photo_url),
          puppies!puppies_litter_id_fkey(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as unknown as Litter;
    }
  });

  // Wrap refetch in a function that returns void
  const handleRefresh = async (): Promise<void> => {
    await refetch();
    return;
  };

  const handlePuppyAdded = async () => {
    await handleRefresh();
    // Optionally switch to the list tab after adding a puppy
    setActiveTab('list');
  };

  // Show loading or error state if needed
  if (isLoading || error || !litter) {
    return <WelpingLoadingState isLoading={isLoading} error={error as Error | null} />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <WelpingHeader litter={litter} litterId={id || ''} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <LitterInfoCard litter={litter} />
          </div>
          
          <div className="md:col-span-2">
            <WelpingTabs 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              litterId={id || ''}
              puppies={(litter.puppies || []) as Puppy[]}
              handleRefresh={handleRefresh}
              handlePuppyAdded={handlePuppyAdded}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default WelpingPage;
