
import React from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { WeightTableViewProps } from './types';
import { convertWeight, formatWeightWithUnit } from './weightUnits';

const WeightTableView: React.FC<WeightTableViewProps> = ({ 
  weightRecords, 
  onDelete, 
  displayUnit 
}) => {
  // Get birthdate from first record if available
  const birthDate = weightRecords[0]?.birth_date 
    ? new Date(weightRecords[0].birth_date) 
    : null;

  if (weightRecords.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-muted-foreground">No weight records available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            {birthDate && <TableHead>Age</TableHead>}
            <TableHead>Weight</TableHead>
            <TableHead>Change</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {weightRecords.map((record) => {
            const recordDate = new Date(record.date);
            const ageInDays = birthDate 
              ? differenceInDays(recordDate, birthDate) 
              : null;
              
            // Convert weight to display unit
            const convertedWeight = convertWeight(
              record.weight,
              record.weight_unit,
              displayUnit
            );
            
            // Format percentage change with colors
            const percentChange = record.percent_change;
            const percentChangeClass = 
              percentChange > 0 
                ? 'text-green-600' 
                : percentChange < 0 
                  ? 'text-red-600' 
                  : 'text-gray-500';
            
            return (
              <TableRow key={record.id}>
                <TableCell>{format(recordDate, 'MMM d, yyyy')}</TableCell>
                {birthDate && (
                  <TableCell>
                    {ageInDays !== null ? `${ageInDays} days` : 'Unknown'}
                  </TableCell>
                )}
                <TableCell>
                  {formatWeightWithUnit(convertedWeight, displayUnit)}
                </TableCell>
                <TableCell>
                  {percentChange !== null && percentChange !== undefined ? (
                    <span className={percentChangeClass}>
                      {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {record.notes || '-'}
                </TableCell>
                <TableCell>
                  <Button 
                    onClick={() => onDelete(record.id)} 
                    size="sm" 
                    variant="ghost"
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
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
