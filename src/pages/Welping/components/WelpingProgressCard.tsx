
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { differenceInDays } from 'date-fns';
import { Litter } from '../types';

interface WelpingProgressCardProps {
  litter: Litter;
  puppiesCount: number;
}

const WelpingProgressCard: React.FC<WelpingProgressCardProps> = ({ litter, puppiesCount }) => {
  // Calculate birth progress
  const birthProgress = () => {
    if (!litter.total_puppies || litter.total_puppies === 0) return 100;
    return Math.min(100, Math.round((puppiesCount / litter.total_puppies) * 100));
  };
  
  // Calculate days since birth
  const daysSinceBirth = () => {
    const birthDate = new Date(litter.birth_date);
    return differenceInDays(new Date(), birthDate);
  };
  
  // Calculate developmental stage progress
  const developmentalProgress = () => {
    const days = daysSinceBirth();
    
    // Approximate developmental stages for puppies
    // 0-14 days: Neonatal
    // 15-21 days: Transitional
    // 22-49 days: Socialization
    // 50-84 days: Juvenile
    
    if (days < 0) return 0;
    if (days <= 14) return Math.round((days / 14) * 25);
    if (days <= 21) return 25 + Math.round(((days - 14) / 7) * 25);
    if (days <= 49) return 50 + Math.round(((days - 21) / 28) * 25);
    if (days <= 84) return 75 + Math.round(((days - 49) / 35) * 25);
    return 100;
  };
  
  // Determine current stage based on days
  const currentStage = () => {
    const days = daysSinceBirth();
    
    if (days < 0) return 'Pre-birth';
    if (days <= 14) return 'Neonatal';
    if (days <= 21) return 'Transitional';
    if (days <= 49) return 'Socialization';
    if (days <= 84) return 'Juvenile';
    return 'Adolescent';
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Whelping Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Birth Progress</span>
            <span className="font-medium">{birthProgress()}%</span>
          </div>
          <Progress value={birthProgress()} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {puppiesCount} of {litter.total_puppies || '?'} puppies recorded
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Development Stage</span>
            <span className="font-medium">{currentStage()}</span>
          </div>
          <Progress value={developmentalProgress()} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {daysSinceBirth()} days since birth
          </p>
        </div>
        
        <div className="pt-2">
          <h4 className="text-sm font-medium mb-2">Current Milestones</h4>
          <ul className="text-xs space-y-1">
            {daysSinceBirth() < 0 && (
              <li>• Preparing for birth</li>
            )}
            {daysSinceBirth() >= 0 && daysSinceBirth() <= 14 && (
              <>
                <li>• Eyes and ears closed</li>
                <li>• Unable to regulate body temperature</li>
                <li>• Requires mother's care</li>
              </>
            )}
            {daysSinceBirth() > 14 && daysSinceBirth() <= 21 && (
              <>
                <li>• Eyes and ears opening</li>
                <li>• First teeth appearing</li>
                <li>• Starting to walk</li>
              </>
            )}
            {daysSinceBirth() > 21 && daysSinceBirth() <= 49 && (
              <>
                <li>• Curiosity increasing</li>
                <li>• Learning to play</li>
                <li>• Weaning begins</li>
              </>
            )}
            {daysSinceBirth() > 49 && (
              <>
                <li>• Fully weaned</li>
                <li>• Ready for socialization</li>
                <li>• Developing independence</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelpingProgressCard;
