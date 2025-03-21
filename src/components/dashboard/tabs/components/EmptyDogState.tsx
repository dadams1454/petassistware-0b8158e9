
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyDogStateProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const EmptyDogState: React.FC<EmptyDogStateProps> = ({ onRefresh, isRefreshing }) => {
  return (
    <Card className="p-8 text-center">
      <CardContent>
        <p className="text-muted-foreground mb-4">No dogs found. Please refresh or add dogs to the system.</p>
        <Button 
          onClick={onRefresh} 
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Dogs'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyDogState;
