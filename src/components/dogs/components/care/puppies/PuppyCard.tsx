
import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PencilLine, Weight, Thermometer, Calendar, Eye } from 'lucide-react';
import { PuppyWithAge } from '@/types/puppyTracking';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface PuppyCardProps {
  puppy: PuppyWithAge;
  onRefresh: () => void;
}

const PuppyCard: React.FC<PuppyCardProps> = ({ puppy, onRefresh }) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    // Navigate to puppy details page
    navigate(`/litters/${puppy.litter_id}/puppies/${puppy.id}`);
  };
  
  // Helper to get gender icon
  const getGenderIcon = () => {
    if (!puppy.gender) return null;
    
    if (puppy.gender.toLowerCase().startsWith('m')) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Male
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
          Female
        </Badge>
      );
    }
  };
  
  // Format birth date
  const birthDateDisplay = puppy.birth_date 
    ? format(new Date(puppy.birth_date), 'MMM d, yyyy')
    : 'Unknown';
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-center border-b p-3 bg-muted/30">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
          {puppy.photo_url ? (
            <img 
              src={puppy.photo_url} 
              alt={puppy.name || 'Puppy'} 
              className="h-full w-full object-cover rounded-full"
            />
          ) : (
            <span className="text-lg font-semibold text-primary">
              {(puppy.name || 'P').charAt(0)}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <div className="font-medium">
            {puppy.name || `Puppy #${puppy.id.substring(0, 4)}`}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {getGenderIcon()}
            <span>Age: {puppy.ageInDays} days</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span className="text-muted-foreground">Born:</span>
          </div>
          <div className="font-medium">{birthDateDisplay}</div>
          
          <div className="flex items-center">
            <Weight className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span className="text-muted-foreground">Weight:</span>
          </div>
          <div className="font-medium">
            {puppy.current_weight || puppy.birth_weight || 'Not recorded'}
          </div>
          
          <div className="flex items-center">
            <Thermometer className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span className="text-muted-foreground">Status:</span>
          </div>
          <div className="font-medium">
            {puppy.status || 'Available'}
          </div>
        </div>
        
        {/* Growth progress bar */}
        <div className="mt-1 pt-1">
          <div className="text-xs flex justify-between mb-1">
            <span className="text-muted-foreground">Development Progress</span>
            <span className="font-medium">{Math.min(100, Math.round(puppy.ageInDays / 70 * 100))}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className="bg-primary rounded-full h-1.5" 
              style={{ width: `${Math.min(100, Math.round(puppy.ageInDays / 70 * 100))}%` }}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-between border-t mt-1">
        <Button variant="outline" size="sm" className="h-8" onClick={handleViewDetails}>
          <Eye className="h-3.5 w-3.5 mr-1.5" />
          Details
        </Button>
        <Button variant="outline" size="sm" className="h-8" onClick={handleViewDetails}>
          <PencilLine className="h-3.5 w-3.5 mr-1.5" />
          Log Care
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PuppyCard;
