
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DogProfile } from '../types/dog';
import DogOverviewTab from './tabs/DogOverviewTab';
import DogHealthTab from './tabs/DogHealthTab';
import DogNotesTab from './tabs/DogNotesTab';

interface DogTabsProps {
  dog: DogProfile;
  dogId: string;
}

const DogTabs: React.FC<DogTabsProps> = ({ dog, dogId }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Tabs 
      defaultValue="overview" 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="health">Health</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <DogOverviewTab dog={dog} />
      </TabsContent>
      
      <TabsContent value="health" className="space-y-4">
        <DogHealthTab dog={dog} dogId={dogId} />
      </TabsContent>
      
      <TabsContent value="notes" className="space-y-4">
        <DogNotesTab dog={dog} dogId={dogId} />
      </TabsContent>
    </Tabs>
  );
};

export default DogTabs;
