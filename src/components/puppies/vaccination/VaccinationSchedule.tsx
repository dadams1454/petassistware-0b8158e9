
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VaccinationScheduleItem } from '@/types/puppyTracking';

interface VaccinationScheduleProps {
  vaccinations: VaccinationScheduleItem[];
  onRefresh: () => Promise<void>;
  status: 'upcoming' | 'overdue';
}

const VaccinationSchedule: React.FC<VaccinationScheduleProps> = ({ 
  vaccinations,
  onRefresh,
  status 
}) => {
  if (!vaccinations || vaccinations.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground">
            {status === 'overdue' 
              ? 'No overdue vaccinations' 
              : 'No upcoming vaccinations scheduled'}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const handleMarkComplete = (vaccination: VaccinationScheduleItem) => {
    // Implementation would be added here
    console.log('Mark as complete:', vaccination);
  };
  
  const handleReschedule = (vaccination: VaccinationScheduleItem) => {
    // Implementation would be added here
    console.log('Reschedule:', vaccination);
  };
  
  const getDueStatusClass = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    
    if (status === 'overdue') return 'text-red-600 font-semibold';
    
    // For upcoming vaccs, show warning if due within 7 days
    const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue <= 7) return 'text-amber-600 font-semibold';
    
    return 'text-green-600';
  };
  
  return (
    <Card>
      <CardContent className="py-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vaccination Type</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vaccinations.map(vaccination => (
              <TableRow key={vaccination.id}>
                <TableCell className="font-medium">{vaccination.vaccination_type}</TableCell>
                <TableCell className={getDueStatusClass(vaccination.due_date)}>
                  {format(new Date(vaccination.due_date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{vaccination.notes || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleMarkComplete(vaccination)}
                    >
                      Mark Complete
                    </Button>
                    {status === 'overdue' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReschedule(vaccination)}
                      >
                        Reschedule
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default VaccinationSchedule;
