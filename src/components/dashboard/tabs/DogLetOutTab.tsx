
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DogCareStatus } from '@/types/dailyCare';
import { Dog } from 'lucide-react';

interface DogLetOutTabProps {
  onRefreshDogs: () => void;
  dogStatuses?: DogCareStatus[];
}

const DogLetOutTab: React.FC<DogLetOutTabProps> = ({ 
  onRefreshDogs,
  dogStatuses = []
}) => {
  const navigate = useNavigate();

  const handleGoDailyCare = () => {
    navigate('/daily-care');
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <Dog className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Dog Let Out Feature</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          The Dog Let Out feature is now available in the Daily Care section.
          Please use the Daily Care tab and select the Dog Let Out category to access this feature.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          <Button variant="outline" onClick={handleGoDailyCare}>Go to Daily Care</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DogLetOutTab;
