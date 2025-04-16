
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PuppyWithAge } from '@/modules/puppies/types';

interface PuppyCardProps {
  puppy: PuppyWithAge;
  onClick?: () => void;
}

const PuppyCard: React.FC<PuppyCardProps> = ({ puppy, onClick }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getGenderColor = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'male':
        return 'text-blue-500';
      case 'female':
        return 'text-pink-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
    
    switch (status.toLowerCase()) {
      case 'available':
        variant = 'default';
        break;
      case 'reserved':
        variant = 'secondary';
        break;
      case 'sold':
        variant = 'outline';
        break;
      case 'keeping':
        variant = 'secondary';
        break;
      case 'deceased':
        variant = 'destructive';
        break;
      default:
        variant = 'outline';
    }
    
    return (
      <Badge variant={variant} className="ml-2">
        {status}
      </Badge>
    );
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="p-3 pb-0">
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10 border">
            {puppy.photo_url && (
              <AvatarImage src={puppy.photo_url} alt={puppy.name} />
            )}
            <AvatarFallback>{getInitials(puppy.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">
              {puppy.name}
              {puppy.status && getStatusBadge(puppy.status)}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className={getGenderColor(puppy.gender)}>
                {puppy.gender}
              </span>
              {puppy.collar_color && (
                <span className="ml-2">
                  • {puppy.collar_color} collar
                </span>
              )}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="text-sm grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-muted-foreground">Age</p>
            <p>{puppy.age_description || `${puppy.age_weeks || 0} weeks`}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Color</p>
            <p>{puppy.color || 'Unknown'}</p>
          </div>
          {puppy.weight_current && puppy.weight_unit && (
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground">Weight</p>
              <p>{puppy.weight_current} {puppy.weight_unit}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PuppyCard;
