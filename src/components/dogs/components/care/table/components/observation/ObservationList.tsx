
import React from 'react';
import { AlertTriangle, Heart, Activity, MessageCircle } from 'lucide-react';

type ObservationType = 'accident' | 'heat' | 'behavior' | 'other';

interface ObservationListProps {
  existingObservations: Array<{
    observation: string;
    observation_type: ObservationType;
    created_at: string;
  }>;
}

const ObservationList: React.FC<ObservationListProps> = ({ existingObservations }) => {
  // Get the icon based on observation type
  const getObservationTypeIcon = (type: ObservationType) => {
    switch (type) {
      case 'accident':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'heat':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'behavior':
        return <Activity className="h-4 w-4 text-blue-500" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Current Observations (Last 24 hours)</h3>
      <div className="max-h-40 overflow-y-auto space-y-2">
        {existingObservations.map((obs, index) => (
          <div 
            key={index} 
            className="p-2 bg-muted rounded-md text-sm"
          >
            <div className="flex items-center gap-1 mb-1">
              {getObservationTypeIcon(obs.observation_type)}
              <span className="font-medium capitalize">
                {obs.observation_type}
              </span>
            </div>
            <p className="mt-1">{obs.observation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObservationList;
