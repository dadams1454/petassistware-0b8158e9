
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PuppyWeightChart from '../../PuppyWeightChart';
import GenderDistributionChart from '../../GenderDistributionChart';
import ColorDistributionChart from '../../ColorDistributionChart';
import LitterStatistics from '../../LitterStatistics';

interface AnalyticsTabsProps {
  puppies: any[];
  litterName: string;
  tabValue: string;
  setTabValue: (value: string) => void;
}

const AnalyticsTabs: React.FC<AnalyticsTabsProps> = ({ 
  puppies, 
  litterName, 
  tabValue, 
  setTabValue 
}) => {
  return (
    <Tabs 
      value={tabValue} 
      onValueChange={setTabValue} 
      className="w-full"
    >
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="weights">Weights</TabsTrigger>
        <TabsTrigger value="gender">Gender</TabsTrigger>
        <TabsTrigger value="colors">Colors</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <div className="space-y-6">
          <LitterStatistics 
            puppies={puppies} 
            title={`Overview: ${litterName || 'Litter'}`}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GenderDistributionChart puppies={puppies} />
            <ColorDistributionChart puppies={puppies} />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="weights">
        <PuppyWeightChart 
          puppies={puppies} 
          title={`Weight Analysis: ${litterName || 'Litter'}`}
        />
      </TabsContent>
      
      <TabsContent value="gender">
        <GenderDistributionChart 
          puppies={puppies} 
          title={`Gender Distribution: ${litterName || 'Litter'}`}
        />
      </TabsContent>
      
      <TabsContent value="colors">
        <ColorDistributionChart 
          puppies={puppies} 
          title={`Color Distribution: ${litterName || 'Litter'}`}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsTabs;
