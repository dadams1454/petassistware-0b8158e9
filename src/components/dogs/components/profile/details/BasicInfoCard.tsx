
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { DogProfile } from '@/types/dog';
import { format } from 'date-fns';

interface BasicInfoCardProps {
  dog: DogProfile;
}

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ dog }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Info className="mr-2 h-5 w-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Breed</p>
            <p>{dog.breed}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Gender</p>
            <p>{dog.gender}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Birth Date</p>
            <p>{dog.birthdate ? format(new Date(dog.birthdate), 'MMM d, yyyy') : 'Unknown'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Color</p>
            <p>{dog.color}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Weight</p>
            <p>{dog.weight} {dog.weight_unit}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="capitalize">{dog.status}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoCard;
