import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Dialog, 
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit, Trash, AlarmClock } from 'lucide-react';

import { FeedingSchedule } from '@/types/feeding';
import { useFeeding } from '@/contexts/feeding';
import FeedingScheduleForm from './FeedingScheduleForm';

interface FeedingSchedulesListProps {
  dogId: string;
  schedules: FeedingSchedule[];
  onRefresh: () => void;
  height?: string;
  onEdit?: (schedule: FeedingSchedule) => void;
  onDelete?: (scheduleId: string) => Promise<void>;
}

const FeedingSchedulesList: React.FC<FeedingSchedulesListProps> = ({
  dogId,
  schedules,
  onRefresh,
  height = 'h-[300px]',
  onEdit,
  onDelete
}) => {
  const { deleteSchedule } = useFeeding();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<FeedingSchedule | null>(null);

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleEditClick = (schedule: FeedingSchedule) => {
    if (onEdit) {
      onEdit(schedule);
      return;
    }
    
    setSelectedSchedule(schedule);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (schedule: FeedingSchedule) => {
    setSelectedSchedule(schedule);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedSchedule) {
      if (onDelete) {
        await onDelete(selectedSchedule.id);
      } else {
        await deleteSchedule(selectedSchedule.id);
      }
      setDeleteDialogOpen(false);
      setSelectedSchedule(null);
      onRefresh();
    }
  };

  const formatScheduleTimes = (times: string[]) => {
    return times.map(time => {
      const [hours, minutes] = time.split(':');
      return format(new Date().setHours(Number(hours), Number(minutes)), 'h:mm a');
    }).join(', ');
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Feeding Schedules</CardTitle>
            <CardDescription>
              {schedules.length} schedule{schedules.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-1" />
            Add Schedule
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className={height}>
          <div className="space-y-4">
            {schedules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No feeding schedules found
              </div>
            ) : (
              schedules.map(schedule => (
                <div 
                  key={schedule.id}
                  className={`border rounded-lg p-4 ${!schedule.active ? 'bg-muted' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{schedule.food_type}</h3>
                      <p className="text-sm text-muted-foreground">
                        {schedule.amount} {schedule.unit} {schedule.schedule_time.length > 1 ? 'per meal' : ''}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      {!schedule.active && (
                        <Badge variant="outline" className="ml-2">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center text-sm">
                    <AlarmClock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {formatScheduleTimes(schedule.schedule_time)}
                    </span>
                  </div>
                  
                  {schedule.special_instructions && (
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Instructions:</span> {schedule.special_instructions}
                    </p>
                  )}
                  
                  <div className="mt-3 flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(schedule)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick(schedule)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        {/* Add Schedule Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="max-w-md">
            <FeedingScheduleForm 
              dogId={dogId}
              onSuccess={() => {
                setAddDialogOpen(false);
                onRefresh();
              }}
            />
          </DialogContent>
        </Dialog>
        
        {/* Edit Schedule Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md">
            {selectedSchedule && (
              <FeedingScheduleForm 
                dogId={dogId}
                scheduleId={selectedSchedule.id}
                initialValues={{
                  food_type: selectedSchedule.food_type,
                  amount: selectedSchedule.amount,
                  unit: selectedSchedule.unit as 'cups' | 'grams' | 'ounces' | 'tablespoons' | 'teaspoons',
                  schedule_time: selectedSchedule.schedule_time,
                  special_instructions: selectedSchedule.special_instructions || '',
                  active: selectedSchedule.active
                }}
                onSuccess={() => {
                  setEditDialogOpen(false);
                  setSelectedSchedule(null);
                  onRefresh();
                }}
              />
            )}
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Feeding Schedule</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this feeding schedule? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedSchedule(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default FeedingSchedulesList;
