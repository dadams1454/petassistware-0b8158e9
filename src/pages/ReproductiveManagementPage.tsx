
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BackButton from '@/components/common/BackButton';
import { ErrorState, LoadingState } from '@/components/ui/standardized';
import ReproductiveCycleDashboard from '@/components/breeding/reproductive/ReproductiveCycleDashboard';
import PregnancyMilestones from '@/components/breeding/reproductive/PregnancyMilestones';
import WhelpingPreparation from '@/components/breeding/reproductive/WhelpingPreparation';

const ReproductiveManagementPage: React.FC = () => {
  const { dogId } = useParams<{ dogId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cycle');
  
  const { data: dog, isLoading, error } = useQuery({
    queryKey: ['dog', dogId],
    queryFn: async () => {
      if (!dogId) throw new Error('Dog ID is required');
      
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', dogId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!dogId
  });

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingState message="Loading dog reproductive information..." />
      </MainLayout>
    );
  }

  if (error || !dog) {
    return (
      <MainLayout>
        <ErrorState message="Error loading dog information. Please try again." />
      </MainLayout>
    );
  }

  if (dog.gender !== 'Female') {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <BackButton fallbackPath="/dogs" />
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-4">
            <h1 className="text-xl font-bold text-amber-800 mb-2">Male Dogs</h1>
            <p className="text-amber-700">
              Detailed reproductive cycle management is only available for female dogs. 
              For male dogs, please use the breeding management section on the dog profile page.
            </p>
            <button 
              onClick={() => navigate(`/dogs/${dogId}`)} 
              className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
            >
              Return to Dog Profile
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <BackButton fallbackPath={`/dogs/${dogId}`} />
            <h1 className="text-2xl font-bold mt-2">Reproductive Management: {dog.name}</h1>
            <p className="text-muted-foreground">{dog.breed} • {dog.color || 'Unknown color'}</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="cycle">Cycle Tracking</TabsTrigger>
            <TabsTrigger value="pregnancy">Pregnancy</TabsTrigger>
            <TabsTrigger value="whelping">Whelping Prep</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cycle" className="space-y-6">
            <ReproductiveCycleDashboard dog={dog} />
          </TabsContent>
          
          <TabsContent value="pregnancy" className="space-y-6">
            <PregnancyMilestones dog={dog} />
          </TabsContent>
          
          <TabsContent value="whelping" className="space-y-6">
            <WhelpingPreparation dog={dog} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ReproductiveManagementPage;
