
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogGenetics } from '@/hooks/useDogGenetics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Dna, AlertCircle, FileText, ExternalLink, FileUp, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import { useDogDetail } from '@/components/dogs/hooks/useDogDetail';
import { formatDistanceToNow } from 'date-fns';

// Import genetics components
import { DogGenotypeCard } from '@/components/genetics/DogGenotypeCard';
import { GeneticTestsManager } from '@/components/genetics/components/GeneticTestsManager';
import { InteractivePedigree } from '@/components/genetics/components/InteractivePedigree';
import { HistoricalCOIChart } from '@/components/genetics/components/HistoricalCOIChart';
import { MultiTraitMatrix } from '@/components/genetics/components/MultiTraitMatrix';
import GeneticReportGenerator from '@/components/genetics/components/GeneticReportGenerator';
import { GeneticImportDialog } from '@/components/genetics/components/GeneticImportDialog';
import { generateRiskAssessment } from '@/components/genetics/utils/healthUtils';
import { CompactGenotypeView } from '@/components/genetics/DogGenotypeCard';

export interface GeneticsTabProps {
  dogId: string;
  dogName?: string;
}

const GeneticAnalysisTab: React.FC<GeneticsTabProps> = ({ dogId, dogName }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { geneticData, loading, error, refresh, breedRisks, lastUpdated } = useDogGenetics(dogId);
  const { dog } = useDogDetail(dogId);
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  
  const handleDataChanged = useCallback(() => {
    refresh();
    toast({
      title: 'Genetic data updated',
      description: 'The genetic profile has been refreshed with the latest data.',
    });
  }, [refresh, toast]);
  
  const navigateToPairingTool = () => {
    navigate('/genetics/pairing?sireId=' + (dog?.gender === 'male' ? dogId : '') + 
             '&damId=' + (dog?.gender === 'female' ? dogId : ''));
  };

  // Generate risk assessment if we have genetic data
  const riskAssessment = React.useMemo(() => {
    if (dog?.breed && geneticData?.healthMarkers) {
      return generateRiskAssessment(dog.breed, geneticData.healthMarkers);
    }
    return null;
  }, [dog?.breed, geneticData?.healthMarkers]);

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Genetic Profile</h2>
          <p className="text-muted-foreground">
            Genetic information and breeding compatibility for {dogName || 'this dog'}
          </p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {formatDistanceToNow(new Date(lastUpdated))} ago
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={refresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsImportDialogOpen(true)}>
            <FileUp className="h-4 w-4 mr-2" />
            Import Data
          </Button>
        </div>
      </div>
      
      {riskAssessment?.hasIssues && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            {riskAssessment.affectedConditions.length > 0 && (
              <p>This dog is affected by: <strong>{riskAssessment.affectedConditions.join(', ')}</strong></p>
            )}
            {riskAssessment.carrierConditions.length > 0 && (
              <p>This dog is a carrier for: <strong>{riskAssessment.carrierConditions.join(', ')}</strong></p>
            )}
            {riskAssessment.missingTests.length > 0 && (
              <p>Recommended tests for this breed: <strong>{riskAssessment.missingTests.join(', ')}</strong></p>
            )}
          </AlertDescription>
        </Alert>
      )}
      
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
              <CardHeader className="pb-0">
                <CardTitle>Breeding Recommendations</CardTitle>
                <CardDescription>
                  Analyze genetic compatibility with potential mates
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {breedRisks.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Breed-Specific Health Considerations</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {breedRisks.map((risk, index) => (
                        <li key={index}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button onClick={navigateToPairingTool}>
                    Find Compatible Matches
                  </Button>
                  <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
                    <FileUp className="mr-2 h-4 w-4" />
                    Import Genetic Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <HistoricalCOIChart dogId={dogId} />
        </TabsContent>
        
        {/* Tests & Results Tab */}
        <TabsContent value="tests" className="space-y-6">
          <GeneticTestsManager 
            dogId={dogId} 
            dogName={dogName} 
            onDataChanged={handleDataChanged}
          />
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
      
      <GeneticImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        dogId={dogId}
        onImportComplete={handleDataChanged}
      />
    </div>
  );
};

export default GeneticAnalysisTab;
