
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { useHealthTabContext } from './HealthTabContext';
import { Separator } from '@/components/ui/separator';
import HealthIndicatorDashboard from '../../health/HealthIndicatorDashboard';
import MedicationTracker from '../../health/MedicationTracker';

const HealthTabContent: React.FC = () => {
  const { dogId, isLoading } = useHealthTabContext();
  
  if (isLoading) {
    return (
      <TabsContent value="health" className="space-y-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </TabsContent>
    );
  }
  
  return (
    <TabsContent value="health" className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Health Indicators</h3>
        <HealthIndicatorDashboard dogId={dogId} />
      </div>
      
      <Separator className="my-6" />
      
      <div>
        <h3 className="text-lg font-medium mb-4">Medication Schedule</h3>
        <MedicationTracker dogId={dogId} />
      </div>
    </TabsContent>
  );
};

export default HealthTabContent;
