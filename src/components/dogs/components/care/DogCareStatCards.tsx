import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PawPrint, AlertCircle, Flag, Heart, Slash } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';

interface DogCareStatCardsProps {
  dogsStatus: DogCareStatus[];
  careCompletionPercentage: number;
}

const DogCareStatCards: React.FC<DogCareStatCardsProps> = ({
  dogsStatus,
  careCompletionPercentage
}) => {
  // Get dogs that need care (no logs today)
  const dogsNeedingCare = dogsStatus.filter(dog => dog.last_care === null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dogs Cared For</p>
              <h3 className="text-2xl font-bold">{dogsStatus.filter(dog => dog.last_care !== null).length} / {dogsStatus.length}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <PawPrint className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <Progress value={careCompletionPercentage} className="mt-4" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Need Attention</p>
              <h3 className="text-2xl font-bold">{dogsNeedingCare.length}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {dogsNeedingCare.length > 0 ? 
              `${dogsNeedingCare.map(d => d.dog_name).slice(0, 3).join(', ')}${dogsNeedingCare.length > 3 ? ` and ${dogsNeedingCare.length - 3} more` : ''}` : 
              'All dogs have been cared for today!'
            }
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Special Flags</p>
              <h3 className="text-2xl font-bold">
                {dogsStatus.filter(dog => dog.flags && dog.flags.length > 0).length}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Flag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-red-100 text-red-800">
              <Heart className="h-3 w-3 mr-1 fill-red-500 text-red-500" />
              In Heat: {dogsStatus.filter(dog => dog.flags.some(f => f.type === 'in_heat')).length}
            </Badge>
            <Badge variant="outline" className="bg-amber-100 text-amber-800">
              <Slash className="h-3 w-3 mr-1 text-amber-500" />
              Incompatible: {dogsStatus.filter(dog => dog.flags.some(f => f.type === 'incompatible')).length}
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              <AlertCircle className="h-3 w-3 mr-1 text-blue-500" />
              Special: {dogsStatus.filter(dog => dog.flags.some(f => f.type === 'special_attention')).length}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DogCareStatCards;
