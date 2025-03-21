
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const EmptyDogState: React.FC = () => {
  return (
    <Card className="p-8 text-center">
      <CardContent>
        <p className="text-muted-foreground mb-4">No dogs found. Dogs will automatically appear here when added to the system.</p>
      </CardContent>
    </Card>
  );
};

export default EmptyDogState;
