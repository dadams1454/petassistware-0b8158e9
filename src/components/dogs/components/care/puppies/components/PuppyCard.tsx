
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Baby, Scale, CalendarDays } from 'lucide-react';
import { PuppyWithAge } from '@/types/puppyTracking';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface PuppyCardProps {
  puppy: PuppyWithAge;
  onViewDetails?: (puppyId: string) => void;
}

const PuppyCard: React.FC<PuppyCardProps> = ({ puppy, onViewDetails }) => {
  const handleViewDetails = () => {
    if (onViewDetails) onViewDetails(puppy.id);
  };
  
  // Format the puppy's age to be more readable
  const formattedAge = puppy.ageInDays < 7 
    ? `${puppy.ageInDays} days` 
    : puppy.ageInDays < 31 
      ? `${Math.floor(puppy.ageInDays / 7)} weeks, ${puppy.ageInDays % 7} days`
      : `${Math.floor(puppy.ageInDays / 30)} months`;
      
  // Format the puppy's birth date if available
  const birthDateText = puppy.birth_date 
    ? formatDistanceToNow(new Date(puppy.birth_date), { addSuffix: true })
    : puppy.litters?.birth_date
      ? formatDistanceToNow(new Date(puppy.litters.birth_date), { addSuffix: true })
      : 'Unknown';
      
  // Get puppy gender for display
  const genderDisplay = puppy.gender === 'male' ? 'Male' : puppy.gender === 'female' ? 'Female' : 'Unknown';
  
  // Get puppy color for display
  const colorDisplay = puppy.color || 'Not specified';
  
  // Get the latest weight if available
  const weightDisplay = puppy.weight ? `${puppy.weight} lbs` : 'Not recorded';
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative pt-4 px-4 flex items-center justify-center bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className="bg-white/80 dark:bg-black/50 backdrop-blur-sm">
            {genderDisplay}
          </Badge>
        </div>
        <div className="h-24 w-24 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
          <Baby className="h-12 w-12 text-purple-600 dark:text-purple-400" />
        </div>
      </div>
      
      <CardContent className="pt-4 px-6 pb-2 flex-grow">
        <h3 className="text-lg font-semibold text-center mb-1">{puppy.name || `Puppy ${puppy.microchip_number || '#'+puppy.id.substring(0, 4)}`}</h3>
        <p className="text-sm text-center text-muted-foreground mb-4">
          {puppy.litters?.name ? `Litter: ${puppy.litters.name}` : 'Unknown litter'}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Age:</span>
            <span className="ml-auto font-medium">{formattedAge}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Scale className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Weight:</span>
            <span className="ml-auto font-medium">{weightDisplay}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <div className="h-4 w-4 mr-2 rounded-full" 
              style={{ backgroundColor: puppy.color ? puppy.color : '#cccccc' }} />
            <span className="text-muted-foreground">Color:</span>
            <span className="ml-auto font-medium">{colorDisplay}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-2">
        <Button 
          onClick={handleViewDetails} 
          variant="outline" 
          className="w-full"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PuppyCard;
