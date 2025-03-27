
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Pill, Clock, RefreshCw, AlertTriangle, Calendar, ChevronRight } from 'lucide-react';

import { MedicationProvider, useMedication } from '@/contexts/medication/MedicationContext';
import MedicationForm from './MedicationForm';
import MedicationsList from './MedicationsList';
import MedicationSchedule from './MedicationSchedule';
import { MedicationRecord, MedicationStats, MedicationType } from '@/types/medication';

interface MedicationDashboardProps {
  dogId: string;
  dogName: string;
}

const MedicationStatCards = ({ stats }: { stats: MedicationStats | null }) => {
  if (!stats) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
          <CardTitle className="text-sm font-medium">Preventative</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.preventative}</div>
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
      
      <Card className={stats.overdueCount > 0 ? "border-red-300 bg-red-50 dark:bg-red-900/20" : ""}>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium flex items-center">
            {stats.overdueCount > 0 && <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />}
            Overdue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.overdueCount > 0 ? "text-red-600 dark:text-red-400" : ""}`}>
            {stats.overdueCount}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MedicationDashboardContent: React.FC<MedicationDashboardProps> = ({ dogId, dogName }) => {
  const { 
    fetchMedications,
    fetchStats,
    medications,
    stats,
    loading
  } = useMedication();
  
  const [activeTab, setActiveTab] = useState('current');
  const [addMedicationDialog, setAddMedicationDialog] = useState(false);
  const { toast } = useToast();

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, [dogId]);

  const refreshData = async () => {
    try {
      await Promise.all([
        fetchMedications(dogId),
        fetchStats(dogId)
      ]);
    } catch (error) {
      console.error('Error fetching medication data:', error);
      toast({
        title: 'Error loading medications',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    }
  };

  // Filter medications for each tab
  const currentMedications = medications?.filter(med => 
    !med.end_date || new Date(med.end_date) >= new Date()
  ) || [];
  
  const preventativeMedications = medications?.filter(med => 
    med.medication_type === MedicationType.PREVENTATIVE
  ) || [];
  
  const completedMedications = medications?.filter(med => 
    med.end_date && new Date(med.end_date) < new Date()
  ) || [];

  return (
    <div className="space-y-6">
      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => setAddMedicationDialog(true)}
        >
          <Pill className="h-4 w-4 mr-1" />
          Add Medication
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setActiveTab('schedule')}
        >
          <Calendar className="h-4 w-4 mr-1" />
          View Schedule
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
      
      {/* Upcoming Medications Alert */}
      {stats && stats.upcomingCount > 0 && (
        <Card className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
              <div>
                <h3 className="font-medium">Upcoming Medications</h3>
                <p className="text-sm text-muted-foreground">
                  {stats.upcomingCount} medication{stats.upcomingCount > 1 ? 's are' : ' is'} due in the next 7 days
                </p>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setActiveTab('schedule')}>
                View Schedule
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="current">Current ({currentMedications.length})</TabsTrigger>
          <TabsTrigger value="preventative">Preventative ({preventativeMedications.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedMedications.length})</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="pt-4">
          <MedicationsList 
            medications={currentMedications}
            dogId={dogId}
            onRefresh={refreshData}
          />
        </TabsContent>
        
        <TabsContent value="preventative" className="pt-4">
          <MedicationsList 
            medications={preventativeMedications}
            dogId={dogId}
            onRefresh={refreshData}
          />
        </TabsContent>
        
        <TabsContent value="completed" className="pt-4">
          <MedicationsList 
            medications={completedMedications}
            dogId={dogId}
            onRefresh={refreshData}
          />
        </TabsContent>
        
        <TabsContent value="schedule" className="pt-4">
          <MedicationSchedule 
            dogId={dogId}
            dogName={dogName}
            medications={medications || []}
            onRefresh={refreshData}
          />
        </TabsContent>
      </Tabs>
      
      {/* Add Medication Dialog */}
      <Dialog open={addMedicationDialog} onOpenChange={setAddMedicationDialog}>
        <DialogContent className="max-w-md">
          <MedicationForm 
            dogId={dogId}
            onSuccess={() => {
              setAddMedicationDialog(false);
              refreshData();
            }}
            onCancel={() => setAddMedicationDialog(false)}
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
