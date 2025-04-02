
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dog, BarChart, Paw } from 'lucide-react';

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
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BarChart className="h-5 w-5 mr-2 text-muted-foreground" />
          Reproductive Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center">
              <Dog className="h-5 w-5 mr-2 text-amber-500" />
              <span className="text-sm">Pregnant Dogs</span>
            </div>
            <span className="font-medium">{pregnantCount}</span>
          </div>
          
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center">
              <Paw className="h-5 w-5 mr-2 text-blue-500" />
              <span className="text-sm">Active Whelpings</span>
            </div>
            <span className="font-medium">{activeWelpingsCount}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Dog className="h-5 w-5 mr-2 text-green-500" />
              <span className="text-sm">Total Puppies</span>
            </div>
            <span className="font-medium">{totalPuppiesCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelpingStatsCard;
