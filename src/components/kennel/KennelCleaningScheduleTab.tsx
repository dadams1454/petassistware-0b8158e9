
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Trash, Edit, Clock } from 'lucide-react';
import { KennelCleaningSchedule, KennelUnit } from '@/types/kennel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import KennelCleaningScheduleForm from './forms/KennelCleaningScheduleForm';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/standardized';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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

  const formatDaysOfWeek = (days: number[] | null) => {
    if (!days || days.length === 0) return '-';
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.map(day => dayNames[day]).join(', ');
  };

  const formatTime = (time: string | null) => {
    if (!time) return '-';
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={kennelUnits.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Add Cleaning Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Cleaning Schedule</DialogTitle>
            </DialogHeader>
            <KennelCleaningScheduleForm 
              onSubmit={handleAddCleaningSchedule} 
              kennelUnits={kennelUnits}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {cleaningSchedules.length === 0 ? (
          <EmptyState 
            title="No Cleaning Schedules" 
            description="Set up cleaning schedules to maintain sanitation."
            icon={<Clock className="h-12 w-12 text-muted-foreground" />}
            action={
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                disabled={kennelUnits.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Cleaning Schedule
              </Button>
            }
          />
        ) : (
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
                        <Dialog 
                          open={editingSchedule?.id === schedule.id} 
                          onOpenChange={(open) => !open && setEditingSchedule(null)}
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setEditingSchedule(schedule)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Cleaning Schedule</DialogTitle>
                            </DialogHeader>
                            {editingSchedule && (
                              <KennelCleaningScheduleForm 
                                onSubmit={handleUpdateCleaningSchedule} 
                                defaultValues={editingSchedule}
                                kennelUnits={kennelUnits}
                                isEditing
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        
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
                              <AlertDialogAction onClick={() => deleteCleaningSchedule(schedule.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KennelCleaningScheduleTab;
