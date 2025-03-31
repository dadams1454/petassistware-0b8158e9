
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HeatCycleManagement from '@/components/dogs/components/HeatCycleManagement';
import { Dog } from '@/types/dog';

interface BreedingManagementProps {
  dog: Dog;
  onRefresh?: () => void;
}

const BreedingManagement: React.FC<BreedingManagementProps> = ({ dog, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('heat-cycles');
  
  const handleRefresh = () => {
    if (onRefresh) onRefresh();
  };
  
  // Only show heat cycle management for female dogs
  const showHeatCycles = dog.gender === 'female';
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Breeding Management</CardTitle>
        <CardDescription>
          Track breeding history, heat cycles, and manage breeding plans
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs 
          defaultValue={showHeatCycles ? 'heat-cycles' : 'breeding-history'} 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-2">
            {showHeatCycles && (
              <TabsTrigger value="heat-cycles">Heat Cycles</TabsTrigger>
            )}
            <TabsTrigger value="breeding-history">Breeding History</TabsTrigger>
            <TabsTrigger value="sire-analysis">Genetic Analysis</TabsTrigger>
          </TabsList>
          
          {showHeatCycles && (
            <TabsContent value="heat-cycles">
              <HeatCycleManagement
                dogId={dog.id}
              />
            </TabsContent>
          )}
          
          <TabsContent value="breeding-history">
            <div className="py-8 text-center text-muted-foreground">
              <p>No breeding history recorded for this dog.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="sire-analysis">
            <div className="py-8 text-center text-muted-foreground">
              <p>Genetic compatibility analysis coming soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BreedingManagement;
