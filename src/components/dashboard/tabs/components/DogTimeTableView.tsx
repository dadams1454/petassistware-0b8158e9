
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  // Check if the data is valid but empty
  if (!dogStatuses || dogStatuses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Care Data Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {!dogStatuses 
              ? "Unable to load care data. There may be an issue with the connection."
              : "No care data available for your dogs. Add dogs to start tracking care activities."}
          </p>
          <Button onClick={onRefresh} className="mt-1" disabled={isRefreshing}>
            {isRefreshing ? "Refreshing..." : "Try Again"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // If we have issues with the data structure
  const dataIncomplete = dogStatuses.some(dog => !dog.dog_id || !dog.dog_name);
  if (dataIncomplete) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Data Error</AlertTitle>
        <AlertDescription>
          Some dog records appear to be incomplete. Please try refreshing the data.
          <Button onClick={onRefresh} variant="outline" className="mt-2" size="sm">
            Refresh Data
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Normal case - display the time table
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
