
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

interface WeightRecordsTableProps {
  weightRecords: WeightRecord[];
}

const WeightRecordsTable: React.FC<WeightRecordsTableProps> = ({ weightRecords }) => {
  // Sort records by date (newest first)
  const sortedRecords = [...weightRecords].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                {format(new Date(record.date), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                {record.weight} {record.unit || record.weight_unit || 'lbs'}
              </TableCell>
              <TableCell>{record.notes || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WeightRecordsTable;
