
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

interface LastCareStatusProps {
  lastCare: {
    category: string;
    task_name: string;
    timestamp: string;
  } | null;
}

const LastCareStatus: React.FC<LastCareStatusProps> = ({ lastCare }) => {
  return (
    <>
      {lastCare ? (
        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          {lastCare.category}: {lastCare.task_name}
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
          Needs care
        </Badge>
      )}
    </>
  );
};

export default LastCareStatus;
