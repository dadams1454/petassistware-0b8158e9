
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Users, Scale, Palette } from 'lucide-react';
import PuppyCountsTab from './PuppyCountsTab';
import WeightComparisonTab from './WeightComparisonTab';
import ColorDistributionTab from './ColorDistributionTab';
import { useChartData } from '../hooks/useChartData';

interface ComparisonTabsProps {
  litterDetails: any[] | undefined;
  isLoadingLitters: boolean;
}

const ComparisonTabs: React.FC<ComparisonTabsProps> = ({ 
  litterDetails,
  isLoadingLitters
}) => {
  const { puppiesPerLitterData, weightComparisonData, colorDistributionData, COLORS } = 
    useChartData(litterDetails);
  
  return (
    <Tabs defaultValue="counts" className="w-full">
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
        <PuppyCountsTab 
          isLoadingLitters={isLoadingLitters} 
          puppiesPerLitterData={puppiesPerLitterData} 
        />
      </TabsContent>
      
      <TabsContent value="weights">
        <WeightComparisonTab 
          isLoadingLitters={isLoadingLitters} 
          weightComparisonData={weightComparisonData} 
        />
      </TabsContent>
      
      <TabsContent value="colors">
        <ColorDistributionTab 
          isLoadingLitters={isLoadingLitters} 
          colorDistributionData={colorDistributionData} 
          colors={COLORS}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ComparisonTabs;
