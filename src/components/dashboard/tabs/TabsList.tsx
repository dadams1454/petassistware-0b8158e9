
import React, { useState } from 'react';
import { Tabs, TabsList as ShadTabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import PottyBreaksTab from './PottyBreaksTab';
import ExerciseTab from './ExerciseTab';
import MedicationsTab from './MedicationsTab';
import GroomingTab from './GroomingTab';
import DailyCareTab from './DailyCareTab';

interface TabsListProps {
  isLoading?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const TabsList: React.FC<TabsListProps> = ({ 
  isLoading = false, 
  onRefresh,
  isRefreshing = false
}) => {
  const [activeTab, setActiveTab] = useState('daily-care');

  return (
    <Card>
      <CardHeader className="px-6 py-4 border-b bg-muted/50">
        <Tabs defaultValue="daily-care" value={activeTab} onValueChange={setActiveTab}>
          <ShadTabsList className="w-full">
            <TabsTrigger value="daily-care">Daily Care</TabsTrigger>
            <TabsTrigger value="potty-breaks">Potty Breaks</TabsTrigger>
            <TabsTrigger value="exercise">Exercise</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="grooming">Grooming</TabsTrigger>
          </ShadTabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="px-2 py-2 sm:p-6">
        <Tabs value={activeTab}>
          <TabsContent value="daily-care" className="mt-0">
            <DailyCareTab 
              onRefreshDogs={onRefresh || (() => {})}
              isRefreshing={isRefreshing}
            />
          </TabsContent>
          
          <TabsContent value="potty-breaks" className="mt-0">
            <PottyBreaksTab />
          </TabsContent>
          
          <TabsContent value="exercise" className="mt-0">
            <ExerciseTab />
          </TabsContent>
          
          <TabsContent value="medications" className="mt-0">
            <MedicationsTab />
          </TabsContent>
          
          <TabsContent value="grooming" className="mt-0">
            <GroomingTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TabsList;
