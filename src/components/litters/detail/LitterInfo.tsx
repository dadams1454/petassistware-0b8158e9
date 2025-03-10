import React from 'react';
import { format } from 'date-fns';
import { CalendarCheck, Calendar, Dog as DogIcon, User as UserIcon } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';

interface LitterInfoProps {
  litter: Litter;
}

const LitterInfo: React.FC<LitterInfoProps> = ({ litter }) => {
  // Calculate the actual puppy count from the puppies array
  const actualPuppyCount = litter.puppies?.length || 0;
  
  // Count males and females
  const maleCount = litter.puppies?.filter(puppy => puppy.gender === 'Male').length || 0;
  const femaleCount = litter.puppies?.filter(puppy => puppy.gender === 'Female').length || 0;
  
  // Calculate litter age in weeks
  const calculateAgeInWeeks = () => {
    if (!litter.birth_date) return 'Unknown';
    
    const birthDate = new Date(litter.birth_date);
    const today = new Date();
    const diffTime = today.getTime() - birthDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    
    return weeks > 0 
      ? `${weeks} ${weeks === 1 ? 'week' : 'weeks'}${days > 0 ? `, ${days} ${days === 1 ? 'day' : 'days'}` : ''}`
      : `${days} ${days === 1 ? 'day' : 'days'}`;
  };

  return (
    <DashboardCard className="lg:col-span-1" title="Litter Information">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Birth Date</p>
              <p>{format(new Date(litter.birth_date), 'MMMM d, yyyy')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Age</p>
              <p>{calculateAgeInWeeks()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <DogIcon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Puppies</p>
              <p>{actualPuppyCount}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Males</p>
              <p>{maleCount}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-pink-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Females</p>
              <p>{femaleCount}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {litter.dam?.photo_url ? (
              <img src={litter.dam.photo_url} alt={litter.dam.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="h-6 w-6 text-pink-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Dam (Mother)</p>
            <p>{litter.dam?.name || 'Unknown'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {litter.sire?.photo_url ? (
              <img src={litter.sire.photo_url} alt={litter.sire.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="h-6 w-6 text-blue-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Sire (Father)</p>
            <p>{litter.sire?.name || 'Unknown'}</p>
          </div>
        </div>

        {litter.expected_go_home_date && (
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Expected Go-Home Date</p>
              <p>{format(new Date(litter.expected_go_home_date), 'MMMM d, yyyy')}</p>
            </div>
          </div>
        )}

        {litter.notes && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Notes</p>
            <p className="whitespace-pre-line">{litter.notes}</p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export default LitterInfo;
