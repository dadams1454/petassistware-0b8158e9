
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDateForDisplay } from '@/utils/dateUtils';
import { AlertCircle } from 'lucide-react';

interface HealthRecordTableProps {
  records: any[];
  title?: string;
}

const HealthRecordTable: React.FC<HealthRecordTableProps> = ({ records, title = "Recent Health Records" }) => {
  if (!records || records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <AlertCircle className="mb-2 h-8 w-8" />
            <p>No health records available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Summary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{formatDateForDisplay(record.visit_date || record.date)}</TableCell>
                <TableCell>{record.record_type}</TableCell>
                <TableCell>{record.title || record.description || "No details available"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HealthRecordTable;
