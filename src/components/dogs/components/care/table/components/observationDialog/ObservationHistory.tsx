
import React from 'react';
import { AlertTriangle, Heart, Activity, MessageCircle } from 'lucide-react';

interface ObservationHistoryProps {
  observations: Array<{
    observation: string;
    observation_type: 'accident' | 'heat' | 'behavior' | 'other';
    created_at: string;
  }>;
}

const ObservationHistory: React.FC<ObservationHistoryProps> = ({ observations }) => {
  if (observations.length === 0) {
    return null;
  }

  // Get observation type icon
  const getObservationTypeIcon = (type: 'accident' | 'heat' | 'behavior' | 'other') => {
    switch (type) {
      case 'accident':
        return <AlertTriangle className="h-3 w-3 text-amber-500" />;
      case 'heat':
        return <Heart className="h-3 w-3 text-red-500" />;
      case 'behavior':
        return <Activity className="h-3 w-3 text-blue-500" />;
      default:
        return <MessageCircle className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Current Observations (Last 24 hours)</h3>
      <div className="max-h-40 overflow-y-auto space-y-2">
        {observations.map((obs, index) => (
          <div 
            key={index} 
            className="p-2 bg-muted rounded-md text-sm"
          >
            <div className="flex justify-between mb-1">
              <span className="font-medium capitalize flex items-center gap-1">
                {getObservationTypeIcon(obs.observation_type)}
                {obs.observation_type}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(obs.created_at).toLocaleString()}
              </span>
            </div>
            <p>{obs.observation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObservationHistory;
