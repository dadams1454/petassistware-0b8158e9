
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PuppyAgeGroup, PuppyWithAge } from '@/types';
import PuppyCard from './PuppyCard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PuppyAgeGroupSectionProps {
  ageGroup: PuppyAgeGroup;
  puppies: PuppyWithAge[];
  onRefresh?: () => void;
}

const PuppyAgeGroupSection: React.FC<PuppyAgeGroupSectionProps> = ({
  ageGroup,
  puppies,
  onRefresh
}) => {
  const navigate = useNavigate();
  
  const handleViewAll = () => {
    navigate(`/puppies/age-group/${ageGroup.id}`);
  };
  
  return (
    <Card className={cn("relative overflow-hidden border-t-4", `border-t-[${ageGroup.color}]`)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          {ageGroup.name}
        </CardTitle>
        <CardDescription>
          {ageGroup.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {puppies.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No puppies in this age group
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {puppies.slice(0, 4).map((puppy) => (
              <PuppyCard
                key={puppy.id}
                puppy={puppy}
                ageGroup={ageGroup}
                onRefresh={onRefresh}
              />
            ))}
          </div>
        )}
        
        {puppies.length > 4 && (
          <div className="mt-4 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs" 
              onClick={handleViewAll}
            >
              View all {puppies.length} puppies
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PuppyAgeGroupSection;
