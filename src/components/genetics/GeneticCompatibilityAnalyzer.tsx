
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Info, AlertTriangle, Dna } from 'lucide-react';
import { useGeneticPairing } from '@/hooks/useGeneticPairing';
import DogGenotypeCard from './DogGenotypeCard';

interface GeneticCompatibilityAnalyzerProps {
  sireId: string;
  damId: string;
}

const GeneticCompatibilityAnalyzer: React.FC<GeneticCompatibilityAnalyzerProps> = ({ 
  sireId, 
  damId 
}) => {
  const { 
    sireGenotype,
    damGenotype,
    inbreedingCoefficient,
    isLoading,
    error
  } = useGeneticPairing(sireId, damId);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Genetic Compatibility Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4">
            <p className="text-muted-foreground">Loading genetic data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Genetic Compatibility Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center p-4 text-destructive">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>Error loading genetic data. Please check if genetic profiles exist for both dogs.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // COI risk levels
  let coiRiskLevel = 'Low';
  let coiColor = 'bg-green-500';
  
  if (inbreedingCoefficient > 0.125) {
    coiRiskLevel = 'High';
    coiColor = 'bg-red-500';
  } else if (inbreedingCoefficient > 0.0625) {
    coiRiskLevel = 'Medium';
    coiColor = 'bg-amber-500';
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Genetic Compatibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Inbreeding Coefficient */}
            <div>
              <div className="flex justify-between mb-2">
                <div className="font-medium">Inbreeding Coefficient (COI)</div>
                <div>
                  <Badge variant={coiRiskLevel === 'Low' ? 'default' : coiRiskLevel === 'Medium' ? 'secondary' : 'destructive'}>
                    {coiRiskLevel} Risk
                  </Badge>
                </div>
              </div>
              <Progress 
                value={inbreedingCoefficient * 100} 
                className="h-2"
                // @ts-ignore - variant property may not be in the component type but can be passed through
                color={coiColor}
              />
              <div className="flex justify-between text-sm mt-1">
                <span>{(inbreedingCoefficient * 100).toFixed(2)}%</span>
                <span className="text-muted-foreground">
                  {coiRiskLevel === 'Low' ? 'Healthy genetic diversity' : 
                   coiRiskLevel === 'Medium' ? 'Caution advised' : 
                   'High inbreeding risk'}
                </span>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <Info className="h-4 w-4 inline-block mr-1" />
              Coefficient of Inbreeding (COI) estimates the probability that two alleles at a given locus are identical by descent.
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Sire Genetic Profile */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Sire: {sireGenotype?.name || 'Unknown Sire'}</h3>
          <DogGenotypeCard dogId={sireId} genotype={sireGenotype} />
        </div>
        
        {/* Dam Genetic Profile */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Dam: {damGenotype?.name || 'Unknown Dam'}</h3>
          <DogGenotypeCard dogId={damId} genotype={damGenotype} />
        </div>
      </div>
    </div>
  );
};

export default GeneticCompatibilityAnalyzer;
