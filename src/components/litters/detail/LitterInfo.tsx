
import React from 'react';
import { format, differenceInWeeks, differenceInDays } from 'date-fns';
import { Circle, Calendar, Info, Users, Heart, Dog, MessageSquare } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Litter, SimpleDog } from '@/types/litter'; // Import SimpleDog type

interface LitterInfoProps {
  litter: Litter;
}

const LitterInfo: React.FC<LitterInfoProps> = ({ litter }) => {
  // Calculate the actual puppy count from the puppies array
  const actualPuppyCount = litter.puppies?.length || 0;
  
  // Calculate gender breakdown
  const maleCount = litter.puppies?.filter(p => p.gender === 'Male').length || 0;
  const femaleCount = litter.puppies?.filter(p => p.gender === 'Female').length || 0;
  const unknownGenderCount = actualPuppyCount - maleCount - femaleCount;
  
  // Calculate age in weeks and days
  const birthDate = new Date(litter.birth_date);
  const currentDate = new Date();
  const ageInWeeks = differenceInWeeks(currentDate, birthDate);
  const ageInDays = differenceInDays(currentDate, birthDate) % 7;
  
  const getAgeDisplay = () => {
    if (ageInWeeks === 0) {
      return `${ageInDays} day${ageInDays !== 1 ? 's' : ''}`;
    } else if (ageInDays === 0) {
      return `${ageInWeeks} week${ageInWeeks !== 1 ? 's' : ''}`;
    } else {
      return `${ageInWeeks} week${ageInWeeks !== 1 ? 's' : ''}, ${ageInDays} day${ageInDays !== 1 ? 's' : ''}`;
    }
  };

  return (
    <DashboardCard className="lg:col-span-1" title="Litter Information">
      <div className="space-y-6">
        {/* Birth Date and Age */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Calendar className="h-5 w-5" />
            <h3 className="font-medium">Birth & Age</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 pl-7">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Birth Date</p>
              <p className="font-medium">{format(birthDate, 'MMMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Age</p>
              <p className="font-medium">{getAgeDisplay()}</p>
            </div>
          </div>
        </div>

        {/* Puppy Count and Gender Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Users className="h-5 w-5" />
            <h3 className="font-medium">Puppy Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 pl-7">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Count</p>
              <p className="font-medium">{actualPuppyCount} {actualPuppyCount === 1 ? 'puppy' : 'puppies'}</p>
            </div>
          </div>
          
          {/* Gender Breakdown */}
          <div className="pl-7 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Gender Breakdown</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <Circle className="h-3 w-3 fill-blue-500 text-blue-500" />
                <span className="text-sm">{maleCount} Male{maleCount !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Circle className="h-3 w-3 fill-pink-500 text-pink-500" />
                <span className="text-sm">{femaleCount} Female{femaleCount !== 1 ? 's' : ''}</span>
              </div>
              {unknownGenderCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <Circle className="h-3 w-3 fill-gray-400 text-gray-400" />
                  <span className="text-sm">{unknownGenderCount} Unknown</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Parents Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Dog className="h-5 w-5" />
            <h3 className="font-medium">Parents</h3>
          </div>
          <div className="pl-7 space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dam (Mother)</p>
              <p className="font-medium">{litter.dam?.name || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sire (Father)</p>
              <p className="font-medium">{litter.sire?.name || 'Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Notes if available */}
        {litter.notes && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <MessageSquare className="h-5 w-5" />
              <h3 className="font-medium">Additional Notes</h3>
            </div>
            <div className="pl-7">
              <p className="whitespace-pre-line text-sm">{litter.notes}</p>
            </div>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export default LitterInfo;
