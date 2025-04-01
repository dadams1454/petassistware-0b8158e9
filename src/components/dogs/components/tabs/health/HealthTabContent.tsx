import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { useHealthTabContext } from './HealthTabContext';
import HealthIndicatorDashboard from '../../health/HealthIndicatorDashboard';
import { Separator } from '@/components/ui/separator';

const HealthTabContent: React.FC = () => {
  const { dogId } = useHealthTabContext();
  
  return (
    <TabsContent value="health" className="space-y-8">
      <HealthIndicatorDashboard dogId={dogId} />
      
      <Separator className="my-6" />
      
      {/* Other health-related sections can be added here */}
    </TabsContent>
  );
};

export default HealthTabContent;
