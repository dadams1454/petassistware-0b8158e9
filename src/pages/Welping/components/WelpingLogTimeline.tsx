
import React from 'react';
import { format } from 'date-fns';
import { Puppy } from '@/types/litter';
import { Activity, Calendar, Clock, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { WelpingLogEntry } from '../hooks/useWelping';

interface WelpingLogTimelineProps {
  logs: WelpingLogEntry[];
  puppies: Puppy[];
}

const WelpingLogTimeline: React.FC<WelpingLogTimelineProps> = ({ logs, puppies }) => {
  // Sort logs by timestamp
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // Function to get puppy details
  const getPuppyDetails = (puppyId?: string) => {
    if (!puppyId) return null;
    return puppies.find(puppy => puppy.id === puppyId);
  };
  
  // Get icon for event type
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'start':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'contraction':
        return <Activity className="h-5 w-5 text-yellow-500" />;
      case 'puppy_born':
        return <Activity className="h-5 w-5 text-green-500" />;
      case 'end':
        return <Clock className="h-5 w-5 text-purple-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get event label
  const getEventLabel = (log: WelpingLogEntry) => {
    switch (log.event_type) {
      case 'start':
        return 'Whelping Started';
      case 'contraction':
        return 'Contraction';
      case 'puppy_born': {
        const puppy = getPuppyDetails(log.puppy_id);
        return puppy 
          ? `Puppy Born: ${puppy.name || `#${puppy.birth_order || ''}`}` 
          : 'Puppy Born';
      }
      case 'end':
        return 'Whelping Completed';
      default:
        return 'Note';
    }
  };
  
  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No whelping events have been recorded yet.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {sortedLogs.map(log => (
        <div key={log.id} className="flex gap-4">
          <div className="mt-1">{getEventIcon(log.event_type)}</div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between">
              <h4 className="font-medium">{getEventLabel(log)}</h4>
              <time className="text-sm text-muted-foreground">
                {format(new Date(log.timestamp), 'h:mm a')}
              </time>
            </div>
            {log.notes && <p className="text-sm text-muted-foreground">{log.notes}</p>}
            {log.event_type === 'puppy_born' && log.puppy_details && (
              <div className="text-sm mt-1">
                <span className="text-muted-foreground">
                  {[
                    log.puppy_details.gender,
                    log.puppy_details.color,
                    log.puppy_details.weight ? `${log.puppy_details.weight} oz` : null
                  ].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WelpingLogTimeline;
