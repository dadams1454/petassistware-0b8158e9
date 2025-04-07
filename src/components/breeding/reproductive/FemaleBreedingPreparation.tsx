
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dog } from '@/types/dog';

interface FemaleBreedingPreparationProps {
  dog: Dog;
  breedingData?: any;
}

const FemaleBreedingPreparation: React.FC<FemaleBreedingPreparationProps> = ({ dog, breedingData }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Breeding Preparation</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Showing breeding preparation details for {dog.name}.
        </p>
        
        {/* Breeding information will be populated here */}
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Heat Cycle Status</h3>
            <p>{dog.is_pregnant ? 'Currently pregnant' : 'Not pregnant'}</p>
          </div>
          
          <div>
            <h3 className="font-medium">Last Heat Date</h3>
            <p>{dog.last_heat_date || 'Not recorded'}</p>
          </div>
          
          {/* Additional breeding information */}
        </div>
      </CardContent>
    </Card>
  );
};

export default FemaleBreedingPreparation;
