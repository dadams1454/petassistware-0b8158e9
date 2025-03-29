
import React from 'react';
import { useDogGenetics } from '@/hooks/useDogGenetics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GeneticHealthMarker } from '@/types/genetics';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface DogGenotypeCardProps {
  dogId: string;
  showHealthTests?: boolean;
  showColorTraits?: boolean;
  compact?: boolean;
}

export const DogGenotypeCard: React.FC<DogGenotypeCardProps> = ({
  dogId,
  showHealthTests = true,
  showColorTraits = true,
  compact = false
}) => {
  const { geneticData, loading, error } = useDogGenetics(dogId);
  
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Genetic Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !geneticData) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Genetic Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4">
            <AlertCircle className="mx-auto h-8 w-8 text-orange-500 mb-2" />
            <h3 className="text-lg font-medium">No Genetic Data Available</h3>
            <p className="text-sm text-gray-500 mt-1">
              No genetic tests have been recorded for this dog.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Genetic Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {showColorTraits && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Color Genetics</h3>
            <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-4'} gap-2`}>
              <ColorTraitBadge label="Base Color" value={geneticData.baseColor} />
              <ColorTraitBadge label="Brown" value={geneticData.brownDilution} />
              <ColorTraitBadge label="Dilution" value={geneticData.dilution} />
              <ColorTraitBadge label="Agouti" value={geneticData.agouti} />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Predicted color: {getPredictedColor(geneticData)}
            </div>
          </div>
        )}
        
        {showHealthTests && (
          <div>
            <h3 className="text-sm font-medium mb-2">Health Tests</h3>
            {Object.keys(geneticData.healthMarkers).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(geneticData.healthMarkers).map(([testName, marker]) => (
                  <HealthTestItem key={testName} testName={testName} marker={marker} />
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">
                No health tests recorded
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface ColorTraitBadgeProps {
  label: string;
  value: string;
}

const ColorTraitBadge: React.FC<ColorTraitBadgeProps> = ({ label, value }) => {
  return (
    <div className="bg-gray-50 rounded p-2 text-center">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
};

interface HealthTestItemProps {
  testName: string;
  marker: GeneticHealthMarker;
}

const HealthTestItem: React.FC<HealthTestItemProps> = ({ testName, marker }) => {
  // Format the test name
  const formattedTestName = formatTestName(testName);
  
  // Get styling based on status
  const { bgColor, textColor, icon } = getStatusStyle(marker.status);
  
  return (
    <div className={`${bgColor} ${textColor} rounded-md p-2 flex items-center`}>
      <div className="mr-2">{icon}</div>
      <div>
        <div className="font-medium">{formattedTestName}</div>
        <div className="text-xs">
          {marker.status.charAt(0).toUpperCase() + marker.status.slice(1)} ({marker.genotype})
        </div>
      </div>
    </div>
  );
};

// Helper function to format test names
function formatTestName(testName: string): string {
  const abbreviations: Record<string, string> = {
    'DM': 'Degenerative Myelopathy',
    'DCM': 'Dilated Cardiomyopathy',
    'vWD': 'von Willebrand Disease',
    'PRA': 'Progressive Retinal Atrophy'
  };
  
  return abbreviations[testName] || testName;
}

// Helper function to get styling based on test status
function getStatusStyle(status: 'clear' | 'carrier' | 'affected') {
  switch (status) {
    case 'clear':
      return {
        bgColor: 'bg-green-50',
        textColor: 'text-green-800',
        icon: <CheckCircle className="h-4 w-4 text-green-500" />
      };
    case 'carrier':
      return {
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-800',
        icon: <HelpCircle className="h-4 w-4 text-yellow-500" />
      };
    case 'affected':
      return {
        bgColor: 'bg-red-50',
        textColor: 'text-red-800',
        icon: <AlertCircle className="h-4 w-4 text-red-500" />
      };
  }
}

// Helper function to determine phenotype based on genotype
function getPredictedColor(geneticData: any): string {
  const baseGenotype = geneticData.baseColor;
  const brownGenotype = geneticData.brownDilution;
  const dilutionGenotype = geneticData.dilution;
  
  // E is dominant (black-based), e is recessive (red-based)
  const isBlackBased = baseGenotype.includes('E');
  
  // B is dominant (no brown), b is recessive (brown)
  const hasBrownDilution = brownGenotype === 'bb';
  
  // D is dominant (no dilution), d is recessive (dilute)
  const hasDilution = dilutionGenotype === 'dd';
  
  // Determine base color
  if (!isBlackBased) {
    // Red-based colors
    if (hasDilution) {
      return 'Cream';
    }
    return 'Red';
  } else {
    // Black-based colors
    if (hasBrownDilution) {
      // Brown variants
      if (hasDilution) {
        return 'Light Brown';
      }
      return 'Brown';
    } else {
      // Black variants
      if (hasDilution) {
        return 'Grey';
      }
      return 'Black';
    }
  }
}

export default DogGenotypeCard;
