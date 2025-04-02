
import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { WeightRecord } from '@/types/health';

interface WeightTableProps {
  weightRecords: WeightRecord[];
}

const WeightTable: React.FC<WeightTableProps> = ({ weightRecords }) => {
  // Sort records by date (newest first)
  const sortedRecords = [...weightRecords].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Age (days)</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRecords.map((record, index) => {
            // Calculate percent change from previous
            const prevRecord = index < sortedRecords.length - 1 ? sortedRecords[index + 1] : null;
            const percentChange = prevRecord ? 
              ((record.weight - prevRecord.weight) / prevRecord.weight) * 100 : 
              null;
            
            return (
              <TableRow key={record.id}>
                <TableCell>
                  {format(new Date(record.date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {record.age_days || '-'}
                </TableCell>
                <TableCell>
                  {record.weight} {record.unit || record.weight_unit || 'lbs'}
                </TableCell>
                <TableCell>
                  {percentChange !== null ? (
                    <span className={percentChange > 0 ? 'text-green-600' : percentChange < 0 ? 'text-red-600' : ''}>
                      {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%
                    </span>
                  ) : (
                    '-'
                  )}
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
