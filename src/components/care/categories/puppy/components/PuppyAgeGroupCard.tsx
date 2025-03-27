
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PuppyAgeGroup } from '@/types/careCategories';
import { Baby, Check } from 'lucide-react';

interface PuppyAgeGroupCardProps {
  ageGroup: PuppyAgeGroup;
  onSelect: () => void;
}

const PuppyAgeGroupCard: React.FC<PuppyAgeGroupCardProps> = ({ ageGroup, onSelect }) => {
  // You could potentially add dynamic coloring based on age group
  const getAgeGroupColor = (ageGroupId: string) => {
    switch (ageGroupId) {
      case 'first-48':
        return 'border-l-4 border-l-red-500';
      case 'first-week':
        return 'border-l-4 border-l-orange-500';
      case 'week-2-3':
        return 'border-l-4 border-l-yellow-500';
      case 'week-3-6':
        return 'border-l-4 border-l-green-500';
      case 'week-6-8':
        return 'border-l-4 border-l-blue-500';
      case 'week-8-10':
        return 'border-l-4 border-l-purple-500';
      default:
        return '';
    }
  };
  
  return (
    <Card className={`hover:shadow-md transition-shadow ${getAgeGroupColor(ageGroup.id)}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Baby className="h-5 w-5 mr-2" />
          {ageGroup.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{ageGroup.range}</p>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm">{ageGroup.description}</p>
        <ul className="mt-2 space-y-1">
          {ageGroup.tasks.slice(0, 3).map((task) => (
            <li key={task.id} className="text-xs flex items-start">
              <Check className="h-3 w-3 mr-1 mt-0.5 text-green-500" />
              <span>{task.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline" onClick={onSelect} className="w-full">
          Log Care Activity
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PuppyAgeGroupCard;
