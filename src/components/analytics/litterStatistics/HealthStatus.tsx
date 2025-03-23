
import React from 'react';
import { Check, AlertTriangle, Info } from 'lucide-react';
import { PuppyStatistics } from './types';

interface HealthStatusProps {
  stats: PuppyStatistics;
}

const HealthStatus: React.FC<HealthStatusProps> = ({ stats }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Health Status</h3>
      <div className="space-y-2">
        <HealthStatusRow 
          label="Vaccinations" 
          count={stats.puppiesWithVaccinations} 
          total={stats.totalPuppies} 
          percentage={stats.vaccinationPercentage}
        />
        
        <HealthStatusRow 
          label="Deworming" 
          count={stats.puppiesWithDeworming} 
          total={stats.totalPuppies} 
          percentage={stats.dewormingPercentage}
        />
        
        <HealthStatusRow 
          label="Vet Checks" 
          count={stats.puppiesWithVetChecks} 
          total={stats.totalPuppies} 
          percentage={stats.vetChecksPercentage}
        />
      </div>
    </div>
  );
};

interface HealthStatusRowProps {
  label: string;
  count: number;
  total: number;
  percentage: number;
}

const HealthStatusRow: React.FC<HealthStatusRowProps> = ({ 
  label, 
  count, 
  total, 
  percentage 
}) => {
  const StatusIcon = () => {
    if (percentage === 100) {
      return <Check className="h-4 w-4 text-green-500" />;
    } else if (percentage > 0) {
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    } else {
      return <Info className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex justify-between items-center p-2 border rounded-md">
      <div className="flex items-center gap-2">
        <StatusIcon />
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-sm font-medium">
        {count} of {total} ({Math.round(percentage)}%)
      </div>
    </div>
  );
};

export default HealthStatus;
