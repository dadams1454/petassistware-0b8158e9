
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/standardized';
import { Dog } from 'lucide-react';

const NoDogsCareState: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigateToDogs = () => {
    navigate('/dogs');
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <EmptyState
          icon={<Dog className="h-12 w-12 text-muted-foreground" />}
          title="No Dogs Found"
          description="Add dogs to your kennel to start tracking their daily care activities."
          action={{
            label: "Add Dogs",
            onClick: handleNavigateToDogs
          }}
        />
      </CardContent>
    </Card>
  );
};

export default NoDogsCareState;
