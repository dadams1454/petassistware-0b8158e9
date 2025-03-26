
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';

interface DogTimeTableViewProps {
  dogStatuses: any[] | null;
  onRefresh: () => void;
  isRefreshing: boolean;
  currentDate: Date;
}

const DogTimeTableView: React.FC<DogTimeTableViewProps> = ({ 
  dogStatuses, 
  onRefresh, 
  isRefreshing, 
  currentDate 
}) => {
  if (!dogStatuses || dogStatuses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Care Data Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No care data available for your dogs.</p>
          <Button onClick={onRefresh} className="mt-4">Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <DogTimeTable 
      dogsStatus={dogStatuses} 
      onRefresh={onRefresh} 
      isRefreshing={isRefreshing} 
      currentDate={currentDate}
    />
  );
};

export default DogTimeTableView;
