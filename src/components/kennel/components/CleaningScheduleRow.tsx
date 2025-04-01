
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { KennelCleaningSchedule } from '@/types/kennel';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface CleaningScheduleRowProps {
  schedule: KennelCleaningSchedule;
  onEdit: (schedule: KennelCleaningSchedule) => void;
  onDelete: (id: string) => Promise<void>;
  formatDaysOfWeek: (days: number[] | null) => string;
  formatTime: (time: string | null) => string;
}

const CleaningScheduleRow: React.FC<CleaningScheduleRowProps> = ({
  schedule,
  onEdit,
  onDelete,
  formatDaysOfWeek,
  formatTime
}) => {
  return (
    <TableRow key={schedule.id}>
      <TableCell className="font-medium">{schedule.kennel_unit?.name || '-'}</TableCell>
      <TableCell>
        {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)}
      </TableCell>
      <TableCell>{formatDaysOfWeek(schedule.day_of_week)}</TableCell>
      <TableCell>{schedule.time_of_day ? formatTime(schedule.time_of_day) : '-'}</TableCell>
      <TableCell>{schedule.assigned_to || '-'}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(schedule)}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive">
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Cleaning Schedule</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this cleaning schedule?
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(schedule.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CleaningScheduleRow;
