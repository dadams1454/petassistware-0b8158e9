
import React from 'react';
import { useHealthTabContext } from './HealthTabContext';
import { LoadingState } from '@/components/ui/standardized';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SummaryTabContent from './SummaryTabContent';
import VaccinationsTabContent from './VaccinationsTabContent';
import ExaminationsTabContent from './ExaminationsTabContent';
import MedicationsTabContent from './MedicationsTabContent';
import WeightTabContent from './WeightTabContent';
import HealthIndicatorDashboard from '../../health/HealthIndicatorDashboard';

const HealthTabContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isLoading,
    openAddHealthIndicatorDialog 
  } = useHealthTabContext();
  
  if (isLoading) {
    return <LoadingState message="Loading health data..." />;
  }
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="indicators">Health Indicators</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="examinations">Examinations</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4 pt-4">
          <SummaryTabContent />
        </TabsContent>
        
        <TabsContent value="indicators" className="space-y-4 pt-4">
          <HealthIndicatorDashboard 
            dogId={useHealthTabContext().dogId} 
            onAddClick={openAddHealthIndicatorDialog}
          />
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
    </div>
  );
};

export default HealthTabContent;
