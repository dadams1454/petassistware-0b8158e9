
import React from 'react';
import { WeightRecord } from '../../types/dog';
import { format, parseISO, isValid } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface WeightRecordsTableProps {
  weightHistory: WeightRecord[];
}

const WeightRecordsTable: React.FC<WeightRecordsTableProps> = ({ weightHistory }) => {
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'MMMM d, yyyy') : 'Invalid date';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight Records</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {weightHistory.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{formatDate(record.date)}</TableCell>
                <TableCell>
                  {record.weight} {record.weight_unit}
                </TableCell>
                <TableCell>{record.notes || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WeightRecordsTable;
