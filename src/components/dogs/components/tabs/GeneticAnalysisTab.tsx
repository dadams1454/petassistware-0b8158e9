
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DogProfile } from '@/types/dog';
import { DogGenotype } from '@/types/genetics';
import { formatConditionName } from '@/components/genetics/utils/healthUtils';

// Create or import utility function if not available already
const generateRiskAssessment = (genotype: DogGenotype | null): string => {
  if (!genotype || !genotype.healthMarkers) {
    return "No genetic health data available.";
  }
  
  let atRiskCount = 0;
  let carrierCount = 0;
  
  Object.values(genotype.healthMarkers).forEach(marker => {
    if (marker.status === 'at_risk' || marker.status === 'at risk') {
      atRiskCount++;
    } else if (marker.status === 'carrier') {
      carrierCount++;
    }
  });
  
  if (atRiskCount === 0 && carrierCount === 0) {
    return "This dog is clear of all tested genetic health conditions.";
  } else if (atRiskCount > 0) {
    return `This dog is at risk for ${atRiskCount} genetic ${atRiskCount === 1 ? 'condition' : 'conditions'} and is a carrier for ${carrierCount} ${carrierCount === 1 ? 'condition' : 'conditions'}.`;
  } else {
    return `This dog is a carrier for ${carrierCount} genetic ${carrierCount === 1 ? 'condition' : 'conditions'} but is not at risk for any tested conditions.`;
  }
};

interface GeneticAnalysisTabProps {
  dog: DogProfile;
}

const GeneticAnalysisTab: React.FC<GeneticAnalysisTabProps> = ({ dog }) => {
  // Placeholder for when actual genetic data would be fetched
  const dogGenetics: DogGenotype | null = null;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Genetic Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {dogGenetics ? (
            <div>
              <p className="text-lg">{generateRiskAssessment(dogGenetics)}</p>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Health Markers</h3>
                {dogGenetics.healthMarkers && Object.keys(dogGenetics.healthMarkers).length > 0 ? (
                  <ul className="space-y-2">
                    {Object.entries(dogGenetics.healthMarkers).map(([condition, marker]) => (
                      <li key={condition} className="flex justify-between border-b pb-1">
                        <span>{formatConditionName(condition)}</span>
                        <span className={
                          marker.status === 'clear' ? 'text-green-600' : 
                          marker.status === 'carrier' ? 'text-amber-600' : 
                          'text-red-600'
                        }>
                          {marker.status.charAt(0).toUpperCase() + marker.status.slice(1)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No health markers recorded</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No genetic data available for this dog</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add genetic test results to view health markers and other genetic information
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneticAnalysisTab;
