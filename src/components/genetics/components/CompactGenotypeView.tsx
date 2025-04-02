
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DogGenotype, CompactGenotypeViewProps } from '@/types/genetics';
import { formatConditionName } from '../utils/healthUtils';

// Create a utility function to get health summary data if not available
const getHealthSummaryData = (genotype: DogGenotype) => {
  if (!genotype || !genotype.healthMarkers) {
    return {
      clearCount: 0,
      carrierCount: 0,
      atRiskCount: 0,
      totalTests: 0,
      healthScore: 100,
      topRisks: []
    };
  }
  
  let clearCount = 0;
  let carrierCount = 0;
  let atRiskCount = 0;
  let totalTests = Object.keys(genotype.healthMarkers).length;
  
  Object.values(genotype.healthMarkers).forEach(marker => {
    if (marker.status === 'clear') {
      clearCount++;
    } else if (marker.status === 'carrier') {
      carrierCount++;
    } else if (marker.status === 'at_risk' || marker.status === 'at risk') {
      atRiskCount++;
    }
  });
  
  // Calculate health score (basic algorithm)
  const healthScore = Math.max(0, 100 - (carrierCount * 5) - (atRiskCount * 15));
  
  return {
    clearCount,
    carrierCount,
    atRiskCount,
    totalTests,
    healthScore
  };
};

const CompactGenotypeView: React.FC<CompactGenotypeViewProps> = ({
  genotype,
  showHealth = true,
  showColor = true,
  showTitle = true
}) => {
  if (!genotype) {
    return (
      <Card className="border-dashed border-gray-300 bg-gray-50">
        <CardContent className="p-4 text-center text-gray-500">
          No genetic data available
        </CardContent>
      </Card>
    );
  }

  const healthSummary = getHealthSummaryData(genotype);

  return (
    <Card>
      <CardContent className="p-4">
        {showTitle && (
          <h3 className="font-medium mb-2">{genotype.name || 'Genetic Profile'}</h3>
        )}
        
        {showColor && genotype.baseColor && (
          <div className="mb-3">
            <span className="text-sm font-medium block">Color:</span>
            <div className="flex items-center mt-1">
              <div 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ 
                  backgroundColor: genotype.colorProbabilities?.[0]?.hex || '#6b7280',
                  border: '1px solid #ddd'
                }} 
              />
              <span>{genotype.baseColor}</span>
            </div>
          </div>
        )}
        
        {showHealth && healthSummary.totalTests > 0 && (
          <div>
            <span className="text-sm font-medium block mt-2">Health Status:</span>
            <div className="space-y-1 mt-1">
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Clear:</span>
                <span>{healthSummary.clearCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-amber-600">Carrier:</span>
                <span>{healthSummary.carrierCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-red-600">At Risk:</span>
                <span>{healthSummary.atRiskCount}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompactGenotypeView;
