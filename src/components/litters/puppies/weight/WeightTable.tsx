
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { WeightRecord } from './types';
import { convertWeight } from './weightUnits';

interface WeightTableProps {
  weightRecords: WeightRecord[];
  onDelete: (id: string) => void;
  displayUnit: 'oz' | 'g' | 'lbs' | 'kg';
}

const WeightTable: React.FC<WeightTableProps> = ({ 
  weightRecords, 
  onDelete,
  displayUnit
}) => {
  if (weightRecords.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No weight records available
      </div>
    );
  }

  // Sort by date, most recent first
  const sortedRecords = [...weightRecords].sort((a, b) => {
    const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
    const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="max-h-[400px] overflow-y-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-card">
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Change</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRecords.map((record) => {
            // Convert weight to display unit
            const displayWeight = convertWeight(
              record.weight, 
              record.weight_unit, 
              displayUnit
            );
            
            return (
              <TableRow key={record.id}>
                <TableCell>
                  {typeof record.date === 'string' 
                    ? format(parseISO(record.date), 'MMM d, yyyy')
                    : format(record.date, 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{displayWeight} {displayUnit}</TableCell>
                <TableCell>
                  {record.percent_change !== null && record.percent_change !== undefined ? (
                    <span 
                      className={record.percent_change >= 0 ? 'text-green-600' : 'text-red-600'}
                    >
                      {record.percent_change > 0 && '+'}
                      {record.percent_change}%
                    </span>
                  ) : '—'}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{record.notes || '—'}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDelete(record.id)}
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100/50"
                  >
                    <Trash2 className="h-4 w-4" />
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

export default WeightTable;
