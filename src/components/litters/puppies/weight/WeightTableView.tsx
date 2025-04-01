
import React from 'react';
import { format } from 'date-fns';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { WeightRecord } from '@/types/puppyTracking';

interface WeightTableViewProps {
  weightRecords: WeightRecord[];
  onDelete: (id: string) => void;
  displayUnit: 'oz' | 'g' | 'lbs' | 'kg';
}

const convertWeight = (weight: number, fromUnit: string, toUnit: string): number => {
  // Convert to grams first
  let weightInGrams = weight;
  if (fromUnit === 'oz') weightInGrams = weight * 28.35;
  if (fromUnit === 'lbs') weightInGrams = weight * 453.59;
  if (fromUnit === 'kg') weightInGrams = weight * 1000;
  
  // Convert from grams to target unit
  if (toUnit === 'g') return parseFloat(weightInGrams.toFixed(1));
  if (toUnit === 'oz') return parseFloat((weightInGrams / 28.35).toFixed(2));
  if (toUnit === 'lbs') return parseFloat((weightInGrams / 453.59).toFixed(2));
  if (toUnit === 'kg') return parseFloat((weightInGrams / 1000).toFixed(3));
  
  return weight;
};

const WeightTableView: React.FC<WeightTableViewProps> = ({ weightRecords, onDelete, displayUnit }) => {
  // Sort records by date (newest first)
  const sortedRecords = [...weightRecords].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <div className="w-full overflow-auto">
      {sortedRecords.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No weight records available
        </div>
      ) : (
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
            {sortedRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">
                  {format(new Date(record.date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {convertWeight(record.weight, record.weight_unit, displayUnit)} {displayUnit}
                </TableCell>
                <TableCell>
                  {record.percent_change !== null && record.percent_change !== undefined ? (
                    <span className={record.percent_change >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {record.percent_change >= 0 ? '+' : ''}{record.percent_change.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {record.notes || '-'}
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
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default WeightTableView;
