
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, Calendar, Target, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Litter } from '@/types/litter'; // Import Litter from our types file

interface WelpingProgressCardProps {
  litter: Litter;
  puppiesCount: number;
}

const WelpingProgressCard: React.FC<WelpingProgressCardProps> = ({ 
  litter, 
  puppiesCount 
}) => {
  // Calculate expected puppy count based on ultrasound or X-ray data
  // For now, we'll use the puppy_count from the litter if available
  const expectedCount = litter.puppy_count || '?';
  
  // Calculate the start time of welping (for now using current date)
  const startTime = new Date();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Whelping Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>Expected Count:</span>
            </div>
            <span className="font-medium">{expectedCount}</span>
          </div>
          
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Layers className="h-4 w-4" />
              <span>Current Count:</span>
            </div>
            <span className="font-medium">{puppiesCount}</span>
          </div>

          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Birth Date:</span>
            </div>
            <span className="font-medium">
              {litter.birth_date ? format(new Date(litter.birth_date), 'MMM d, yyyy') : 'Today'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Start Time:</span>
            </div>
            <span className="font-medium">{format(startTime, 'h:mm a')}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-2 border-t">
          <div className="mb-2 text-sm text-muted-foreground">Completion:</div>
          <div className="w-full bg-secondary rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ 
                width: `${expectedCount === '?' ? 0 : (puppiesCount / Number(expectedCount)) * 100}%` 
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>{puppiesCount} born</span>
            {expectedCount !== '?' && <span>{expectedCount} expected</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelpingProgressCard;
