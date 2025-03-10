
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LitterTimelineProps {
  litterId: string;
}

const LitterTimeline: React.FC<LitterTimelineProps> = ({ litterId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Litter Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          Timeline feature coming soon
        </div>
      </CardContent>
    </Card>
  );
};

export default LitterTimeline;
