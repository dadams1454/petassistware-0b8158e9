
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, parseISO } from 'date-fns';
import { AlertTriangle, Heart, Activity, MessageCircle, UtensilsCrossed, X } from 'lucide-react';
import { ObservationType } from './ObservationDialog';
import { Button } from '@/components/ui/button';

interface ObservationListProps {
  existingObservations: Array<{
    observation: string;
    observation_type: ObservationType;
    created_at: string;
    category?: string;
  }>;
  activeCategory?: string;
}

const ObservationList: React.FC<ObservationListProps> = ({ 
  existingObservations,
  activeCategory = 'pottybreaks'
}) => {
  const [hiddenObservations, setHiddenObservations] = useState<string[]>([]);
  
  if (existingObservations.length === 0) return null;
  
  // Filter out hidden observations
  const visibleObservations = existingObservations.filter(
    (obs, index) => !hiddenObservations.includes(`${obs.observation}-${index}`)
  );
  
  if (visibleObservations.length === 0) return null;
  
  const getObservationIcon = (type: ObservationType) => {
    switch (type) {
      case 'accident':
        return <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />;
      case 'heat':
        return <Heart className="h-4 w-4 text-red-500 flex-shrink-0" />;
      case 'behavior':
        return <Activity className="h-4 w-4 text-blue-500 flex-shrink-0" />;
      case 'feeding':
        return <UtensilsCrossed className="h-4 w-4 text-red-500 flex-shrink-0" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500 flex-shrink-0" />;
    }
  };
  
  const getTimeAgo = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;
      
      return format(date, 'MMM d, h:mm a');
    } catch (e) {
      return 'Recently';
    }
  };
  
  const hideObservation = (obs: any, index: number) => {
    setHiddenObservations([...hiddenObservations, `${obs.observation}-${index}`]);
  };
  
  return (
    <div className="mb-4">
      <div className="text-sm font-medium mb-2">
        Recent Observations
      </div>
      <ScrollArea className="max-h-[150px] overflow-auto">
        <div className="space-y-2">
          {visibleObservations.map((obs, index) => (
            <div 
              key={index} 
              className="flex items-start gap-2 p-2 border border-gray-200 dark:border-gray-800 rounded bg-gray-50 dark:bg-gray-900/50 relative group"
            >
              {getObservationIcon(obs.observation_type)}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between">
                  <span className="capitalize truncate">{obs.observation_type}</span>
                  <span className="text-gray-500">{getTimeAgo(obs.created_at)}</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 break-words">
                  {obs.observation}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => hideObservation(obs, index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ObservationList;
