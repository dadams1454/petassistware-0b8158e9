
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DogCareStatus } from '@/types/dailyCare';
import { Droplet } from 'lucide-react';

interface PottyBreaksTabProps {
  onRefreshDogs: () => void;
  dogStatuses?: DogCareStatus[];
}

const PottyBreaksTab: React.FC<PottyBreaksTabProps> = ({ 
  onRefreshDogs,
  dogStatuses = []
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <Droplet className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Potty Breaks Feature Removed</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          The dedicated potty breaks feature has been deprecated. Please use the Daily Care section 
          for tracking all dog care activities including potty breaks.
        </p>
        <Button onClick={onRefreshDogs}>View Other Care Categories</Button>
      </CardContent>
    </Card>
  );
};

export default PottyBreaksTab;
