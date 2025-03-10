
import React from 'react';
import { format } from 'date-fns';
import DashboardCard from '@/components/dashboard/DashboardCard';

interface LitterInfoProps {
  litter: Litter;
}

const LitterInfo: React.FC<LitterInfoProps> = ({ litter }) => {
  return (
    <DashboardCard className="lg:col-span-1" title="Litter Information">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Birth Date</p>
            <p>{format(new Date(litter.birth_date), 'MMMM d, yyyy')}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Puppy Count</p>
            <p>{litter.puppy_count || 'Not specified'}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Dam (Mother)</p>
          <p>{litter.dam?.name || 'Unknown'}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Sire (Father)</p>
          <p>{litter.sire?.name || 'Unknown'}</p>
        </div>

        {litter.notes && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Notes</p>
            <p className="whitespace-pre-line">{litter.notes}</p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export default LitterInfo;
