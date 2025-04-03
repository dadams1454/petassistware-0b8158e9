
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Weight, Ruler, Calendar, Syringe, FileEdit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PuppyWithAge, PuppyAgeGroupData } from '@/types/puppyTracking';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface PuppyCardProps {
  puppy: PuppyWithAge;
  ageGroup: PuppyAgeGroupData;
  onRefresh: () => void;
}

const PuppyCard: React.FC<PuppyCardProps> = ({ puppy, ageGroup, onRefresh }) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/litters/${puppy.litter_id}/puppies/${puppy.id}`);
  };
  
  // Safe access to puppy properties with nullish coalescing
  const puppyName = puppy.name || 'Unnamed Puppy';
  const litterName = puppy.litters?.litter_name || puppy.litters?.name || 'Unknown Litter';
  const puppyStatus = puppy.status || 'Available';
  const puppyGender = puppy.gender || 'Unknown';
  const ageInDays = puppy.age_days || 0;
  const currentWeight = puppy.current_weight || 'Not recorded';
  
  return (
    <Card className="overflow-hidden">
      <div className="h-40 overflow-hidden relative bg-muted">
        {puppy.photo_url ? (
          <img 
            src={puppy.photo_url} 
            alt={puppyName} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">No image available</p>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="font-medium">
            {puppyGender}
          </Badge>
        </div>
      </div>
      
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={puppy.photo_url || ''} alt={puppyName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {(puppyName[0] || 'P').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{puppyName}</h3>
              <p className="text-xs text-muted-foreground">
                {litterName}
              </p>
            </div>
          </div>
          <Badge variant={puppyStatus === 'Reserved' ? 'destructive' : 'default'}>
            {puppyStatus}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-3">
          <div className="flex items-center text-sm">
            <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">Age:</span>
          </div>
          <div className="text-sm font-medium text-right">
            {ageInDays} days
          </div>
          
          <div className="flex items-center text-sm">
            <Weight className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">Weight:</span>
          </div>
          <div className="text-sm font-medium text-right">
            {currentWeight}
          </div>
          
          <div className="flex items-center text-sm">
            <Syringe className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">Status:</span>
          </div>
          <div className="text-sm font-medium text-right">
            {ageGroup.name}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm" onClick={handleViewDetails}>
          <FileEdit className="h-3.5 w-3.5 mr-1" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PuppyCard;
