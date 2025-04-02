
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Baby, Dog, Cog } from 'lucide-react';

interface WelpingStatsCardProps {
  pregnantCount: number;
  activeWelpingsCount: number;
  totalPuppiesCount: number;
}

const WelpingStatsCard: React.FC<WelpingStatsCardProps> = ({ 
  pregnantCount, 
  activeWelpingsCount, 
  totalPuppiesCount 
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <Dog className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pregnant Dogs</p>
              <h3 className="text-2xl font-bold">{pregnantCount}</h3>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <Cog className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Whelpings</p>
              <h3 className="text-2xl font-bold">{activeWelpingsCount}</h3>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <Baby className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Puppies</p>
              <h3 className="text-2xl font-bold">{totalPuppiesCount}</h3>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelpingStatsCard;
