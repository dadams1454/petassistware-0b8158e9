
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Plus, Dog } from 'lucide-react';
import { DogCareCard } from '@/components/dashboard/DogCareCard';
import { EmptyState } from '@/components/ui/standardized';

interface DogCardViewProps {
  dogs: any[] | null;
  navigateToDogs: () => void;
}

const DogCardView: React.FC<DogCardViewProps> = ({ dogs, navigateToDogs }) => {
  if (!dogs || dogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Dogs Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Add dogs to start tracking their care activities.</p>
          <Button onClick={navigateToDogs} className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Add Dogs
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dogs.map((dog) => (
        <DogCareCard key={dog.id} dog={dog} />
      ))}
    </div>
  );
};

export default DogCardView;
