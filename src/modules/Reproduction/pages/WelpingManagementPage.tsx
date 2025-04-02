
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageContainer from '@/components/common/PageContainer';
import { SectionHeader } from '@/components/ui/standardized';
import { useWelpingManagement } from '../hooks/useWelpingManagement';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Import the main components for each tab
import ActiveWelpingsTab from '../components/welping/ActiveWelpingsTab';
import PregnantDogsTab from '../components/welping/PregnantDogsTab';
import LitterOverviewTab from '../components/welping/LitterOverviewTab';
import BreedingPrepTab from '../components/welping/BreedingPrepTab';
import WelpingStatsCard from '../components/welping/WelpingStatsCard';
import WelpingGuideCard from '../components/welping/WelpingGuideCard';

const WelpingManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active-whelping');
  const { 
    pregnantDogs, 
    activeLitters, 
    activeWelpingsCount,
    pregnantCount,
    totalPuppiesCount,
    isLoading
  } = useWelpingManagement();

  const handleStartNewWelping = () => {
    navigate('/reproduction/welping/new');
  };

  const handleGoToBreeding = () => {
    navigate('/reproduction/breeding');
  };

  const handleGoToLitters = () => {
    navigate('/reproduction/litters');
  };

  const handleStartBreedingPrep = () => {
    setActiveTab('breeding-prep');
  };

  return (
    <PageContainer>
      <div className="container mx-auto py-6 space-y-6">
        <SectionHeader
          title="Reproduction Management"
          description="Monitor and manage breeding, pregnancy, whelping and litter activities"
          action={{
            label: "Start New Whelping",
            onClick: handleStartNewWelping,
            icon: <Plus className="h-4 w-4 mr-2" />,
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WelpingStatsCard 
            pregnantCount={pregnantCount} 
            activeWelpingsCount={activeWelpingsCount}
            totalPuppiesCount={totalPuppiesCount}
          />
          
          <WelpingGuideCard onStartBreedingPrep={handleStartBreedingPrep} />
          
          <div className="grid grid-cols-1 gap-4">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={handleGoToBreeding}
            >
              Breeding Management
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setActiveTab('pregnant-dogs')}
            >
              Pregnant Dogs ({pregnantCount})
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleGoToLitters}
            >
              Litter Management
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="active-whelping">Active Whelping</TabsTrigger>
            <TabsTrigger value="pregnant-dogs">Pregnant Dogs</TabsTrigger>
            <TabsTrigger value="litter-overview">Litter Overview</TabsTrigger>
            <TabsTrigger value="breeding-prep">Breeding Prep</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active-whelping" className="pt-6">
            <ActiveWelpingsTab litters={activeLitters} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="pregnant-dogs" className="pt-6">
            <PregnantDogsTab isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="litter-overview" className="pt-6">
            <LitterOverviewTab />
          </TabsContent>
          
          <TabsContent value="breeding-prep" className="pt-6">
            <BreedingPrepTab />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default WelpingManagementPage;
