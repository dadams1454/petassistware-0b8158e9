
import React from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import { Card, CardContent } from '@/components/ui/card';
import DogLetOutTabComponent from '@/components/facility/DogLetOutTab';
import { Dog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DogCareStatus } from '@/types/dailyCare';

interface DogLetOutTabProps {
  onRefreshDogs: () => void;
  dogStatuses?: DogCareStatus[];
}

const DogLetOutTab: React.FC<DogLetOutTabProps> = ({ 
  onRefreshDogs,
  dogStatuses = []
}) => {
  const { dogStatuses: contextDogStatuses, loading } = useDailyCare();
  
  // Use provided dogStatuses if available, otherwise use context
  const effectiveDogStatuses = dogStatuses.length > 0 
    ? dogStatuses 
    : contextDogStatuses || [];
  
  return (
    <div className="space-y-6">
      {effectiveDogStatuses && effectiveDogStatuses.length > 0 ? (
        <DogLetOutTabComponent onRefreshDogs={onRefreshDogs} />
      ) : (
        <Card className="p-8 text-center">
          <CardContent>
            <Dog className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No dogs found. Please refresh or add dogs to the system.</p>
            <Button onClick={onRefreshDogs}>Refresh Dogs</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DogLetOutTab;
