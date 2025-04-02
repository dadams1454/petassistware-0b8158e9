
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const WaitlistManager: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Waitlist Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Manage your customer waitlist here
        </p>
      </CardContent>
    </Card>
  );
};

export default WaitlistManager;
