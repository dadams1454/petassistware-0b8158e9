
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Litter, Puppy } from '@/types/litter';
import WelpingPageHeader from '@/components/welping/WelpingPageHeader';
import LitterDetailsCard from '@/components/welping/LitterDetailsCard';
import WelpingTabContent from '@/components/welping/WelpingTabContent';
import WelpingProgressCard from '@/components/welping/WelpingProgressCard';
import WelpingStepGuide from '@/components/welping/WelpingStepGuide';
import LoadingState from '@/components/welping/LoadingState';
import ErrorState from '@/components/welping/ErrorState';
import PageContainer from '@/components/common/PageContainer';

const WelpingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('record');
  const [currentStep, setCurrentStep] = useState(id === 'new' ? 0 : 2); // Start at step 0 for new welping, step 2 for existing

  const { data: litter, isLoading, error, refetch } = useQuery({
    queryKey: ['welping-litter', id],
    queryFn: async () => {
      if (id === 'new') {
        // For new welping, show a step-by-step guide to start the process
        return {
          id: 'new',
          birth_date: new Date().toISOString().split('T')[0],
          puppies: []
        } as unknown as Litter;
      }
      
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
    },
    enabled: !!id
  });

  // Wrap refetch in a function that returns void
  const handleRefresh = async (): Promise<void> => {
    await refetch();
    return;
  };

  if (isLoading) {
    return <LoadingState message="Loading whelping details..." />;
  }

  if (error || !litter) {
    console.error("Error loading litter:", error);
    return <ErrorState message="Error loading whelping details. The litter may not exist." />;
  }

  // For new welping entry, show the step-by-step guide
  if (id === 'new') {
    return (
      <PageContainer>
        <div className="container mx-auto py-6 space-y-6">
          <WelpingStepGuide 
            currentStep={currentStep} 
            setCurrentStep={setCurrentStep} 
            onLitterCreated={(litterId) => {
              if (litterId) {
                navigate(`/welping/${litterId}`);
              }
            }}
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto py-6 space-y-6">
        <WelpingPageHeader litter={litter} litterId={id} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <LitterDetailsCard litter={litter} />
            <WelpingProgressCard 
              litter={litter} 
              puppiesCount={litter.puppies?.length || 0} 
            />
          </div>
          
          <div className="md:col-span-2">
            <WelpingTabContent 
              litterId={id} 
              puppies={litter.puppies as Puppy[] || []}
              onRefresh={handleRefresh}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default WelpingPage;
