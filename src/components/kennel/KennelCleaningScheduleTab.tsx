
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KennelCleaningSchedule, KennelUnit } from '@/types/kennel';
import { Skeleton } from '@/components/ui/skeleton';
import CleaningScheduleTable from './components/CleaningScheduleTable';
import CleaningScheduleEmptyState from './components/CleaningScheduleEmptyState';
import CleaningScheduleAddDialog from './components/CleaningScheduleAddDialog';
import CleaningScheduleEditDialog from './components/CleaningScheduleEditDialog';
import { formatDaysOfWeek, formatTime } from './utils/scheduleFormatUtils';

interface KennelCleaningScheduleTabProps {
  cleaningSchedules: KennelCleaningSchedule[];
  kennelUnits: KennelUnit[];
  loading: boolean;
  addCleaningSchedule: (schedule: Omit<KennelCleaningSchedule, 'id' | 'created_at'>) => Promise<KennelCleaningSchedule>;
  updateCleaningSchedule: (id: string, updates: Partial<KennelCleaningSchedule>) => Promise<KennelCleaningSchedule>;
  deleteCleaningSchedule: (id: string) => Promise<void>;
}

const KennelCleaningScheduleTab: React.FC<KennelCleaningScheduleTabProps> = ({ 
  cleaningSchedules, 
  kennelUnits,
  loading,
  addCleaningSchedule,
  updateCleaningSchedule,
  deleteCleaningSchedule
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<KennelCleaningSchedule | null>(null);

  const handleAddCleaningSchedule = async (data: Omit<KennelCleaningSchedule, 'id' | 'created_at'>) => {
    await addCleaningSchedule(data);
    setIsAddDialogOpen(false);
  };

  const handleUpdateCleaningSchedule = async (data: Partial<KennelCleaningSchedule>) => {
    if (!editingSchedule) return;
    await updateCleaningSchedule(editingSchedule.id, data);
    setEditingSchedule(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cleaning Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cleaning Schedules</CardTitle>
        <CleaningScheduleAddDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          kennelUnits={kennelUnits}
          onSubmit={handleAddCleaningSchedule}
        />
      </CardHeader>
      <CardContent>
        {cleaningSchedules.length === 0 ? (
          <CleaningScheduleEmptyState 
            onAddClick={() => setIsAddDialogOpen(true)}
            disabled={kennelUnits.length === 0}
          />
        ) : (
          <CleaningScheduleTable
            cleaningSchedules={cleaningSchedules}
            onEdit={setEditingSchedule}
            onDelete={deleteCleaningSchedule}
            formatDaysOfWeek={formatDaysOfWeek}
            formatTime={formatTime}
          />
        )}
      </CardContent>

      <CleaningScheduleEditDialog
        open={!!editingSchedule}
        onOpenChange={(open) => !open && setEditingSchedule(null)}
        editingSchedule={editingSchedule}
        kennelUnits={kennelUnits}
        onSubmit={handleUpdateCleaningSchedule}
      />
    </Card>
  );
};

export default KennelCleaningScheduleTab;
