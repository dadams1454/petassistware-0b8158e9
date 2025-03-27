
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RefreshCw, Pill, Clock, AlertTriangle } from 'lucide-react';

import { MedicationProvider, useMedication } from '@/contexts/medication';
import MedicationSchedulesList from './MedicationSchedulesList';
import MedicationHistory from './MedicationHistory';
import MedicationForm from './MedicationForm';
import MedicationScheduleForm from './MedicationScheduleForm';
import { MedicationRecord, MedicationSchedule, MedicationStats } from '@/types/medication';

interface MedicationDashboardProps {
  dogId: string;
  dogName: string;
}

const MedicationStatCards = ({ stats }: { stats: MedicationStats | null }) => {
  if (!stats) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round(stats.complianceRate * 100)}%
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">Overdue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.overdueCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};

const MedicationDashboardContent: React.FC<MedicationDashboardProps> = ({ dogId, dogName }) => {
  const { 
    fetchSchedules, 
    fetchRecords, 
    fetchStats,
    schedules,
    records,
    stats,
    loading 
  } = useMedication();
  
  const [activeTab, setActiveTab] = useState('schedules');
  const [addMedicationDialogOpen, setAddMedicationDialogOpen] = useState(false);
  const [addScheduleDialogOpen, setAddScheduleDialogOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, [dogId]);

  const refreshData = async () => {
    await Promise.all([
      fetchSchedules(dogId),
      fetchRecords(dogId),
      fetchStats(dogId)
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setAddMedicationDialogOpen(true)}
        >
          <Pill className="h-4 w-4 mr-1" />
          Add Medication
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
      <MedicationStatCards stats={stats} />
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="schedules" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedules" className="pt-4">
          <MedicationSchedulesList 
            medications={schedules}
            onRefresh={refreshData}
            onEdit={(medicationId) => {
              // Handle edit medication
            }}
          />
        </TabsContent>
        
        <TabsContent value="history" className="pt-4">
          <MedicationHistory 
            medications={records}
            onRefresh={refreshData}
            onEdit={(medicationId) => {
              // Handle edit medication
            }}
          />
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <Dialog open={addMedicationDialogOpen} onOpenChange={setAddMedicationDialogOpen}>
        <DialogContent className="max-w-md">
          <MedicationForm 
            dogId={dogId}
            onSuccess={() => {
              setAddMedicationDialogOpen(false);
              refreshData();
            }}
            onCancel={() => setAddMedicationDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={addScheduleDialogOpen} onOpenChange={setAddScheduleDialogOpen}>
        <DialogContent className="max-w-md">
          <MedicationScheduleForm 
            dogId={dogId}
            onSuccess={() => {
              setAddScheduleDialogOpen(false);
              refreshData();
            }}
            onCancel={() => setAddScheduleDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const MedicationDashboard: React.FC<MedicationDashboardProps> = (props) => {
  return (
    <MedicationProvider>
      <MedicationDashboardContent {...props} />
    </MedicationProvider>
  );
};

export default MedicationDashboard;
