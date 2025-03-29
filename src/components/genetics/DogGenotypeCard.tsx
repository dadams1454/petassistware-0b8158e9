
import React from 'react';
import { useDogGenetics } from '@/hooks/useDogGenetics';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { ColorTraitsPanel } from './components/ColorTraitsPanel';
import { HealthMarkersPanel } from './components/HealthMarkersPanel';
import { CompactGenotypeView } from './components/CompactGenotypeView';

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
  
  // Handle loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }
  
  // Handle error state
  if (error || !geneticData) {
    return (
      <div className="text-center p-4">
        <AlertCircle className="mx-auto h-8 w-8 text-orange-500 mb-2" />
        <h3 className="text-lg font-medium">No Genetic Data Available</h3>
        <p className="text-sm text-gray-500 mt-1">
          {error ? error.message : "No genetic tests have been recorded for this dog."}
        </p>
      </div>
    );
  }
  
  // Render compact version if requested
  if (compact) {
    return (
      <CompactGenotypeView 
        geneticData={geneticData}
        showColorTraits={showColorTraits}
        showHealthTests={showHealthTests}
      />
    );
  }
  
  // Render full version
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      {/* Color Genetics */}
      {showColorTraits && <ColorTraitsPanel geneticData={geneticData} />}
      
      {/* Health Markers */}
      {showHealthTests && <HealthMarkersPanel geneticData={geneticData} />}
    </div>
  );
};

export default DogGenotypeCard;
