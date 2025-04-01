
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { useHealthTabContext } from './HealthTabContext';
import HealthIndicatorDashboard from '../../health/HealthIndicatorDashboard';

const HealthTabContent: React.FC = () => {
  const { dogId } = useHealthTabContext();
  
  return (
    <div className="space-y-8">
      <HealthIndicatorDashboard dogId={dogId} />
    </div>
  );
};

export default HealthTabContent;
