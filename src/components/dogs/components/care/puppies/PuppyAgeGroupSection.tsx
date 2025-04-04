
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PuppyWithAge, PuppyAgeGroup } from '@/types/puppyTracking';
import { Skeleton } from '@/components/ui/skeleton';

interface PuppyAgeGroupSectionProps {
  ageGroup: PuppyAgeGroup;
  puppies: PuppyWithAge[];
  onRefresh: () => void;
}

const PuppyAgeGroupSection: React.FC<PuppyAgeGroupSectionProps> = ({
  ageGroup,
  puppies,
  onRefresh
}) => {
  if (!puppies || puppies.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/20 pb-3">
        <CardTitle className="text-base flex justify-between items-center">
          <span>
            {ageGroup.name} ({puppies.length})
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {ageGroup.description}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {puppies.map(puppy => (
            <PuppyCard key={puppy.id} puppy={puppy} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Simple PuppyCard component
const PuppyCard: React.FC<{ puppy: PuppyWithAge }> = ({ puppy }) => {
  return (
    <div className="border rounded-md p-3 flex items-center gap-3">
      <div className="h-12 w-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
        {puppy.photo_url ? (
          <img 
            src={puppy.photo_url} 
            alt={puppy.name} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary/50">
            {puppy.name?.substring(0, 1) || '?'}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{puppy.name}</h4>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span>{puppy.gender || 'Unknown'}</span>
          {puppy.ageInDays !== undefined && (
            <span>• {puppy.ageInDays} days</span>
          )}
        </div>
        <div className="mt-1">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            puppy.status === 'Available' ? 'bg-green-100 text-green-800' :
            puppy.status === 'Reserved' ? 'bg-blue-100 text-blue-800' :
            puppy.status === 'Sold' ? 'bg-gray-100 text-gray-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {puppy.status || 'Unknown'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton for the puppy age group section
export const PuppyAgeGroupSectionSkeleton = () => (
  <Card>
    <CardHeader className="pb-3">
      <Skeleton className="h-6 w-1/3" />
    </CardHeader>
    <CardContent className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border rounded-md p-3 flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-2" />
              <Skeleton className="h-5 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default PuppyAgeGroupSection;
