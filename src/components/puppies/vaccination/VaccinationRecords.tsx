
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VaccinationScheduleItem } from '@/types/puppyTracking';

export interface VaccinationRecordsProps {
  vaccinations: VaccinationScheduleItem[];
  onRefresh: () => Promise<void>;
}

const VaccinationRecords: React.FC<VaccinationRecordsProps> = ({ 
  vaccinations,
  onRefresh
}) => {
  if (!vaccinations || vaccinations.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground">No vaccination records found</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="py-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vaccination Type</TableHead>
              <TableHead>Date Administered</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vaccinations.map(vaccination => (
              <TableRow key={vaccination.id}>
                <TableCell className="font-medium">{vaccination.vaccination_type}</TableCell>
                <TableCell>
                  {vaccination.vaccination_date && format(new Date(vaccination.vaccination_date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{vaccination.notes || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default VaccinationRecords;
