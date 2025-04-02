
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DogGenotype } from '@/types/genetics';

interface MultiTraitMatrixProps {
  genotypes: DogGenotype[];
  selectedTraits: string[];
}

const MultiTraitMatrix: React.FC<MultiTraitMatrixProps> = ({
  genotypes,
  selectedTraits = []
}) => {
  if (!genotypes || genotypes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No genetic data available for comparison</p>
        </CardContent>
      </Card>
    );
  }
  
  // If no traits selected, use some defaults
  const traitsToShow = selectedTraits.length > 0 
    ? selectedTraits 
    : ['progressive_retinal_atrophy', 'degenerative_myelopathy', 'exercise_induced_collapse'];
  
  // Format trait name for display
  const formatTraitName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Get status color class
  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-100';
    
    switch (status.toLowerCase()) {
      case 'clear':
        return 'bg-green-100 text-green-800';
      case 'carrier':
        return 'bg-amber-100 text-amber-800';
      case 'at_risk':
      case 'at risk':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Trait Comparison</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trait / Dog
                </th>
                {genotypes.map((genotype, index) => (
                  <th key={index} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {genotype.name || `Dog ${index + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {traitsToShow.map(trait => (
                <tr key={trait}>
                  <td className="px-4 py-2 text-sm font-medium">
                    {formatTraitName(trait)}
                  </td>
                  {genotypes.map((genotype, index) => {
                    const status = genotype.healthMarkers && genotype.healthMarkers[trait]
                      ? genotype.healthMarkers[trait].status
                      : 'unknown';
                      
                    return (
                      <td key={index} className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)}`}>
                          {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiTraitMatrix;
