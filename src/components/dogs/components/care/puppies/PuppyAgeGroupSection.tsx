
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PuppyWithAge, PuppyAgeGroupData } from '@/types/puppyTracking';
import { Badge } from '@/components/ui/badge';
import { Grid } from 'lucide-react';
import PuppyCard from './PuppyCard';

interface PuppyAgeGroupSectionProps {
  ageGroup: PuppyAgeGroupData;
  puppies: PuppyWithAge[];
  onRefresh: () => void;
}

const PuppyAgeGroupSection: React.FC<PuppyAgeGroupSectionProps> = ({ 
  ageGroup, 
  puppies,
  onRefresh
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              {ageGroup.name}
              <Badge variant="outline" className="ml-2 bg-primary/10">
                {puppies.length} {puppies.length === 1 ? 'puppy' : 'puppies'}
              </Badge>
            </CardTitle>
            <CardDescription>
              {ageGroup.description}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs px-2 py-0 h-5">
            {ageGroup.startDay}-{ageGroup.endDay} days
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="text-sm font-medium flex items-center text-muted-foreground">
            <Grid className="h-3 w-3 mr-1" />
            Development Milestones
          </h4>
          <p className="text-sm mt-1">{ageGroup.milestones}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {puppies.map((puppy) => (
            <PuppyCard 
              key={puppy.id} 
              puppy={puppy} 
              ageGroup={ageGroup}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PuppyAgeGroupSection;
