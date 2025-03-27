
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, History } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { FeedingSchedule } from '@/types/feeding';
import { useFeeding } from '@/contexts/FeedingContext';
import FeedingScheduleForm from './FeedingScheduleForm';
import FeedingSchedulesList from './FeedingSchedulesList';
import FeedingHistory from './FeedingHistory';

interface FeedingManagementTabProps {
  dogId: string;
  dogName: string;
}

const FeedingManagementTab: React.FC<FeedingManagementTabProps> = ({ dogId, dogName }) => {
  const { toast } = useToast();
  const { 
    loading, 
    feedingSchedules, 
    feedingRecords,
    fetchFeedingSchedules, 
    fetchFeedingHistory,
    deleteSchedule
  } = useFeeding();
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<FeedingSchedule | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  useEffect(() => {
    loadData();
  }, [dogId, refreshTrigger]);
  
  const loadData = async () => {
    try {
      await fetchFeedingSchedules(dogId);
      await fetchFeedingHistory(dogId);
    } catch (error) {
      console.error('Error loading feeding data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load feeding data',
        variant: 'destructive'
      });
    }
  };
  
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  const handleAddSuccess = () => {
    setAddDialogOpen(false);
    handleRefresh();
    toast({
      title: 'Schedule Created',
      description: 'Feeding schedule has been created successfully.',
    });
  };
  
  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setSelectedSchedule(null);
    handleRefresh();
    toast({
      title: 'Schedule Updated',
      description: 'Feeding schedule has been updated successfully.',
    });
  };
  
  const handleEditClick = (schedule: FeedingSchedule) => {
    setSelectedSchedule(schedule);
    setEditDialogOpen(true);
  };
  
  const handleDeleteClick = async (scheduleId: string) => {
    try {
      await deleteSchedule(scheduleId);
      handleRefresh();
      toast({
        title: 'Schedule Deleted',
        description: 'Feeding schedule has been deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete feeding schedule',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Feeding Management</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="schedules">
        <TabsList>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            Feeding History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedules" className="pt-4">
          <FeedingSchedulesList 
            dogId={dogId}
            schedules={feedingSchedules || []}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onRefresh={handleRefresh}
          />
        </TabsContent>
        
        <TabsContent value="history" className="pt-4">
          <FeedingHistory 
            dogId={dogId}
            records={feedingRecords || []}
            schedules={feedingSchedules || []}
            onRefresh={handleRefresh}
          />
        </TabsContent>
      </Tabs>
      
      {/* Add Feeding Schedule Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <FeedingScheduleForm 
            dogId={dogId}
            onSuccess={handleAddSuccess}
            onCancel={() => setAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Feeding Schedule Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedSchedule && (
            <FeedingScheduleForm 
              dogId={dogId}
              scheduleId={selectedSchedule.id}
              initialValues={{
                food_type: selectedSchedule.food_type,
                amount: selectedSchedule.amount,
                unit: selectedSchedule.unit,
                schedule_time: selectedSchedule.schedule_time,
                special_instructions: selectedSchedule.special_instructions,
                active: selectedSchedule.active
              }}
              onSuccess={handleEditSuccess}
              onCancel={() => {
                setEditDialogOpen(false);
                setSelectedSchedule(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedingManagementTab;
