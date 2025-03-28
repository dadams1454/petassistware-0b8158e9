
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DogCareStatus } from '@/types/dailyCare';
import { Dog } from 'lucide-react';

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
          <Dog className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Dog Let Out Feature</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          The Potty Breaks feature has been replaced with the Dog Let Out feature.
          Please use the Daily Care section with the Dog Let Out tab for tracking when dogs are let outside.
        </p>
        <Button onClick={() => navigate("/dogs/care")}>Go to Daily Care</Button>
      </CardContent>
    </Card>
  );
};

export default PottyBreaksTab;
