
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { HeatCycle } from '@/types/heat-cycles';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface HeatCycleHistoryTableProps {
  cycles: HeatCycle[];
  onSelectCycle?: (cycleId: string) => void;
}

const HeatCycleHistoryTable: React.FC<HeatCycleHistoryTableProps> = ({
  cycles,
  onSelectCycle
}) => {
  if (!cycles || cycles.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No heat cycle history available
      </div>
    );
  }

  // Sort cycles by start date, most recent first
  const sortedCycles = [...cycles].sort(
    (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  const getIntensityBadge = (intensity: string | undefined) => {
    if (!intensity) return null;
    
    const variant = intensity.toLowerCase() === 'high' 
      ? 'destructive' 
      : intensity.toLowerCase() === 'medium' 
        ? 'secondary' 
        : 'outline';
    
    return <Badge variant={variant}>{intensity}</Badge>;
  };

  const formatDateString = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM d, yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  const calculateDuration = (startDate: string, endDate?: string) => {
    if (!endDate) return 'Ongoing';
    
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    } catch (e) {
      return 'Unknown';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cycle</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Intensity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCycles.map((cycle) => (
            <TableRow 
              key={cycle.id}
              className={onSelectCycle ? "cursor-pointer hover:bg-secondary/20" : ""}
              onClick={() => onSelectCycle && onSelectCycle(cycle.id)}
            >
              <TableCell>{cycle.cycle_number || '-'}</TableCell>
              <TableCell>{formatDateString(cycle.start_date)}</TableCell>
              <TableCell>{cycle.end_date ? formatDateString(cycle.end_date) : 'Ongoing'}</TableCell>
              <TableCell>{calculateDuration(cycle.start_date, cycle.end_date)}</TableCell>
              <TableCell>{getIntensityBadge(cycle.intensity)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HeatCycleHistoryTable;
