
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const FinancialDashboard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Financial analytics and overview will be displayed here
        </p>
      </CardContent>
    </Card>
  );
};
