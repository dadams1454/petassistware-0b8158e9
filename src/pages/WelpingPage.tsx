
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/layouts/MainLayout';
import { Litter, Puppy } from '@/components/litters/puppies/types';
import WelpingPageHeader from '@/components/welping/WelpingPageHeader';
import LitterDetailsCard from '@/components/welping/LitterDetailsCard';
import WelpingTabContent from '@/components/welping/WelpingTabContent';
import LoadingState from '@/components/welping/LoadingState';
import ErrorState from '@/components/welping/ErrorState';

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

  if (isLoading) {
    return <LoadingState message="Loading litter details..." />;
  }

  if (error || !litter) {
    console.error("Error loading litter:", error);
    return <ErrorState message="Error loading litter details. The litter may not exist." />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <WelpingPageHeader litter={litter} litterId={id || ''} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <LitterDetailsCard litter={litter} />
          </div>
          
          <div className="md:col-span-2">
            <WelpingTabContent 
              litterId={id || ''} 
              puppies={litter.puppies as Puppy[] || []}
              onRefresh={handleRefresh}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default WelpingPage;
