
import React, { useState } from 'react';
import { useDogGenetics } from '@/hooks/useDogGenetics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Dna, 
  AlertCircle, 
  FileUp, 
  RefreshCw, 
  Beaker,
  Dices
} from 'lucide-react';
import { LoadingState, ErrorState } from '@/components/ui/standardized';
import { GeneticImportDialog } from '@/components/genetics/GeneticImportDialog';
import { CompactGenotypeView } from '@/components/genetics/DogGenotypeCard';
import { format } from 'date-fns';
import { generateRiskAssessment } from '@/components/genetics/utils/healthUtils';

interface GeneticAnalysisTabProps {
  dogId: string;
  currentDog: any;
}

const GeneticAnalysisTab: React.FC<GeneticAnalysisTabProps> = ({ dogId, currentDog }) => {
  const { geneticData, loading, error, refresh, breedRisks, lastUpdated } = useDogGenetics(dogId);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  
  // Calculate risk assessment if we have genetic data
  const riskAssessment = React.useMemo(() => {
    if (currentDog?.breed && geneticData?.healthMarkers) {
      return generateRiskAssessment(currentDog.breed, geneticData.healthMarkers);
    }
    return null;
  }, [currentDog?.breed, geneticData?.healthMarkers]);
  
  const handleImportComplete = () => {
    refresh();
    setIsImportDialogOpen(false);
  };
  
  if (loading) {
    return <LoadingState message="Loading genetic data..." />;
  }
  
  if (error) {
    return (
      <ErrorState 
        title="Error Loading Genetic Data" 
        message="There was a problem retrieving genetic information."
        onRetry={refresh}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Genetic Analysis</h2>
          <p className="text-muted-foreground">
            View and manage genetic test results
          </p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {format(new Date(lastUpdated), 'PPP')}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={refresh} className="h-9">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsImportDialogOpen(true)} className="h-9">
            <FileUp className="h-4 w-4 mr-2" />
            Import Data
          </Button>
        </div>
      </div>
      
      {riskAssessment?.hasIssues && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
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
      
      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="traits">Traits & Color</TabsTrigger>
          <TabsTrigger value="tests">Test Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GenoTypeSummaryCard geneticData={geneticData} dogName={currentDog.name} />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-4 w-4 text-pink-500" />
                  Breed Health Considerations
                </CardTitle>
                <CardDescription>Common genetic conditions for {currentDog.breed}</CardDescription>
              </CardHeader>
              <CardContent>
                {breedRisks.length > 0 ? (
                  <ul className="space-y-2">
                    {breedRisks.map((risk, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No breed-specific conditions on record
                  </p>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => setIsImportDialogOpen(true)}
                >
                  <FileUp className="h-4 w-4 mr-2" />
                  Import Test Results
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="health" className="pt-4">
          <HealthMarkersPanel dogData={geneticData} />
        </TabsContent>
        
        <TabsContent value="traits" className="pt-4">
          <ColorTraitsPanel dogData={geneticData} currentDog={currentDog} />
        </TabsContent>
        
        <TabsContent value="tests" className="pt-4">
          <TestResultsPanel dogData={geneticData} />
        </TabsContent>
      </Tabs>
      
      <GeneticImportDialog 
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        dogId={dogId}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
};

// Helper components
const GenoTypeSummaryCard = ({ geneticData, dogName }: { geneticData: any; dogName: string }) => {
  if (!geneticData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Genetic Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No genetic data available for {dogName}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Count health conditions by status
  const healthCounts = {
    clear: 0,
    carrier: 0, 
    affected: 0,
    unknown: 0
  };
  
  geneticData.healthResults?.forEach((result: any) => {
    healthCounts[result.result]++;
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dna className="h-4 w-4 text-blue-500" />
          Genetic Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <CompactGenotypeView dogData={geneticData} />
          
          <div className="pt-2 border-t">
            <h3 className="text-sm font-semibold mb-2">Health Summary</h3>
            <div className="grid grid-cols-4 gap-2">
              <HealthCountBadge label="Clear" count={healthCounts.clear} color="bg-green-100 text-green-800" />
              <HealthCountBadge label="Carrier" count={healthCounts.carrier} color="bg-yellow-100 text-yellow-800" />
              <HealthCountBadge label="Affected" count={healthCounts.affected} color="bg-red-100 text-red-800" />
              <HealthCountBadge label="Unknown" count={healthCounts.unknown} color="bg-gray-100 text-gray-800" />
            </div>
          </div>
          
          {geneticData.inbreeding_coefficient && (
            <div className="pt-2 border-t">
              <h3 className="text-sm font-semibold mb-2">Genetic Diversity</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm">Inbreeding Coefficient</span>
                <span className="font-medium">{(geneticData.inbreeding_coefficient * 100).toFixed(1)}%</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const HealthCountBadge = ({ label, count, color }: { label: string; count: number; color: string }) => (
  <div className={`flex flex-col items-center justify-center p-2 rounded ${color}`}>
    <span className="text-xs">{label}</span>
    <span className="font-bold">{count}</span>
  </div>
);

const HealthMarkersPanel = ({ dogData }: { dogData: any }) => {
  if (!dogData || !dogData.healthResults || dogData.healthResults.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
        <p>No health marker data available</p>
      </div>
    );
  }
  
  // Group by status
  const groupedByStatus = {
    affected: dogData.healthResults.filter((r: any) => r.result === 'affected'),
    carrier: dogData.healthResults.filter((r: any) => r.result === 'carrier'),
    clear: dogData.healthResults.filter((r: any) => r.result === 'clear'),
    unknown: dogData.healthResults.filter((r: any) => r.result === 'unknown')
  };
  
  return (
    <div className="space-y-6">
      {groupedByStatus.affected.length > 0 && (
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="bg-red-50 dark:bg-red-900/20">
            <CardTitle className="text-lg text-red-800 dark:text-red-300">Affected Conditions</CardTitle>
            <CardDescription>
              This dog is affected by these genetic conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              {groupedByStatus.affected.map((result: any, index: number) => (
                <HealthResultItem key={index} result={result} />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {groupedByStatus.carrier.length > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-900">
          <CardHeader className="bg-yellow-50 dark:bg-yellow-900/20">
            <CardTitle className="text-lg text-yellow-800 dark:text-yellow-300">Carrier Status</CardTitle>
            <CardDescription>
              This dog is a carrier for these genetic conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              {groupedByStatus.carrier.map((result: any, index: number) => (
                <HealthResultItem key={index} result={result} />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {groupedByStatus.clear.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clear Results</CardTitle>
            <CardDescription>
              This dog has tested clear for these conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              {groupedByStatus.clear.map((result: any, index: number) => (
                <HealthResultItem key={index} result={result} />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const HealthResultItem = ({ result }: { result: any }) => {
  const statusColors = {
    clear: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    carrier: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    affected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    unknown: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
  };
  
  return (
    <li className="flex justify-between items-center">
      <div>
        <span className="font-medium">{result.condition}</span>
        {result.date && (
          <div className="text-xs text-muted-foreground">
            Tested: {new Date(result.date).toLocaleDateString()}
            {result.lab && ` by ${result.lab}`}
          </div>
        )}
      </div>
      <Badge variant="outline" className={statusColors[result.result]}>
        {result.result}
      </Badge>
    </li>
  );
};

const ColorTraitsPanel = ({ dogData, currentDog }: { dogData: any; currentDog: any }) => {
  if (!dogData) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
        <p>No color trait data available</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Color Genetics</CardTitle>
          <CardDescription>
            Genetic color traits for {currentDog.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(dogData.baseColor || dogData.agouti || dogData.dilution || dogData.brownDilution) ? (
            <div className="space-y-4">
              {dogData.baseColor && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Base Color</h4>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                    <div className="flex justify-between">
                      <span>{dogData.baseColor}</span>
                      <Badge variant="outline">{dogData.color?.phenotype}</Badge>
                    </div>
                  </div>
                </div>
              )}
              
              {dogData.agouti && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Agouti Series</h4>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                    {dogData.agouti}
                  </div>
                </div>
              )}
              
              {dogData.dilution && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Dilution</h4>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                    {dogData.dilution}
                  </div>
                </div>
              )}
              
              {dogData.brownDilution && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Brown/Chocolate</h4>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                    {dogData.brownDilution}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <Dices className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No detailed color genetics available
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Current color: {currentDog.color || 'Unknown'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Appearance Traits</CardTitle>
          <CardDescription>
            Physical traits determined by genetics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dogData.testResults && dogData.testResults.some((t: any) => !t.testType.toLowerCase().includes('health')) ? (
            <div className="space-y-2">
              {dogData.testResults
                .filter((t: any) => 
                  !t.testType.toLowerCase().includes('health') && 
                  !t.testType.toLowerCase().includes('genetic') &&
                  !t.testType.toLowerCase().includes('disease'))
                .map((trait: any, index: number) => (
                  <div key={index} className="p-2 border rounded-md">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{trait.testType}</span>
                      <span className="text-sm">{trait.result}</span>
                    </div>
                    {trait.testDate && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Tested: {new Date(trait.testDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <Dices className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No trait data available
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const TestResultsPanel = ({ dogData }: { dogData: any }) => {
  if (!dogData || !dogData.testResults || dogData.testResults.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
        <p>No genetic test results available</p>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Test Results</CardTitle>
        <CardDescription>
          Complete history of genetic testing for this dog
        </CardDescription>
      </CardHeader>
      <CardContent>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2 text-sm font-semibold">Test</th>
              <th className="p-2 text-sm font-semibold">Result</th>
              <th className="p-2 text-sm font-semibold">Date</th>
              <th className="p-2 text-sm font-semibold">Lab</th>
              <th className="p-2 text-sm font-semibold">Source</th>
            </tr>
          </thead>
          <tbody>
            {dogData.testResults.map((test: any, index: number) => (
              <tr key={index} className="border-b">
                <td className="p-2 text-sm">{test.testType}</td>
                <td className="p-2 text-sm font-medium">{test.result}</td>
                <td className="p-2 text-sm">
                  {test.testDate ? new Date(test.testDate).toLocaleDateString() : '-'}
                </td>
                <td className="p-2 text-sm">{test.labName || '-'}</td>
                <td className="p-2 text-sm">
                  <Badge variant="outline">
                    {test.importSource || 'manual'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default GeneticAnalysisTab;
