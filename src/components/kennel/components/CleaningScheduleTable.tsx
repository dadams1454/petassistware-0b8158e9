
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KennelCleaningSchedule } from '@/types/kennel';
import CleaningScheduleRow from './CleaningScheduleRow';

interface CleaningScheduleTableProps {
  cleaningSchedules: KennelCleaningSchedule[];
  onEdit: (schedule: KennelCleaningSchedule) => void;
  onDelete: (id: string) => Promise<void>;
  formatDaysOfWeek: (days: number[] | null) => string;
  formatTime: (time: string | null) => string;
}

const CleaningScheduleTable: React.FC<CleaningScheduleTableProps> = ({
  cleaningSchedules,
  onEdit,
  onDelete,
  formatDaysOfWeek,
  formatTime
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kennel Unit</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Days</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cleaningSchedules.map((schedule) => (
            <CleaningScheduleRow
              key={schedule.id}
              schedule={schedule}
              onEdit={onEdit}
              onDelete={onDelete}
              formatDaysOfWeek={formatDaysOfWeek}
              formatTime={formatTime}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CleaningScheduleTable;
