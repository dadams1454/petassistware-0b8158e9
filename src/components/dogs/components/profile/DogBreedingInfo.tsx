
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DogBreedingInfoProps {
  dog: any;
}

const DogBreedingInfo: React.FC<DogBreedingInfoProps> = ({ dog }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Breeding Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dog.is_pregnant && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-200 dark:border-yellow-800">
              <p className="font-medium">Currently Pregnant</p>
              {dog.tie_date && (
                <p className="text-sm text-muted-foreground mt-1">
                  Breeding date: {new Date(dog.tie_date).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Heat Date</h3>
              <p>{dog.last_heat_date ? new Date(dog.last_heat_date).toLocaleDateString() : 'Not recorded'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Litter Count</h3>
              <p>{dog.litter_number || '0'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DogBreedingInfo;
