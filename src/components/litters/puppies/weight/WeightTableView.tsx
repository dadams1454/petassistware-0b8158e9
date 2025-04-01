
import React from 'react';
import { format } from 'date-fns';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { WeightRecord } from '@/types/puppyTracking';
import { convertWeight, formatWeightWithUnit } from './weightUnits';

interface WeightTableViewProps {
  weightRecords: WeightRecord[];
  onDelete: (id: string) => void;
  displayUnit: 'oz' | 'g' | 'lbs' | 'kg';
}

const WeightTableView: React.FC<WeightTableViewProps> = ({ 
  weightRecords, 
  onDelete, 
  displayUnit 
}) => {
  if (!weightRecords || weightRecords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <p>No weight records available to display.</p>
      </div>
    );
  }

  // Sort records by date (newest to oldest)
  const sortedRecords = [...weightRecords].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Change</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRecords.map((record) => {
            // Convert weight to display unit
            const convertedWeight = convertWeight(
              record.weight,
              record.weight_unit as any,
              displayUnit as any
            );
            
            return (
              <TableRow key={record.id}>
                <TableCell>
                  {format(new Date(record.date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {convertedWeight.toFixed(2)} {displayUnit}
                </TableCell>
                <TableCell>
                  {record.percent_change !== null && record.percent_change !== undefined ? (
                    <span 
                      className={
                        record.percent_change > 0 
                          ? "text-green-600 font-medium" 
                          : record.percent_change < 0 
                            ? "text-red-600 font-medium" 
                            : ""
                      }
                    >
                      {record.percent_change > 0 ? "+" : ""}
                      {record.percent_change.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {record.notes || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete(record.id)}
                    title="Delete record"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default WeightTableView;
