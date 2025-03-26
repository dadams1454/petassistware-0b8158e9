
import React, { useState } from 'react';
import DailyCareLogs from '../care/DailyCareLogs';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FeedingManagementTab from '../care/feeding/FeedingManagementTab';

interface DailyCareTabProps {
  dogId: string;
  dogName?: string;
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ dogId, dogName = 'Dog' }) => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">General Care</TabsTrigger>
          <TabsTrigger value="feeding">Feeding</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <DailyCareLogs dogId={dogId} />
        </TabsContent>
        
        <TabsContent value="feeding">
          <FeedingManagementTab dogId={dogId} dogName={dogName} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DailyCareTab;
