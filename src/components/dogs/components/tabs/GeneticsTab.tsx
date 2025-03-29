
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogGenetics } from '@/hooks/useDogGenetics';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDogDetail } from '@/components/dogs/hooks/useDogDetail';

// Import genetics components
import { DogGenotypeCard } from '@/components/genetics/DogGenotypeCard';
import { GeneticTestsManager } from '@/components/genetics/components/GeneticTestsManager';
import { InteractivePedigree } from '@/components/genetics/components/InteractivePedigree';
import { HistoricalCOIChart } from '@/components/genetics/components/HistoricalCOIChart';
import { MultiTraitMatrix } from '@/components/genetics/components/MultiTraitMatrix';
import { GeneticReportGenerator } from '@/components/genetics/components/GeneticReportGenerator';

export interface GeneticsTabProps {
  dogId: string;
  dogName?: string;
}

const GeneticsTab: React.FC<GeneticsTabProps> = ({ dogId, dogName }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { geneticData, loading, error, refresh } = useDogGenetics(dogId);
  const { dog } = useDogDetail(dogId);
  
  const navigateToPairingTool = () => {
    navigate('/genetics/pairing?sireId=' + (dog?.gender === 'male' ? dogId : '') + 
             '&damId=' + (dog?.gender === 'female' ? dogId : ''));
  };

  // If we're still loading or there's an error, show appropriate UI
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-64 bg-gray-200 rounded-md"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 border rounded-md">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">Error Loading Genetic Data</h3>
        <p className="text-sm text-gray-600 mb-4">
          There was a problem loading the genetic data for this dog.
        </p>
        <Button onClick={() => refresh()}>Retry</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tests">Tests & Results</TabsTrigger>
          <TabsTrigger value="pedigree">Pedigree Analysis</TabsTrigger>
          <TabsTrigger value="traits">Trait Analysis</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DogGenotypeCard dogId={dogId} showHealthTests showColorTraits />
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Breeding Recommendations</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Analyze genetic compatibility with potential mates to predict offspring traits
                  and assess health risks.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={navigateToPairingTool}>
                    Find Compatible Matches
                  </Button>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Genetic Information
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <HistoricalCOIChart dogId={dogId} />
        </TabsContent>
        
        {/* Tests & Results Tab */}
        <TabsContent value="tests" className="space-y-6">
          <GeneticTestsManager dogId={dogId} dogName={dogName} />
        </TabsContent>
        
        {/* Pedigree Analysis Tab */}
        <TabsContent value="pedigree" className="space-y-6">
          <InteractivePedigree dogId={dogId} generations={3} />
        </TabsContent>
        
        {/* Trait Analysis Tab */}
        <TabsContent value="traits" className="space-y-6">
          <MultiTraitMatrix dogId={dogId} dogGenetics={geneticData} />
        </TabsContent>
        
        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <GeneticReportGenerator 
            dogId={dogId} 
            dogName={dogName} 
            dogGenetics={geneticData} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeneticsTab;
