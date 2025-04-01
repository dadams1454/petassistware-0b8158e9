
import React from 'react';
import { Activity, Baby, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
          <Activity className="h-5 w-5 mr-2 text-muted-foreground" />
          Welping Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <Stethoscope className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-sm">Pregnant Dogs</span>
            </div>
            <span className="font-semibold">{pregnantCount}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-t">
            <div className="flex items-center">
              <Baby className="h-4 w-4 mr-2 text-pink-500" />
              <span className="text-sm">Active Whelping</span>
            </div>
            <span className="font-semibold">{activeWelpingsCount}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-t">
            <div className="flex items-center">
              <Baby className="h-4 w-4 mr-2 text-amber-500" />
              <span className="text-sm">Total Puppies</span>
            </div>
            <span className="font-semibold">{totalPuppiesCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelpingStatsCard;
