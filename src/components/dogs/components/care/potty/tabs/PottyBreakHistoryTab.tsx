
import React from 'react';
import { Card, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, FileText } from 'lucide-react';
import { PottyBreakSession } from '@/services/dailyCare/pottyBreak';
import { format, parseISO } from 'date-fns';

interface PottyBreakHistoryTabProps {
  sessions: PottyBreakSession[];
  isLoading: boolean;
  onRefresh: () => void;
}

const PottyBreakHistoryTab: React.FC<PottyBreakHistoryTabProps> = ({
  sessions,
  isLoading,
  onRefresh
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Recent Potty Breaks</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh} 
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card className="p-4 text-center text-muted-foreground">
          No recent potty breaks recorded.
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => (
            <Card key={session.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {format(parseISO(session.session_time), 'MMM d, h:mm a')}
                  </span>
                </div>
              </div>
              
              {/* Dogs in this session */}
              <div className="mt-2">
                <span className="text-sm text-muted-foreground">Dogs:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {session.dogs?.map(dogEntry => (
                    <span 
                      key={dogEntry.id} 
                      className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5"
                    >
                      {dogEntry.dog?.name || 'Unknown dog'}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Notes section */}
              {session.notes && (
                <div className="mt-3 border-t pt-2">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>Notes:</span>
                  </div>
                  <CardDescription className="whitespace-pre-wrap text-sm">
                    {session.notes}
                  </CardDescription>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PottyBreakHistoryTab;
