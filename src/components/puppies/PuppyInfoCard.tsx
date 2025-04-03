
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Ruler, User, CircleDollarSign } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import { Puppy } from '@/types/puppy';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PuppyInfoCardProps {
  puppy: Puppy;
}

const PuppyInfoCard: React.FC<PuppyInfoCardProps> = ({ puppy }) => {
  const getAgeInDays = () => {
    if (!puppy.birth_date) return null;
    return differenceInDays(new Date(), new Date(puppy.birth_date));
  };

  const getAgeInWeeks = () => {
    const days = getAgeInDays();
    if (days === null) return null;
    return Math.floor(days / 7);
  };

  const ageInDays = getAgeInDays();
  const ageInWeeks = getAgeInWeeks();

  const genderColor = puppy.gender === 'Male' 
    ? 'text-blue-500' 
    : puppy.gender === 'Female' 
    ? 'text-pink-500' 
    : 'text-gray-500';

  const getStatusColor = () => {
    switch (puppy.status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Reserved':
        return 'bg-amber-100 text-amber-800';
      case 'Sold':
        return 'bg-blue-100 text-blue-800';
      case 'Unavailable':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Generate initials from puppy name
  const getInitials = () => {
    if (!puppy.name) return 'P';
    return puppy.name.charAt(0).toUpperCase();
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-primary-50 dark:bg-primary-950 p-4 flex items-center space-x-4 border-b">
        <Avatar className="h-16 w-16 border-2 border-primary-100 dark:border-primary-800">
          <AvatarImage src={puppy.photo_url || undefined} alt={puppy.name || 'Puppy'} />
          <AvatarFallback className="bg-primary-100 text-primary-700 text-xl">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{puppy.name || 'Unnamed Puppy'}</h2>
            <Badge className={getStatusColor()}>
              {puppy.status}
            </Badge>
          </div>
          
          <div className="flex items-center text-sm mt-1">
            <span className={`mr-2 font-medium ${genderColor}`}>{puppy.gender}</span>
            <span className="mx-1 text-gray-400">•</span>
            <span className="text-gray-600 dark:text-gray-300">{puppy.color}</span>
            
            {puppy.birth_order && (
              <>
                <span className="mx-1 text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-300">
                  Birth order: #{puppy.birth_order}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-gray-500">Birth Date</p>
            <p className="font-medium">
              {puppy.birth_date 
                ? format(new Date(puppy.birth_date), 'MMM d, yyyy') 
                : 'Unknown'}
            </p>
          </div>
        </div>
        
        {ageInDays !== null && (
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-gray-500">Age</p>
              <p className="font-medium">
                {ageInWeeks} weeks ({ageInDays} days)
              </p>
            </div>
          </div>
        )}
        
        {puppy.current_weight && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-gray-500">Current Weight</p>
              <p className="font-medium">
                {puppy.current_weight} {puppy.weight_unit || 'oz'}
              </p>
            </div>
          </div>
        )}
        
        {puppy.sale_price && (
          <div className="flex items-center gap-2">
            <CircleDollarSign className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-gray-500">Sale Price</p>
              <p className="font-medium">${puppy.sale_price}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PuppyInfoCard;
