import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RefreshCw, Utensils, Clock, AlertTriangle } from 'lucide-react';

import { FeedingProvider, useFeeding } from '@/contexts/feeding';
import FeedingSchedulesList from './FeedingSchedulesList';
import FeedingHistory from './FeedingHistory';
import FeedingForm from './FeedingForm';
import FeedingScheduleForm from './FeedingScheduleForm';
import { FeedingRecord, FeedingSchedule, FeedingStats } from '@/types/feeding';

interface FeedingDashboardProps {
  dogId: string;
  dogName: string;
}

const FeedingStatCards = ({ stats }: { stats: FeedingStats | null }) => {
  if (!stats) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">Total Meals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMeals}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">Consumption Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round((1 - stats.mealsRefused / stats.totalMeals) * 100)}%
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">Meals Refused</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.mealsRefused}</div>
        </CardContent>
      </Card>
    </div>
  );
};

const FeedingDashboardContent: React.FC<FeedingDashboardProps> = ({ dogId, dogName }) => {
  const { 
    fetchSchedules, 
    fetchRecords, 
    fetchStats,
    schedules,
    records,
    stats,
    loading 
  } = useFeeding();
  
  const [activeTab, setActiveTab] = useState('schedules');
  const [addFeedingDialogOpen, setAddFeedingDialogOpen] = useState(false);
  const [addScheduleDialogOpen, setAddScheduleDialogOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, [dogId]);

  const refreshData = async () => {
    await Promise.all([
      fetchSchedules(dogId),
      fetchRecords(dogId),
      fetchStats(dogId, 'week')
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setAddFeedingDialogOpen(true)}
        >
          <Utensils className="h-4 w-4 mr-1" />
          Log Feeding
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setAddScheduleDialogOpen(true)}
        >
          <Clock className="h-4 w-4 mr-1" />
          Create Schedule
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={refreshData} 
          disabled={loading}
          className="ml-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      {/* Stats Overview */}
      <FeedingStatCards stats={stats} />
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="schedules" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedules" className="pt-4">
          <FeedingSchedulesList 
            dogId={dogId}
            schedules={schedules}
            onRefresh={refreshData}
          />
        </TabsContent>
        
        <TabsContent value="history" className="pt-4">
          <FeedingHistory 
            dogId={dogId}
            records={records}
            schedules={schedules}
            onRefresh={refreshData}
          />
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <Dialog open={addFeedingDialogOpen} onOpenChange={setAddFeedingDialogOpen}>
        <DialogContent className="max-w-md">
          <FeedingForm 
            dogId={dogId}
            schedules={schedules}
            onSuccess={() => {
              setAddFeedingDialogOpen(false);
              refreshData();
            }}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={addScheduleDialogOpen} onOpenChange={setAddScheduleDialogOpen}>
        <DialogContent className="max-w-md">
          <FeedingScheduleForm 
            dogId={dogId}
            onSuccess={() => {
              setAddScheduleDialogOpen(false);
              refreshData();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const FeedingDashboard: React.FC<FeedingDashboardProps> = (props) => {
  return (
    <FeedingProvider>
      <FeedingDashboardContent {...props} />
    </FeedingProvider>
  );
};

export default FeedingDashboard;
