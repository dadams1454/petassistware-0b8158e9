
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PuppyWithAge, PuppyAgeGroupData } from '@/types/puppyTracking';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Baby, Calendar, Ruler, Weight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface PuppyCardProps {
  puppy: PuppyWithAge;
  ageGroup: PuppyAgeGroupData;
}

const PuppyCard: React.FC<PuppyCardProps> = ({ puppy, ageGroup }) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    // Navigate to puppy details in the litter context
    if (puppy.litter_id) {
      navigate(`/litters/${puppy.litter_id}/puppies/${puppy.id}`);
    }
  };
  
  const getGenderColor = (gender: string | null) => {
    return gender?.toLowerCase() === 'male' ? 'text-blue-500' : 'text-pink-500';
  };
  
  const getBirthDateFormatted = () => {
    if (!puppy.birth_date) return 'Unknown';
    return new Date(puppy.birth_date).toLocaleDateString();
  };
  
  const getInitials = () => {
    if (!puppy.name) return 'PUP';
    return puppy.name.substring(0, 2).toUpperCase();
  };
  
  const getStatusColor = () => {
    switch (puppy.status?.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'reserved':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'sold':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'kept':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default:
        return '';
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-center border-b p-4 bg-muted/30">
        <Avatar className="h-12 w-12 mr-3">
          <AvatarImage src={puppy.photo_url as string || undefined} alt={puppy.name || 'Puppy'} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-medium line-clamp-1">
            {puppy.name || 'Unnamed Puppy'}
          </h3>
          <div className="flex gap-1 items-center text-xs text-muted-foreground">
            <span className={getGenderColor(puppy.gender)}>
              {puppy.gender || 'Unknown'}
            </span>
            <span>•</span>
            <span>{puppy.color || 'Unknown color'}</span>
          </div>
        </div>
        <Badge variant="outline" className={getStatusColor()}>
          {puppy.status || 'Available'}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Baby className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Age:</span>
            <span className="font-medium">{puppy.ageInDays} days</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Born:</span>
            <span className="font-medium">{getBirthDateFormatted()}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Weight className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Weight:</span>
            <span className="font-medium">
              {puppy.current_weight ? `${puppy.current_weight}` : 'Not recorded'}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <Ruler className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Stage:</span>
            <span className="font-medium">{ageGroup.name}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-3 px-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full flex items-center justify-center gap-1"
          onClick={handleViewDetails}
        >
          <span>View Details</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PuppyCard;
