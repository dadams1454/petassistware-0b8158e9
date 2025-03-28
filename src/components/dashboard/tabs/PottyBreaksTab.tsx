
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DogCareStatus } from '@/types/dailyCare';

interface PottyBreaksTabProps {
  onRefreshDogs: () => void;
  dogStatuses?: DogCareStatus[];
}

const PottyBreaksTab: React.FC<PottyBreaksTabProps> = ({ 
  onRefreshDogs,
  dogStatuses = []
}) => {
  return (
    <div className="space-y-6">
      <Card className="p-8 text-center">
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Potty breaks feature has been removed. Please use the Daily Care section to manage other dog care activities.
          </p>
          <Button onClick={onRefreshDogs}>View Daily Care</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PottyBreaksTab;
