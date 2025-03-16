
import React, { useState } from 'react';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { useDailyCare } from '@/contexts/dailyCare';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DailyCareTabProps {
  onRefreshDogs: () => void;
  isRefreshing: boolean;
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ onRefreshDogs, isRefreshing }) => {
  const { dogStatuses } = useDailyCare();
  
  return (
    <>
      {dogStatuses && dogStatuses.length > 0 ? (
        <DogTimeTable 
          dogsStatus={dogStatuses} 
          onRefresh={onRefreshDogs} 
        />
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No dogs found. Please refresh or add dogs to the system.</p>
          <Button onClick={onRefreshDogs} className="mt-4">Refresh Dogs</Button>
        </Card>
      )}
    </>
  );
};

export default DailyCareTab;
