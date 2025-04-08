
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PageContainer from '@/components/common/PageContainer';
import BackButton from '@/components/common/BackButton';
import DogSelector from '@/components/genetics/DogSelector';
import GeneticCompatibilityAnalyzer from '@/components/breeding/GeneticCompatibilityAnalyzer';
import PairingHealthSummary from '@/components/breeding/PairingHealthSummary';
import PairingColorAnalysis from '@/components/breeding/PairingColorAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGeneticPairing } from '@/hooks/useGeneticPairing';

const BreedingGeneticAnalysisPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSireId = searchParams.get('sireId') || '';
  const initialDamId = searchParams.get('damId') || '';
  
  const [sireId, setSireId] = useState<string>(initialSireId);
  const [damId, setDamId] = useState<string>(initialDamId);
  
  const { 
    colorProbabilities,
    healthRisks
  } = useGeneticPairing(sireId, damId);
  
  return (
    <PageContainer>
      <div className="container mx-auto py-6 space-y-6">
        <BackButton fallbackPath="/breeding" />
        
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Breeding Genetic Analysis</h1>
          <p className="text-muted-foreground">
            Analyze genetic compatibility between potential breeding pairs
          </p>
        </div>
        
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
                  value={sireId}
                  onChange={setSireId}
                  placeholder="Select sire"
                  genderFilter="Male"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Dam (Female)</label>
                <DogSelector 
                  value={damId}
                  onChange={setDamId}
                  placeholder="Select dam"
                  genderFilter="Female"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {sireId && damId && (
          <>
            <GeneticCompatibilityAnalyzer sireId={sireId} damId={damId} />
            
            <Tabs defaultValue="health">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="health">Health Analysis</TabsTrigger>
                <TabsTrigger value="colors">Color Genetics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="health">
                <PairingHealthSummary healthRisks={healthRisks} />
              </TabsContent>
              
              <TabsContent value="colors">
                <PairingColorAnalysis colorProbabilities={colorProbabilities} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default BreedingGeneticAnalysisPage;
