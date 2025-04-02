
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface ReservationListProps {
  customerId?: string;
  isAddOpen?: boolean;
  onAddOpenChange?: (open: boolean) => void;
}

export const ReservationList: React.FC<ReservationListProps> = ({
  customerId,
  isAddOpen,
  onAddOpenChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservations</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Manage puppy reservations here
        </p>
      </CardContent>
    </Card>
  );
};
