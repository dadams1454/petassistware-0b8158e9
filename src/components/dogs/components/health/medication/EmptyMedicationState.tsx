
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmptyMedicationStateProps {
  className?: string;
}

const EmptyMedicationState: React.FC<EmptyMedicationStateProps> = ({ className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Medications</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-center py-4">
          No medications have been prescribed yet.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyMedicationState;
