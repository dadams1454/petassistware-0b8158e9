
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Plus, RefreshCw } from 'lucide-react';
import FeedingScheduleForm from './FeedingScheduleForm';
import FeedingRecordForm from './FeedingRecordForm';
import FeedingHistoryView from './FeedingHistoryView';
import FeedingSchedulesList from './FeedingSchedulesList';
import { getDogFeedingSchedules } from '@/services/dailyCare/feedingService';
import { FeedingSchedule } from '@/types/feedingSchedule';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/standardized';

interface FeedingManagementTabProps {
  dogId: string;
  dogName: string;
}

const FeedingManagementTab: React.FC<FeedingManagementTabProps> = ({ dogId, dogName }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('schedules');
  const [showNewScheduleForm, setShowNewScheduleForm] = useState(false);
  const [feedingDialogOpen, setFeedingDialogOpen] = useState(false);
  const [schedules, setSchedules] = useState<FeedingSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<FeedingSchedule | null>(null);
  
  const fetchSchedules = async () => {
    if (!dogId) return;
    
    try {
      setLoading(true);
      const data = await getDogFeedingSchedules(dogId);
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching feeding schedules:', error);
      toast({
        title: 'Error',
        description: 'Failed to load feeding schedules.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSchedules();
  }, [dogId]);
  
  const handleNewScheduleSuccess = () => {
    setShowNewScheduleForm(false);
    fetchSchedules();
    toast({
      title: 'Success',
      description: 'New feeding schedule has been created.'
    });
  };
  
  const handleFeedingRecordSuccess = () => {
    fetchSchedules(); // Refresh to show latest data
    toast({
      title: 'Success',
      description: 'Feeding has been recorded successfully.'
    });
  };
  
  const handleLogFeeding = (schedule?: FeedingSchedule) => {
    setSelectedSchedule(schedule || null);
    setFeedingDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="schedules">Feeding Schedules</TabsTrigger>
            <TabsTrigger value="history">Feeding History</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            {activeTab === 'schedules' && !showNewScheduleForm && (
              <Button size="sm" onClick={() => setShowNewScheduleForm(true)}>
                <Plus className="h-4 w-4 mr-1" /> 
                New Schedule
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={fetchSchedules} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        <TabsContent value="schedules" className="space-y-4">
          {showNewScheduleForm ? (
            <FeedingScheduleForm 
              dogId={dogId} 
              onSuccess={handleNewScheduleSuccess}
              onCancel={() => setShowNewScheduleForm(false)} 
            />
          ) : loading ? (
            <Card>
              <CardContent className="pt-6">
                <LoadingState message="Loading feeding schedules..." />
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleLogFeeding()}
                >
                  <Plus className="h-4 w-4 mr-1" /> 
                  Quick Feed
                </Button>
              </div>
              
              <FeedingSchedulesList 
                schedules={schedules}
                onRefresh={fetchSchedules}
                onLogFeeding={handleLogFeeding}
              />
            </>
          )}
        </TabsContent>
        
        <TabsContent value="history">
          <FeedingHistoryView dogId={dogId} limit={25} />
        </TabsContent>
      </Tabs>
      
      <FeedingRecordForm
        open={feedingDialogOpen}
        onOpenChange={setFeedingDialogOpen}
        dogId={dogId}
        dogName={dogName}
        scheduleId={selectedSchedule?.id}
        defaultFoodType={selectedSchedule?.food_type || ''}
        defaultAmount={selectedSchedule ? `${selectedSchedule.amount} ${selectedSchedule.unit}` : ''}
        onSuccess={handleFeedingRecordSuccess}
      />
    </div>
  );
};

export default FeedingManagementTab;
