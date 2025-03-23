
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Users, Scale, Palette } from 'lucide-react';
import PuppyCountsChart from './charts/PuppyCountsChart';
import WeightComparisonChart from './charts/WeightComparisonChart';
import ColorDistributionChart from './charts/ColorDistributionChart';

interface ComparisonTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  puppiesPerLitterData: any[];
  weightComparisonData: any[];
  colorDistributionData: any[];
  colors: string[];
}

const ComparisonTabs: React.FC<ComparisonTabsProps> = ({
  activeTab,
  setActiveTab,
  puppiesPerLitterData,
  weightComparisonData,
  colorDistributionData,
  colors
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="counts" className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Puppy Counts</span>
        </TabsTrigger>
        <TabsTrigger value="weights" className="flex items-center gap-1">
          <Scale className="h-4 w-4" />
          <span className="hidden sm:inline">Weight Comparison</span>
        </TabsTrigger>
        <TabsTrigger value="colors" className="flex items-center gap-1">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Color Distribution</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="counts">
        <PuppyCountsChart data={puppiesPerLitterData} />
      </TabsContent>
      
      <TabsContent value="weights">
        <WeightComparisonChart data={weightComparisonData} />
      </TabsContent>
      
      <TabsContent value="colors">
        <ColorDistributionChart data={colorDistributionData} colors={colors} />
      </TabsContent>
    </Tabs>
  );
};

export default ComparisonTabs;
