
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
  
  const getGenderColor = (gender: string) => {
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
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={puppy.photo_url || undefined} alt={puppy.name || 'Puppy'} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">
                {puppy.name || 'Unnamed Puppy'}
              </CardTitle>
              <div className="flex gap-1 items-center text-xs text-muted-foreground">
                <span className={getGenderColor(puppy.gender || '')}>
                  {puppy.gender || 'Unknown'}
                </span>
                <span>•</span>
                <span>{puppy.color || 'Unknown color'}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline">
            {puppy.status || 'Available'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
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
        
        <div className="mt-3 p-2 rounded-md bg-primary/5 text-xs">
          <h4 className="font-medium mb-1">Upcoming Milestones:</h4>
          <p className="text-muted-foreground line-clamp-2">{ageGroup.milestones}</p>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 pb-3">
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
