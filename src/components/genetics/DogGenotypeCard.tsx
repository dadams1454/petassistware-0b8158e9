
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDogGenetics } from '@/hooks/useDogGenetics';
import { DogGenotype } from '@/types/genetics';

interface DogGenotypeCardProps {
  dogId: string;
  genotype?: DogGenotype | null;
}

const DogGenotypeCard: React.FC<DogGenotypeCardProps> = ({ dogId, genotype: propGenotype }) => {
  const { geneticData: hookGenotype, loading } = useDogGenetics(dogId);
  
  // Use passed genotype or fall back to the hook
  const genotype = propGenotype || hookGenotype;
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading genetic data...</CardTitle>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (!genotype) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No genetic data available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No genetic information is available for this dog. Please import or add genetic data.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Create a default genotype to avoid errors if the data is missing fields
  const displayGenotype: DogGenotype = {
    dog_id: genotype.dog_id,
    baseColor: genotype.baseColor || 'Unknown',
    brownDilution: genotype.brownDilution || 'Unknown',
    dilution: genotype.dilution || 'Unknown',
    agouti: genotype.agouti || 'Unknown',
    healthMarkers: genotype.healthMarkers || {},
    updated_at: genotype.updated_at || new Date().toISOString()
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{genotype.name || 'Genetic Profile'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Color Genetics</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm">
              <span className="font-medium">Base Color:</span> {displayGenotype.baseColor}
            </div>
            <div className="text-sm">
              <span className="font-medium">Dilution:</span> {displayGenotype.dilution}
            </div>
            <div className="text-sm">
              <span className="font-medium">Brown Dilution:</span> {displayGenotype.brownDilution}
            </div>
            <div className="text-sm">
              <span className="font-medium">Agouti:</span> {displayGenotype.agouti}
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Health Markers</h3>
          {Object.keys(displayGenotype.healthMarkers).length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(displayGenotype.healthMarkers).map(([condition, marker]) => (
                <div key={condition} className="flex items-center justify-between border rounded-md p-2">
                  <div>{marker.name || condition}</div>
                  <Badge variant={getStatusVariant(marker.status)}>{marker.status}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No health markers available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to determine badge variant based on status
const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status?.toLowerCase()) {
    case 'clear':
      return 'default';
    case 'carrier':
      return 'secondary';
    case 'at_risk':
    case 'affected':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default DogGenotypeCard;
