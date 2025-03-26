
import React from 'react';
import { Pill, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface LastMedicationInfoProps {
  name: string;
  lastAdministered: string | null;
  frequency: string;
}

const LastMedicationInfo: React.FC<LastMedicationInfoProps> = ({
  name,
  lastAdministered,
  frequency
}) => {
  if (!name) return null;
  
  return (
    <div className="mt-3 pt-2 border-t text-xs text-muted-foreground">
      <div className="flex items-center">
        <Pill className="h-3 w-3 mr-1 text-purple-500" />
        <span className="font-medium text-purple-600">
          Last: {name}
        </span>
      </div>
      <div className="flex items-center mt-1">
        <Clock className="h-3 w-3 mr-1" />
        <span>
          {lastAdministered ? 
            format(new Date(lastAdministered), 'MMM d, h:mm a') : 
            'No date recorded'}
        </span>
      </div>
      {frequency && (
        <div className="flex items-center mt-1">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            {frequency.charAt(0).toUpperCase() + 
             frequency.slice(1)}
          </span>
        </div>
      )}
    </div>
  );
};

export default LastMedicationInfo;
