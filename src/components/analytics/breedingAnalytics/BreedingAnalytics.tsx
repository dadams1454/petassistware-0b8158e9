
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle, BarChart, ArrowLeftRight } from 'lucide-react';
import LitterSelector from './components/LitterSelector';
import SingleLitterAnalytics from './components/SingleLitterAnalytics';
import LitterComparison from '../LitterComparison';
import useLittersData from './hooks/useLittersData';
import { BreedingAnalyticsProps } from './types';

const BreedingAnalytics: React.FC<BreedingAnalyticsProps> = ({ className }) => {
  const [selectedLitterId, setSelectedLitterId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('single-litter');

  const { litters, isLoadingLitters, littersError } = useLittersData();

  // Set the first litter as selected when data loads
  useEffect(() => {
    if (litters && litters.length > 0 && !selectedLitterId) {
      setSelectedLitterId(litters[0].id);
    }
  }, [litters]);

  // Get the selected litter data with null safety
  const selectedLitter = litters?.find(litter => litter.id === selectedLitterId) || null;
  const puppies = selectedLitter?.puppies || [];

  // Top-level loading state
  if (isLoadingLitters) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading breeding data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (littersError) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-500 mb-4">
            <AlertCircle className="h-5 w-5" />
            <p>Error loading breeding data. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Breeding Analytics</h2>
          
          {/* Analytics Type Tabs */}
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="mb-6"
          >
            <TabsList className="grid grid-cols-2 w-full sm:w-[400px]">
              <TabsTrigger value="single-litter" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span>Single Litter Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="dam-comparison" className="flex items-center gap-1">
                <ArrowLeftRight className="h-4 w-4" />
                <span>Dam Litter Comparison</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {activeTab === 'single-litter' ? (
            <>
              <LitterSelector 
                litters={litters || []}
                selectedLitterId={selectedLitterId}
                setSelectedLitterId={setSelectedLitterId}
                isLoadingLitters={isLoadingLitters}
              />

              <SingleLitterAnalytics 
                selectedLitter={selectedLitter} 
                puppies={puppies}
                isLoadingLitters={isLoadingLitters}
              />
            </>
          ) : (
            <LitterComparison litters={litters || []} isLoading={isLoadingLitters} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BreedingAnalytics;
