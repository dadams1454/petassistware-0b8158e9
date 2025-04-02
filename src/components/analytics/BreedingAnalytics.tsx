
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PuppyWeightChart from './PuppyWeightChart';
import GenderDistributionChart from './GenderDistributionChart';
import ColorDistributionChart from './ColorDistributionChart';
import LitterStatistics from './LitterStatistics';
import LitterComparison from './LitterComparison';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, BarChart, ArrowLeftRight } from 'lucide-react';
import { Puppy } from '@/types/litter';

interface BreedingAnalyticsProps {
  className?: string;
}

interface LitterData {
  id: string;
  litter_name: string | null;
  birth_date: string;
  dam: {
    id: string;
    name: string;
  } | null;
  sire: {
    id: string;
    name: string;
  } | null;
  puppies: Puppy[];
}

const BreedingAnalytics: React.FC<BreedingAnalyticsProps> = ({ className }) => {
  const [selectedLitterId, setSelectedLitterId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('single-litter');

  // Fetch all litters with puppies data
  const { data: litters, isLoading: isLoadingLitters, error: littersError } = useQuery({
    queryKey: ['litters-with-puppies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('litters')
        .select(`
          id,
          litter_name,
          birth_date,
          dam:dogs!litters_dam_id_fkey(id, name),
          sire:dogs!litters_sire_id_fkey(id, name),
          puppies:puppies!puppies_litter_id_fkey(*)
        `)
        .order('birth_date', { ascending: false });

      if (error) throw error;
      return (data as unknown) as LitterData[] || [];
    }
  });

  // Set the first litter as selected when data loads
  useEffect(() => {
    if (litters && litters.length > 0 && !selectedLitterId) {
      setSelectedLitterId(litters[0].id);
    }
  }, [litters, selectedLitterId]);

  // Get the selected litter data
  const selectedLitter = litters?.find(litter => litter.id === selectedLitterId);
  
  // Make sure we properly handle the gender typing when processing puppies
  const puppies: Puppy[] = selectedLitter?.puppies 
    ? selectedLitter.puppies.map(puppy => ({
        ...puppy,
        gender: (puppy.gender === 'Male' || puppy.gender === 'Female') ? puppy.gender : 'Male',
        status: (puppy.status === 'Available' || puppy.status === 'Reserved' || 
                puppy.status === 'Sold' || puppy.status === 'Unavailable') 
                ? puppy.status : 'Available'
      }))
    : [];

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
              {/* Litter Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Litter:</label>
                <Select
                  value={selectedLitterId || ''}
                  onValueChange={(value) => setSelectedLitterId(value)}
                  disabled={isLoadingLitters || (litters && litters.length === 0)}
                >
                  <SelectTrigger className="w-full md:w-[350px]">
                    <SelectValue placeholder="Select a litter to view analytics" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingLitters ? (
                      <SelectItem value="loading" disabled>Loading litters...</SelectItem>
                    ) : litters && litters.length > 0 ? (
                      litters.map(litter => (
                        <SelectItem key={litter.id} value={litter.id}>
                          {litter.litter_name || `${litter.dam?.name || 'Unknown'} × ${litter.sire?.name || 'Unknown'}`}
                          {' '}
                          ({litter.puppies?.length || 0} puppies)
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No litters available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Single Litter Analytics Tabs */}
              {selectedLitter ? (
                <Tabs defaultValue="overview" className="w-full">
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
                        title={`Overview: ${selectedLitter.litter_name || 'Litter'}`}
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
                      title={`Weight Analysis: ${selectedLitter.litter_name || 'Litter'}`}
                    />
                  </TabsContent>
                  
                  <TabsContent value="gender">
                    <GenderDistributionChart 
                      puppies={puppies} 
                      title={`Gender Distribution: ${selectedLitter.litter_name || 'Litter'}`}
                    />
                  </TabsContent>
                  
                  <TabsContent value="colors">
                    <ColorDistributionChart 
                      puppies={puppies} 
                      title={`Color Distribution: ${selectedLitter.litter_name || 'Litter'}`}
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  {isLoadingLitters ? (
                    <p className="text-muted-foreground">Loading litter data...</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-muted-foreground">No litter selected or available.</p>
                      <p className="text-sm text-muted-foreground">
                        Please add litters and puppy data to see breeding analytics.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <LitterComparison />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BreedingAnalytics;
