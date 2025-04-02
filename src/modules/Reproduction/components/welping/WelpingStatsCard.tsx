
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Baby, Cat, Dribbble } from 'lucide-react';

interface WelpingStatsCardProps {
  pregnantCount: number;
  activeWelpingsCount: number;
  totalPuppiesCount: number;
}

const WelpingStatsCard: React.FC<WelpingStatsCardProps> = ({
  pregnantCount,
  activeWelpingsCount,
  totalPuppiesCount,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <Cat className="h-8 w-8 text-primary mb-2" />
            <div className="text-2xl font-bold">{pregnantCount}</div>
            <div className="text-sm text-muted-foreground text-center">Pregnant Dogs</div>
          </div>
          
          <div className="flex flex-col items-center">
            <Baby className="h-8 w-8 text-primary mb-2" />
            <div className="text-2xl font-bold">{activeWelpingsCount}</div>
            <div className="text-sm text-muted-foreground text-center">Active Whelping</div>
          </div>
          
          <div className="flex flex-col items-center">
            <Dribbble className="h-8 w-8 text-primary mb-2" />
            <div className="text-2xl font-bold">{totalPuppiesCount}</div>
            <div className="text-sm text-muted-foreground text-center">Total Puppies</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelpingStatsCard;
