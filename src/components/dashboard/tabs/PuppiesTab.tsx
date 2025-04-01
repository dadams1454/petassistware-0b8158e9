
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Baby } from 'lucide-react';

interface PuppiesTabProps {
  onRefresh?: () => void;
}

const PuppiesTab: React.FC<PuppiesTabProps> = ({ onRefresh }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
          <Baby className="h-6 w-6 text-pink-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Puppy Management</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Manage your puppies, track their growth, and record important developmental milestones.
        </p>
        <Button onClick={() => navigate("/litters")}>Go to Litters</Button>
      </CardContent>
    </Card>
  );
};

export default PuppiesTab;
