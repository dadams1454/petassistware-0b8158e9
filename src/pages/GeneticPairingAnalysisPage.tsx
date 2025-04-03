
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PageContainer from '@/components/common/PageContainer';
import { SectionHeader } from '@/components/ui/standardized';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Dna } from 'lucide-react';
import DogSelector from '@/components/litters/form/DogSelector';
import GeneticCompatibilityAnalyzer from '@/components/genetics/GeneticCompatibilityAnalyzer';
import PairingHealthSummary from '@/components/breeding/PairingHealthSummary';
import PairingColorAnalysis from '@/components/breeding/PairingColorAnalysis';
import useGeneticPairing from '@/hooks/useGeneticPairing';
import { useNavigate } from 'react-router-dom';

const GeneticPairingAnalysisPage: React.FC = () => {
  const [sireId, setSireId] = useState<string>('');
  const [damId, setDamId] = useState<string>('');
  const navigate = useNavigate();
  
  const { 
    healthRisks,
    colorProbabilities,
    inbreedingCoefficient,
    compatibilityScore,
    isLoading,
    hasData
  } = useGeneticPairing(sireId, damId);
  
  const handleCreateBreedingPlan = () => {
    // Navigate to breeding plan creation
    navigate(`/reproduction/breeding/create?sireId=${sireId}&damId=${damId}`);
  };
  
  return (
    <PageContainer>
      <div className="container mx-auto py-6 space-y-6">
        <SectionHeader
          title="Genetic Pairing Analysis"
          description="Analyze genetic compatibility between potential breeding pairs"
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Select Breeding Pair</CardTitle>
            <CardDescription>
              Choose a sire and dam to analyze their genetic compatibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Sire (Male)</label>
                <DogSelector
                  form={{ getValues: () => sireId, control: { name: 'sireId' } } as any}
                  name="sireId"
                  label=""
                  filterGender="Male"
                  onChange={setSireId}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Dam (Female)</label>
                <DogSelector
                  form={{ getValues: () => damId, control: { name: 'damId' } } as any}
                  name="damId"
                  label=""
                  filterGender="Female"
                  onChange={setDamId}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {sireId && damId && (
          <>
            {isLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center p-6">
                    <div className="animate-pulse text-center">
                      <Dna className="h-10 w-10 mb-4 mx-auto text-primary/50" />
                      <p className="text-muted-foreground">Analyzing genetic compatibility...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : hasData ? (
              <>
                <Card className="overflow-hidden">
                  <div className={`p-4 ${getCompatibilityScoreColor(compatibilityScore || 0)} text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Dna className="h-5 w-5 mr-2" />
                        <h3 className="text-lg font-semibold">Compatibility Score</h3>
                      </div>
                      <div>
                        <span className="text-2xl font-bold">{compatibilityScore}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Coefficient of Inbreeding (COI)</h4>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${getCOIColorClass(inbreedingCoefficient || 0)}`} 
                              style={{ width: `${Math.min(100, (inbreedingCoefficient || 0) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-medium">{(inbreedingCoefficient || 0).toFixed(2)}%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {getCOIDescription(inbreedingCoefficient || 0)}
                        </p>
                      </div>
                    
                      {compatibilityScore && compatibilityScore >= 80 ? (
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertTitle>Good Genetic Match</AlertTitle>
                          <AlertDescription>
                            This breeding pair shows good genetic compatibility.
                          </AlertDescription>
                        </Alert>
                      ) : compatibilityScore && compatibilityScore < 60 ? (
                        <Alert className="bg-red-50 border-red-200">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <AlertTitle>Genetic Concerns</AlertTitle>
                          <AlertDescription>
                            This breeding pair has significant genetic compatibility concerns.
                          </AlertDescription>
                        </Alert>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
                
                <Tabs defaultValue="health">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="health">Health Analysis</TabsTrigger>
                    <TabsTrigger value="colors">Color Genetics</TabsTrigger>
                    <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="health">
                    <PairingHealthSummary healthRisks={healthRisks} />
                  </TabsContent>
                  
                  <TabsContent value="colors">
                    <PairingColorAnalysis colorProbabilities={colorProbabilities} />
                  </TabsContent>
                  
                  <TabsContent value="details">
                    <GeneticCompatibilityAnalyzer 
                      sireId={sireId} 
                      damId={damId} 
                    />
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end">
                  <Button 
                    size="lg" 
                    onClick={handleCreateBreedingPlan}
                    disabled={!hasData || (compatibilityScore || 0) < 50}
                  >
                    Create Breeding Plan
                  </Button>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center p-6">
                    <AlertCircle className="h-10 w-10 mb-4 mx-auto text-amber-500" />
                    <h3 className="text-lg font-medium mb-2">Genetic Data Not Available</h3>
                    <p className="text-muted-foreground mb-4">
                      Complete genetic profiles for one or both dogs are missing.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/genetics/import')}
                    >
                      Import Genetic Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
};

// Helper functions for UI presentation
const getCompatibilityScoreColor = (score: number): string => {
  if (score >= 80) return 'bg-green-600';
  if (score >= 70) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
};

const getCOIColorClass = (coi: number): string => {
  if (coi < 0.05) return 'bg-green-500';
  if (coi < 0.10) return 'bg-yellow-500';
  if (coi < 0.15) return 'bg-amber-500';
  return 'bg-red-500';
};

const getCOIDescription = (coi: number): string => {
  if (coi < 0.05) return 'Excellent - Very low inbreeding coefficient';
  if (coi < 0.10) return 'Good - Acceptable inbreeding coefficient';
  if (coi < 0.15) return 'Caution - Moderate inbreeding coefficient';
  return 'Warning - High inbreeding coefficient';
};

export default GeneticPairingAnalysisPage;
