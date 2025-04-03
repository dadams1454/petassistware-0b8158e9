
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PuppyWithAge, PuppyAgeGroupData } from '@/types/puppyTracking';
import PuppyCard from './PuppyCard';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
  if (!puppies.length) return null;

  // Sort puppies by age, youngest first
  const sortedPuppies = [...puppies].sort((a, b) => a.ageInDays - b.ageInDays);

  // Get color for badge
  const getBadgeColorClass = () => {
    switch (ageGroup.color) {
      case 'blue': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'purple': return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'green': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'amber': return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'orange': return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      default: return 'bg-slate-100 text-slate-800 hover:bg-slate-100';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            {ageGroup.name}
            <Badge className={`ml-2 ${getBadgeColorClass()}`}>
              {puppies.length} {puppies.length === 1 ? 'puppy' : 'puppies'}
            </Badge>
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {ageGroup.startDay}-{ageGroup.endDay} days
          </div>
        </div>
        {ageGroup.description && (
          <p className="text-sm text-muted-foreground mt-1">{ageGroup.description}</p>
        )}
      </CardHeader>
      
      <CardContent>
        {/* Care checks section */}
        {ageGroup.careChecks && ageGroup.careChecks.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Care Focus</h4>
            <div className="flex flex-wrap gap-1">
              {ageGroup.careChecks.map((check, index) => (
                <Badge key={index} variant="outline" className="bg-slate-50">
                  {check}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <Separator className="my-4" />
        
        {/* Puppies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {sortedPuppies.map(puppy => (
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
