
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyRecordStateProps {
  type: string;
  icon?: React.ReactNode;
}

const EmptyRecordState: React.FC<EmptyRecordStateProps> = ({ type, icon }) => {
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        {icon || <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-2" />}
        <p className="text-muted-foreground">
          No {type} records found. Use the "Add Health Record" button to add your first record.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyRecordState;
