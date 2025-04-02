
import React from 'react';
import { format } from 'date-fns';
import { Baby, AlertCircle, Eye, Thermometer, Pill, Clock, Activity } from 'lucide-react';
import { WelpingObservation, Puppy } from '../types';

interface WelpingLogTimelineProps {
  logs: WelpingObservation[];
  puppies: Puppy[];
}

const WelpingLogTimeline: React.FC<WelpingLogTimelineProps> = ({ logs, puppies }) => {
  const sortedLogs = [...logs].sort((a, b) => {
    const dateA = new Date(`2000-01-01T${a.observation_time}`);
    const dateB = new Date(`2000-01-01T${b.observation_time}`);
    return dateB.getTime() - dateA.getTime();
  });
  
  const getIconForLogType = (type: string) => {
    switch (type) {
      case 'birth':
        return <Baby className="h-5 w-5 text-green-500" />;
      case 'complication':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'observation':
        return <Eye className="h-5 w-5 text-blue-500" />;
      case 'temperature':
        return <Thermometer className="h-5 w-5 text-amber-500" />;
      case 'medication':
        return <Pill className="h-5 w-5 text-purple-500" />;
      case 'contraction':
        return <Activity className="h-5 w-5 text-indigo-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getPuppyName = (puppyId: string | undefined) => {
    if (!puppyId) return 'Unknown puppy';
    const puppy = puppies.find(p => p.id === puppyId);
    return puppy ? puppy.name : 'Unknown puppy';
  };
  
  const getLogTypeLabel = (type: string) => {
    switch (type) {
      case 'birth':
        return 'Puppy Birth';
      case 'complication':
        return 'Complication';
      case 'observation':
        return 'Observation';
      case 'temperature':
        return 'Temperature Reading';
      case 'medication':
        return 'Medication';
      case 'contraction':
        return 'Contraction';
      case 'intervention':
        return 'Medical Intervention';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  if (sortedLogs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-medium mb-2">No Logs Yet</h3>
        <p>
          Add log entries to track the whelping process.<br />
          Record contractions, births, and other observations.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-5 w-0.5 bg-gray-200" />
      
      <div className="space-y-6">
        {sortedLogs.map((log) => (
          <div key={log.id} className="relative pl-10">
            <div className="absolute left-0 top-1 flex items-center justify-center h-10 w-10 rounded-full bg-white border border-gray-200">
              {getIconForLogType(log.observation_type || 'observation')}
            </div>
            
            <div className="bg-white p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="font-medium mr-2">
                    {getLogTypeLabel(log.observation_type || 'observation')}
                  </span>
                  {log.puppy_id && (
                    <span className="text-sm px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      {getPuppyName(log.puppy_id)}
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {log.observation_time}
                </span>
              </div>
              
              <p className="text-sm mb-2">
                {log.description}
              </p>
              
              {log.action_taken && (
                <div className="mt-2 text-sm">
                  <p className="font-medium text-sm">Action taken:</p>
                  <p className="text-muted-foreground">{log.action_taken}</p>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground mt-2">
                {format(new Date(log.created_at), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelpingLogTimeline;
