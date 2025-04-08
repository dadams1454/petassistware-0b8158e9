
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';
import { DogGenotype, CompactGenotypeViewProps, GeneticHealthStatus } from '@/types/genetics';

// Helper function to get icon for genetic status
const getStatusIcon = (status: GeneticHealthStatus) => {
  switch (status) {
    case 'clear':
      return <Check className="h-4 w-4 text-green-600" />;
    case 'carrier':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'at_risk':
    case 'affected':
      return <XCircle className="h-4 w-4 text-red-600" />;
    case 'unknown':
    default:
      return <HelpCircle className="h-4 w-4 text-gray-400" />;
  }
};

export const CompactGenotypeView: React.FC<CompactGenotypeViewProps> = ({ 
  genotype,
  title,
  showBreed = true,
  showColorTraits = true,
  showHealthTests = false,
  showTitle = true,
  showHealth = true,
  showColor = true
}) => {
  // Make sure we have a valid genotype object, even if it's empty
  const dogGenetics: DogGenotype = genotype || {
    dog_id: '',
    baseColor: 'unknown',
    brownDilution: 'unknown',
    dilution: 'unknown',
    agouti: 'unknown',
    healthMarkers: {},
    updated_at: new Date().toISOString()
  };
  
  return (
    <div className="space-y-4">
      {showTitle && title && (
        <h3 className="text-base font-semibold">{title}</h3>
      )}
      
      {showBreed && dogGenetics.breed && (
        <div className="flex items-center">
          <span className="text-sm font-medium">Breed:</span>
          <Badge variant="outline" className="ml-2">
            {dogGenetics.breed}
          </Badge>
        </div>
      )}
      
      {showColor && (
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
          
          {dogGenetics.colorProbabilities && dogGenetics.colorProbabilities.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-semibold">Possible Colors</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {dogGenetics.colorProbabilities.map((color, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {color.color} ({Math.round(color.probability * 100)}%)
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {showHealth && showHealthTests && dogGenetics.healthMarkers && Object.keys(dogGenetics.healthMarkers).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Health Tests</h4>
          <div className="space-y-1">
            {Object.entries(dogGenetics.healthMarkers).map(([key, marker]) => (
              <div key={key} className="flex items-center p-1 rounded hover:bg-gray-50">
                {getStatusIcon(marker.status)}
                <span className="ml-2 text-sm">{marker.name || key}</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {marker.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactGenotypeView;
