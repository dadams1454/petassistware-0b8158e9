
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Card, CardContent } from '@/components/ui/card';
import { CircleSlash } from 'lucide-react';

interface GroomingTabProps {
  dogStatuses: DogCareStatus[] | undefined;
  onRefreshDogs?: () => void;
}

const GroomingTab: React.FC<GroomingTabProps> = ({ 
  dogStatuses,
  onRefreshDogs
}) => {
  return (
    <Card className="p-8 text-center">
      <CardContent className="pt-4 flex flex-col items-center justify-center">
        <CircleSlash className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Grooming tab functionality coming soon</p>
      </CardContent>
    </Card>
  );
};

export default GroomingTab;
