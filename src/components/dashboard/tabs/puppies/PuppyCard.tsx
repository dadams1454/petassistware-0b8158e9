
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PencilIcon, PawPrint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PuppyWithAge, PuppyAgeGroupInfo } from '@/types';

interface PuppyCardProps {
  puppy: PuppyWithAge;
  ageGroup: PuppyAgeGroupInfo;
  onRefresh?: () => void;
}

const PuppyCard: React.FC<PuppyCardProps> = ({ puppy, ageGroup, onRefresh }) => {
  const navigate = useNavigate();
  
  const handleGoToPuppy = () => {
    if (puppy.litter_id) {
      navigate(`/litters/${puppy.litter_id}/puppies/${puppy.id}`);
    } else {
      navigate(`/puppies/${puppy.id}`);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{puppy.name || `Puppy #${puppy.id.substring(0, 4)}`}</h3>
            {puppy.litter_id && (
              <p className="text-xs text-muted-foreground">Litter: {puppy.litter_id.substring(0, 8)}</p>
            )}
          </div>
          <Badge variant={puppy.status === 'Available' ? 'default' : 'secondary'} className="capitalize">
            {puppy.status || 'Available'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-sm">
            <span className="text-muted-foreground">Age:</span>{' '}
            <span className="font-medium">
              {puppy.ageInWeeks || 0} weeks ({puppy.ageInDays || 0} days)
            </span>
          </div>
          
          <div className="text-sm">
            <span className="text-muted-foreground">Gender:</span>{' '}
            <span className="font-medium capitalize">{puppy.gender || 'Unknown'}</span>
          </div>
          
          {puppy.color && (
            <div className="text-sm">
              <span className="text-muted-foreground">Color:</span>{' '}
              <span className="font-medium">{puppy.color}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between">
          <Button size="sm" variant="outline" onClick={handleGoToPuppy}>
            <PawPrint className="h-4 w-4 mr-1" />
            {ageGroup.displayName} Care
          </Button>
          
          <Button size="sm" variant="ghost" onClick={handleGoToPuppy}>
            <PencilIcon className="h-4 w-4 mr-1" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PuppyCard;
