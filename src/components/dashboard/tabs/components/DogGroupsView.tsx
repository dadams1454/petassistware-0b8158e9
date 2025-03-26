
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PottyBreakGroupSelector from '@/components/dogs/components/care/potty/PottyBreakGroupSelector';

interface DogGroupsViewProps {
  dogStatuses: any[] | null;
  onRefresh: () => void;
  onGroupSelected: (dogIds: string[]) => Promise<void>;
}

const DogGroupsView: React.FC<DogGroupsViewProps> = ({ 
  dogStatuses, 
  onRefresh, 
  onGroupSelected 
}) => {
  if (!dogStatuses || dogStatuses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Dogs Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Add dogs to start creating groups.</p>
          <Button onClick={onRefresh} className="mt-4">Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Select a dog group to quickly record potty breaks for multiple dogs at once.
      </p>
      <PottyBreakGroupSelector 
        dogs={dogStatuses} 
        onGroupSelected={onGroupSelected} 
      />
    </div>
  );
};

export default DogGroupsView;
