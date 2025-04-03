
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Baby, Clock, ArrowLeft } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { PageHeader, LoadingState, ErrorState } from '@/components/ui/standardized';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/common/PageContainer';
import { useReproductiveCycle } from '@/hooks/useReproductiveCycle';
import { ReproductiveStatus } from '@/types/reproductive';
import HeatCycleTracker from '../components/HeatCycleTracker';
import BreedingManagement from '../components/BreedingManagement';
import PregnancyTracker from '../components/PregnancyTracker';
import ReproductiveTimeline from '../components/ReproductiveTimeline';
import ReproductiveStatusCard from '../components/ReproductiveStatusCard';

const ReproductiveCyclePage: React.FC = () => {
  const { dogId } = useParams<{ dogId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    data: reproData, 
    isLoading, 
    error, 
    refetch 
  } = useReproductiveCycle(dogId);
  
  const handleBackClick = () => {
    navigate(`/dogs/${dogId}`);
  };
  
  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState message="Loading reproductive data..." />
      </PageContainer>
    );
  }
  
  if (error || !reproData) {
    return (
      <PageContainer>
        <ErrorState 
          title="Error" 
          message="Could not load reproductive data. Please try again." 
          onRetry={refetch}
        />
      </PageContainer>
    );
  }
  
  if (reproData.dog.gender !== 'Female') {
    return (
      <PageContainer>
        <div className="container mx-auto py-6">
          <Button variant="ghost" onClick={handleBackClick} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dog Profile
          </Button>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-4">
            <h2 className="text-xl font-bold text-amber-800 mb-2">Male Dogs</h2>
            <p className="text-amber-700">
              Reproductive cycle management is only available for female dogs.
              For male dogs, please use the breeding management section on the dog profile page.
            </p>
            <Button 
              onClick={() => navigate(`/dogs/${dogId}`)} 
              className="mt-4 bg-amber-600 hover:bg-amber-700"
            >
              Return to Dog Profile
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  const dogWithRequiredFields = {
    ...reproData.dog,
    created_at: reproData.dog.created_at || new Date().toISOString(),
  };

  return (
    <PageContainer>
      <div className="container mx-auto py-6 space-y-6">
        <Button variant="ghost" onClick={handleBackClick} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dog Profile
        </Button>
        
        <PageHeader 
          title="Reproductive Management"
          subtitle={`${dogWithRequiredFields.name} • ${dogWithRequiredFields.breed}`}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ReproductiveStatusCard 
            dog={dogWithRequiredFields}
            status={reproData.status}
            nextHeatDate={reproData.nextHeatDate}
            daysUntilNextHeat={reproData.daysUntilNextHeat}
            averageCycleLength={reproData.averageCycleLength}
            currentHeatStage={reproData.currentStage}
            fertilityWindow={reproData.fertilityWindow}
            gestationDays={reproData.gestationDays}
            estimatedDueDate={reproData.estimatedDueDate}
          />
          
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="heat">
                  <Clock className="h-4 w-4 mr-2" />
                  Heat Tracking
                </TabsTrigger>
                <TabsTrigger value="breeding">
                  <Calendar className="h-4 w-4 mr-2" />
                  Breeding
                </TabsTrigger>
                <TabsTrigger value="pregnancy">
                  <Baby className="h-4 w-4 mr-2" />
                  Pregnancy
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <ReproductiveTimeline 
                  heatCycles={reproData.heatCycles}
                  breedingRecords={reproData.breedingRecords}
                  pregnancyRecords={reproData.pregnancyRecords}
                  milestones={reproData.milestones}
                />
              </TabsContent>
              
              <TabsContent value="heat" className="mt-6">
                <HeatCycleTracker 
                  dog={dogWithRequiredFields}
                  heatCycles={reproData.heatCycles}
                  status={reproData.status as ReproductiveStatus}
                  currentHeatCycle={reproData.currentHeatCycle}
                  currentHeatStage={reproData.currentStage}
                  fertilityWindow={reproData.fertilityWindow}
                  nextHeatDate={reproData.nextHeatDate}
                  averageCycleLength={reproData.averageCycleLength}
                />
              </TabsContent>
              
              <TabsContent value="breeding" className="mt-6">
                <BreedingManagement 
                  dog={dogWithRequiredFields}
                  status={reproData.status as ReproductiveStatus}
                  heatCycles={reproData.heatCycles}
                  breedingRecords={reproData.breedingRecords}
                  currentHeatCycle={reproData.currentHeatCycle}
                />
              </TabsContent>
              
              <TabsContent value="pregnancy" className="mt-6">
                <PregnancyTracker 
                  dog={dogWithRequiredFields}
                  status={reproData.status as ReproductiveStatus}
                  pregnancyRecords={reproData.pregnancyRecords}
                  breedingRecords={reproData.breedingRecords}
                  estimatedDueDate={reproData.estimatedDueDate}
                  gestationDays={reproData.gestationDays}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ReproductiveCyclePage;
