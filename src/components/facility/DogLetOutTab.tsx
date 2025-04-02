
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DogLetOutTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dog Let Out Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Implement dog break management here
        </p>
      </CardContent>
    </Card>
  );
};

export default DogLetOutTab;
