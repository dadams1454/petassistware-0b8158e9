import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Edit, Trash2, Utensils, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

import { useFeeding } from '@/contexts/feeding';
import FeedingForm from './FeedingForm';
import FeedingScheduleForm from './FeedingScheduleForm';
import FeedingSchedulesList from './FeedingSchedulesList';
import { FeedingSchedule } from '@/types/feeding';

interface FeedingManagementTabProps {
  dogId: string;
  dogName: string;
}

const FeedingManagementTab: React.FC<FeedingManagementTabProps> = ({ dogId, dogName }) => {
  const { 
    fetchSchedules, 
    deleteSchedule,
    schedules,
    loading 
  } = useFeeding();
  
  const [addFeedingDialog, setAddFeedingDialog] = useState(false);
  const [addScheduleDialog, setAddScheduleDialog] = useState(false);
  const [editScheduleDialog, setEditScheduleDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<FeedingSchedule | null>(null);
  const { toast } = useToast();

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, [dogId]);

  const refreshData = async () => {
    await fetchSchedules(dogId);
  };

  const handleEditSchedule = (schedule: FeedingSchedule) => {
    setSelectedSchedule(schedule);
    setEditScheduleDialog(true);
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      await deleteSchedule(scheduleId);
      toast({
        title: "Feeding schedule deleted",
        description: "The feeding schedule has been removed successfully",
      });
      refreshData();
    } catch (error) {
      toast({
        title: "Error deleting schedule",
        description: "Failed to delete the feeding schedule. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setAddFeedingDialog(true)}
        >
          <Utensils className="h-4 w-4 mr-1" />
          Log Feeding
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setAddScheduleDialog(true)}
        >
          <Clock className="h-4 w-4 mr-1" />
          Create Schedule
        </Button>
      </div>
      
      {/* Dialogs */}
      <Dialog open={addFeedingDialog} onOpenChange={setAddFeedingDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Log Feeding</DialogTitle>
            <DialogDescription>
              Record a feeding instance for this dog.
            </DialogDescription>
          </DialogHeader>
          <FeedingForm 
            dogId={dogId} 
            onSuccess={() => {
              refreshData();
              setAddFeedingDialog(false);
            }} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={addScheduleDialog} onOpenChange={setAddScheduleDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Feeding Schedule</DialogTitle>
            <DialogDescription>
              Set a regular feeding schedule for this dog.
            </DialogDescription>
          </DialogHeader>
          <FeedingScheduleForm 
            dogId={dogId} 
            onSuccess={() => {
              refreshData();
              setAddScheduleDialog(false);
            }} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editScheduleDialog} onOpenChange={setEditScheduleDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Feeding Schedule</DialogTitle>
            <DialogDescription>
              Update the feeding schedule for this dog.
            </DialogDescription>
          </DialogHeader>
          <FeedingScheduleForm 
            dogId={dogId}
            schedule={selectedSchedule}
            onSuccess={() => {
              refreshData();
              setEditScheduleDialog(false);
              setSelectedSchedule(null);
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Feeding Schedules List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Feeding Schedules</h3>
        {loading ? (
          <div>Loading schedules...</div>
        ) : (
              <FeedingSchedulesList 
                dogId={dogId}
                schedules={schedules as FeedingSchedule[]}
                onEdit={handleEditSchedule}
                onDelete={handleDeleteSchedule}
              />
        )}
      </div>
    </div>
  );
};

export default FeedingManagementTab;
