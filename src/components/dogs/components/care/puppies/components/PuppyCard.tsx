
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, PawPrint, Scale } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { differenceInDays, format } from 'date-fns';
import { PuppyWithAge } from '@/types/puppyTracking';
import { Link } from 'react-router-dom';

interface PuppyCardProps {
  puppy: PuppyWithAge;
  className?: string;
}

const PuppyCard: React.FC<PuppyCardProps> = ({ puppy, className }) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Unknown';
    }
  };

  // Calculate age in weeks from days
  const ageInWeeks = Math.floor(puppy.ageInDays || 0 / 7);
  
  // Determine badge color based on gender
  const genderBadgeColor = puppy.gender === 'Male' 
    ? "bg-blue-100 text-blue-800" 
    : "bg-pink-100 text-pink-800";

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex justify-between items-center">
          <span>{puppy.name || `Puppy ${puppy.id?.substring(0, 4) || '#'}`}</span>
          <Badge variant="outline" className={genderBadgeColor}>
            {puppy.gender}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Age</p>
            <p className="font-medium">{ageInWeeks} weeks ({puppy.ageInDays} days)</p>
          </div>
          <div>
            <p className="text-muted-foreground">Color</p>
            <p className="font-medium">{puppy.color || 'Not specified'}</p>
          </div>
          {puppy.current_weight && (
            <div className="col-span-2">
              <p className="text-muted-foreground">Current Weight</p>
              <p className="font-medium">{puppy.current_weight} {puppy.current_weight_unit || puppy.weight_unit || 'oz'}</p>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 pt-2">
          {puppy.litter_id && (
            <>
              <Link 
                to={`/litters/${puppy.litter_id}/puppies/${puppy.id}`}
                className="text-xs flex items-center gap-1 text-primary hover:underline"
              >
                <PawPrint className="h-3 w-3" /> View Details
              </Link>
              
              <Link 
                to={`/litters/${puppy.litter_id}/puppies/${puppy.id}/weight`}
                className="text-xs flex items-center gap-1 text-primary hover:underline"
              >
                <Scale className="h-3 w-3" /> Weight Tracking
              </Link>
              
              <Link 
                to={`/litters/${puppy.litter_id}/puppies/${puppy.id}/chart`}
                className="text-xs flex items-center gap-1 text-primary hover:underline"
              >
                <BarChart className="h-3 w-3" /> Growth Charts
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PuppyCard;
