
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Baby, Clock, CalendarCheck } from 'lucide-react';
import { format } from 'date-fns';
import { Litter } from '@/types/litter';

interface WelpingSummaryCardProps {
  litter: Litter;
  startTime?: string;
  endTime?: string;
  totalDuration?: number;
}

const WelpingSummaryCard: React.FC<WelpingSummaryCardProps> = ({ 
  litter, 
  startTime, 
  endTime, 
  totalDuration 
}) => {
  // Helper function to format duration
  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'Unknown';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    
    return `${mins} minutes`;
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Whelping Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarCheck className="h-4 w-4" />
              <span>Birth Date:</span>
            </div>
            <p className="font-medium">
              {litter.birth_date ? format(new Date(litter.birth_date), 'MMM d, yyyy') : 'Not recorded'}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Baby className="h-4 w-4" />
              <span>Puppies:</span>
            </div>
            <p className="font-medium">
              {(litter.puppies?.length || 0)} born
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Whelping Duration:</span>
          </div>
          <p className="font-medium">
            {formatDuration(totalDuration)}
          </p>
        </div>
        
        {startTime && (
          <div className="pt-2 border-t">
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Start Time:</p>
                <p className="font-medium">{startTime ? format(new Date(startTime), 'h:mm a') : '-'}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">End Time:</p>
                <p className="font-medium">{endTime ? format(new Date(endTime), 'h:mm a') : '-'}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WelpingSummaryCard;
