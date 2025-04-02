
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionHeader, LoadingState, ErrorState } from '@/components/ui/standardized';
import { HealthTabProvider, useHealthTabContext } from './health/HealthTabContext';
import SummaryTabContent from './health/SummaryTabContent';
import VaccinationsTabContent from './health/VaccinationsTabContent';
import ExaminationsTabContent from './health/ExaminationsTabContent';
import MedicationsTabContent from './health/MedicationsTabContent';
import WeightTabContent from './health/WeightTabContent';
import HealthTabActions from './health/HealthTabActions';
import HealthTabDialogs from './health/HealthTabDialogs';
import { HealthTabProps } from '../profile/DogProfileTabs';

// Inner component to use context
const HealthTabContent: React.FC = () => {
  const { activeTab, setActiveTab, isLoading } = useHealthTabContext();
  
  if (isLoading) {
    return <LoadingState message="Loading health data..." />;
  }
  
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Health Records"
        description="Track vaccinations, examinations, medications, and weight over time"
      />
      
      <HealthTabActions />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="examinations">Examinations</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4 pt-4">
          <SummaryTabContent />
        </TabsContent>
        
        <TabsContent value="vaccinations" className="pt-4">
          <VaccinationsTabContent />
        </TabsContent>
        
        <TabsContent value="examinations" className="pt-4">
          <ExaminationsTabContent />
        </TabsContent>
        
        <TabsContent value="medications" className="pt-4">
          <MedicationsTabContent />
        </TabsContent>
        
        <TabsContent value="weight" className="pt-4">
          <WeightTabContent />
        </TabsContent>
      </Tabs>
      
      <HealthTabDialogs />
    </div>
  );
};

// Main component that wraps everything with the provider
const HealthTab: React.FC<HealthTabProps> = ({ dogId }) => {
  return (
    <HealthTabProvider dogId={dogId}>
      <HealthTabContent />
    </HealthTabProvider>
  );
};

export default HealthTab;
