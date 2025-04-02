
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DogGenotype, HealthMarker } from '@/types/genetics';
import { formatConditionName } from '../utils/healthUtils';

// Utility function to get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'clear':
      return 'bg-green-100 text-green-800';
    case 'carrier':
      return 'bg-amber-100 text-amber-800';
    case 'at_risk':
    case 'at risk':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface InteractivePedigreeProps {
  genotype: DogGenotype;
  ancestorGenotypes?: Record<string, DogGenotype>;
}

const InteractivePedigree: React.FC<InteractivePedigreeProps> = ({
  genotype,
  ancestorGenotypes = {}
}) => {
  if (!genotype) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No genetic data available for this dog</p>
        </CardContent>
      </Card>
    );
  }
  
  // These would normally be populated from ancestorGenotypes
  // For now just using placeholders
  const placeholderPedigree = {
    sire: { name: 'Sire' },
    dam: { name: 'Dam' },
    sireSire: { name: 'Sire\'s Sire' },
    sireDam: { name: 'Sire\'s Dam' },
    damSire: { name: 'Dam\'s Sire' },
    damDam: { name: 'Dam\'s Dam' }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Interactive Pedigree</h3>
        
        <div className="text-center mb-4">
          <p className="text-muted-foreground">
            This feature would display an interactive pedigree showing genetic traits and health markers across generations.
          </p>
        </div>
        
        <div className="grid grid-cols-7 gap-2 text-center text-xs">
          {/* Generation 3 */}
          <div className="col-span-1 p-2 border rounded bg-gray-50">
            {placeholderPedigree.sireSire.name}
          </div>
          <div className="col-span-1 p-2 border rounded bg-gray-50">
            {placeholderPedigree.sireDam.name}
          </div>
          <div className="col-span-1 p-2 border rounded bg-gray-50">
            {placeholderPedigree.damSire.name}
          </div>
          <div className="col-span-1 p-2 border rounded bg-gray-50">
            {placeholderPedigree.damDam.name}
          </div>
          <div className="col-span-3"></div>
          
          {/* Generation 2 */}
          <div className="col-span-2 p-2 border rounded bg-gray-50">
            {placeholderPedigree.sire.name}
          </div>
          <div className="col-span-2 p-2 border rounded bg-gray-50">
            {placeholderPedigree.dam.name}
          </div>
          <div className="col-span-3"></div>
          
          {/* Generation 1 (Current Dog) */}
          <div className="col-span-4 p-3 border-2 border-primary rounded bg-primary/5 font-medium">
            {genotype.name || 'Current Dog'}
          </div>
          <div className="col-span-3"></div>
        </div>
        
        {genotype.healthMarkers && Object.keys(genotype.healthMarkers).length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-2">Health Markers</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(genotype.healthMarkers).map(([condition, marker]) => (
                <div key={condition} className={`p-2 rounded ${getStatusColor(marker.status)}`}>
                  <span className="block font-medium">{formatConditionName(condition)}</span>
                  <span className="text-xs">
                    {marker.status.charAt(0).toUpperCase() + marker.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractivePedigree;
