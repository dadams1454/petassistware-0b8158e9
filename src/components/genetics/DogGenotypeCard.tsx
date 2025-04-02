
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dna, AlertCircle } from 'lucide-react';
import { useDogGenetics } from '@/hooks/useDogGenetics';
import { CompactGenotypeViewProps, DogGenotype, HealthMarker } from '@/types/genetics';
import { LoadingState, ErrorState } from '@/components/ui/standardized';

// Map for color-coding health statuses
const statusColors: Record<string, string> = {
  'clear': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'carrier': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  'affected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  'unknown': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
};

export const CompactGenotypeView: React.FC<CompactGenotypeViewProps> = ({ 
  genotype,
  showColorTraits = true,
  showHealthTests = true
}) => {
  if (!genotype) return null;
  
  return (
    <div className="space-y-4">
      {showColorTraits && genotype.baseColor && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Color Traits</h3>
          <div className="grid grid-cols-2 gap-2">
            {genotype.baseColor && (
              <ColorTraitItem label="Base Color" value={genotype.baseColor} />
            )}
            {genotype.agouti && (
              <ColorTraitItem label="Agouti" value={genotype.agouti} />
            )}
            {genotype.dilution && (
              <ColorTraitItem label="Dilution" value={genotype.dilution} />
            )}
            {genotype.brownDilution && (
              <ColorTraitItem label="Brown" value={genotype.brownDilution} />
            )}
          </div>
        </div>
      )}
      
      {showHealthTests && genotype.healthResults && genotype.healthResults.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Health Tests</h3>
          <div className="space-y-2">
            {genotype.healthResults.map((test, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">{test.condition}</span>
                <Badge variant="outline" className={statusColors[test.result]}>
                  {test.result}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ColorTraitItem = ({ label, value }: { label: string; value: string }) => (
  <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="text-sm font-medium">{value}</div>
  </div>
);

interface DogGenotypeCardProps {
  dogId: string;
  showHealthTests?: boolean;
  showColorTraits?: boolean;
}

export const DogGenotypeCard: React.FC<DogGenotypeCardProps> = ({ 
  dogId,
  showHealthTests = true,
  showColorTraits = true
}) => {
  const { geneticData, loading, error, refresh } = useDogGenetics(dogId);
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Genetic Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingState message="Loading genetic data..." />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Genetic Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState 
            title="Error Loading Genetic Data" 
            message="There was a problem retrieving genetic information."
            onRetry={refresh}
          />
        </CardContent>
      </Card>
    );
  }
  
  if (!geneticData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Dna className="h-5 w-5 mr-2" />
            Genetic Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No genetic data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Dna className="h-5 w-5 mr-2" />
          Genetic Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CompactGenotypeView 
          genotype={geneticData}
          showColorTraits={showColorTraits} 
          showHealthTests={showHealthTests} 
        />
      </CardContent>
    </Card>
  );
};
