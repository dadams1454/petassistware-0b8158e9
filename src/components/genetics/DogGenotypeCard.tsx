
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDogGenetics } from '@/hooks/useDogGenetics';
import { DogGenotype, CompactGenotypeViewProps } from '@/types/genetics';
import { AlertCircle, CheckCircle2, Dna } from 'lucide-react';
import { HealthMarkersPanel } from './components/HealthMarkersPanel';

export const CompactGenotypeView: React.FC<CompactGenotypeViewProps> = ({ 
  genotype,
  showBreed = true,
  showColorTraits = true,
  showHealthTests = false
}) => {
  // Make sure we have a valid genotype object, even if it's empty
  const dogGenetics: DogGenotype = genotype || {
    dogId: '',
    baseColor: 'unknown',
    brownDilution: 'unknown',
    dilution: 'unknown',
    healthMarkers: {},
    healthResults: []
  };
  
  return (
    <div className="space-y-4">
      {showBreed && dogGenetics.breed && (
        <div className="flex items-center">
          <span className="text-sm font-medium">Breed:</span>
          <Badge variant="outline" className="ml-2">
            {dogGenetics.breed}
          </Badge>
        </div>
      )}
      
      {showColorTraits && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Color Genetics</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <span className="font-medium block">Base Color</span>
              <span className="text-gray-600">{dogGenetics.baseColor || 'Unknown'}</span>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="font-medium block">Brown Dilution</span>
              <span className="text-gray-600">{dogGenetics.brownDilution || 'Unknown'}</span>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="font-medium block">Dilution</span>
              <span className="text-gray-600">{dogGenetics.dilution || 'Unknown'}</span>
            </div>
          </div>
        </div>
      )}
      
      {showHealthTests && (
        <HealthMarkersPanel dogGenetics={dogGenetics} />
      )}
    </div>
  );
};

interface DogGenotypeCardProps {
  dogId: string;
  showHealthTests?: boolean;
  showColorTraits?: boolean;
  genotype?: DogGenotype; // Make genotype optional
}

export const DogGenotypeCard: React.FC<DogGenotypeCardProps> = ({ 
  dogId, 
  showHealthTests = false,
  showColorTraits = true,
  genotype // Allow passing genotype directly
}) => {
  // Only fetch genetic data if it wasn't passed in
  const { dogData, isLoading, error } = !genotype ? useDogGenetics(dogId) : { 
    dogData: genotype, 
    isLoading: false, 
    error: null 
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Dna className="h-5 w-5 mr-2" />
            Genetic Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertCircle className="h-5 w-5 mr-2" />
            Error Loading Genetic Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            There was a problem loading the genetic data for this dog.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Use genotype if provided, otherwise use dogData from the hook
  const geneticData = genotype || dogData;
  
  const hasGenetics = geneticData && (
    geneticData.baseColor !== 'unknown' || 
    geneticData.brownDilution !== 'unknown' || 
    geneticData.dilution !== 'unknown' ||
    (geneticData.healthMarkers && Object.keys(geneticData.healthMarkers).length > 0)
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Dna className="h-5 w-5 mr-2" />
          Genetic Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasGenetics ? (
          <CompactGenotypeView 
            genotype={geneticData}
            showColorTraits={showColorTraits}
            showHealthTests={showHealthTests}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-yellow-50 p-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Genetic Data Available</h3>
            <p className="text-sm text-gray-500 mb-4 max-w-xs">
              Genetic information hasn't been added yet. Import test results to see genetic data.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
