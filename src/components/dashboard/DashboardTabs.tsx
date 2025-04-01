
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { DogLetOutTab } from './tabs/DogLetOutTab';
import { FeedingTab } from './tabs/FeedingTab';
import { MedicationsTab } from './tabs/MedicationsTab';
import { GroomingTab } from './tabs/GroomingTab';
import { DailyCareTab } from './tabs/DailyCareTab';
import { NotesTab } from './tabs/NotesTab';
import { PottyBreaksTab } from './tabs/PottyBreaksTab';
import { ExerciseTab } from './tabs/ExerciseTab';
import { TrainingTab } from './tabs/TrainingTab';
import { PuppiesTab } from './tabs/PuppiesTab';
import { FacilityTab } from './tabs/FacilityTab';
import { KennelTab } from './tabs/KennelTab';
import TabsList from './tabs/TabsList';

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState('daily-care');
  const isMobile = useIsMobile();

  return (
    <div className="mt-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList activeTab={activeTab} />
        
        <TabsContent value="daily-care" className="mt-6">
          <DailyCareTab />
        </TabsContent>
        
        <TabsContent value="feeding" className="mt-6">
          <FeedingTab />
        </TabsContent>
        
        <TabsContent value="medications" className="mt-6">
          <MedicationsTab />
        </TabsContent>
        
        <TabsContent value="potty-breaks" className="mt-6">
          <PottyBreaksTab />
        </TabsContent>
        
        <TabsContent value="exercise" className="mt-6">
          <ExerciseTab />
        </TabsContent>
        
        <TabsContent value="grooming" className="mt-6">
          <GroomingTab />
        </TabsContent>
        
        <TabsContent value="training" className="mt-6">
          <TrainingTab />
        </TabsContent>
        
        <TabsContent value="let-out" className="mt-6">
          <DogLetOutTab />
        </TabsContent>
        
        <TabsContent value="notes" className="mt-6">
          <NotesTab />
        </TabsContent>
        
        <TabsContent value="puppies" className="mt-6">
          <PuppiesTab />
        </TabsContent>
        
        <TabsContent value="facility" className="mt-6">
          <FacilityTab />
        </TabsContent>
        
        <TabsContent value="kennel" className="mt-6">
          <KennelTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardTabs;
