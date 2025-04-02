
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ExpenseTracker: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Track and manage expenses here
        </p>
      </CardContent>
    </Card>
  );
};
