
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PuppyCard from './PuppyCard';
import { PuppyWithAge } from '@/modules/puppies/types';

interface PuppyAgeGroupSectionProps {
  name: string;
  puppies: PuppyWithAge[];
  description?: string;
  onPuppyClick?: (puppyId: string) => void;
  emptyState?: React.ReactNode;
}

const PuppyAgeGroupSection: React.FC<PuppyAgeGroupSectionProps> = ({
  name,
  puppies,
  description,
  onPuppyClick,
  emptyState,
}) => {
  if (!puppies || puppies.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {name}
          </CardTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardHeader>
        <CardContent>
          {emptyState || (
            <div className="text-center py-4 text-muted-foreground">
              No puppies in this age group
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {name}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({puppies.length} {puppies.length === 1 ? 'puppy' : 'puppies'})
          </span>
        </CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {puppies.map((puppy) => (
            <PuppyCard
              key={puppy.id}
              puppy={puppy}
              onClick={() => onPuppyClick && onPuppyClick(puppy.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PuppyAgeGroupSection;
