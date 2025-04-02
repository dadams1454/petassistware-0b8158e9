
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingState, ErrorState } from '@/components/ui/standardized';
import { usePuppyVaccinations } from '@/hooks/usePuppyVaccinations';
import VaccinationForm from './VaccinationForm';
import VaccinationSchedule from './VaccinationSchedule';
import VaccinationRecords from './VaccinationRecords';
import { VaccinationScheduleItem } from '@/types/puppyTracking';

interface VaccinationDashboardProps {
  puppyId: string;
}

const VaccinationDashboard: React.FC<VaccinationDashboardProps> = ({ puppyId }) => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const { 
    vaccinations, 
    isLoading, 
    error, 
    refresh,
    addVaccination,
    scheduleVaccination 
  } = usePuppyVaccinations(puppyId);
  
  // Derived data - process vaccinations into categories
  const [upcomingVaccinations, setUpcomingVaccinations] = useState<VaccinationScheduleItem[]>([]);
  const [completedVaccinations, setCompletedVaccinations] = useState<VaccinationScheduleItem[]>([]);
  const [overdueVaccinations, setOverdueVaccinations] = useState<VaccinationScheduleItem[]>([]);
  
  // Process vaccinations into categories
  useEffect(() => {
    if (!vaccinations) return;
    
    const today = new Date();
    const upcoming: VaccinationScheduleItem[] = [];
    const completed: VaccinationScheduleItem[] = [];
    const overdue: VaccinationScheduleItem[] = [];
    
    vaccinations.forEach(vaccination => {
      const isCompleted = vaccination.completed || vaccination.is_completed || 
                           (vaccination.vaccination_date !== undefined && vaccination.vaccination_date !== null);
      
      if (isCompleted) {
        completed.push(vaccination);
      } else {
        const dueDate = new Date(vaccination.due_date);
        if (dueDate < today) {
          overdue.push(vaccination);
        } else {
          upcoming.push(vaccination);
        }
      }
    });
    
    setUpcomingVaccinations(upcoming);
    setCompletedVaccinations(completed);
    setOverdueVaccinations(overdue);
  }, [vaccinations]);
  
  const handleRefresh = () => {
    refresh();
  };
  
  const handleFormSubmit = async (data: any) => {
    try {
      if (data.vaccination_date) {
        // Add as completed vaccination
        await addVaccination({
          ...data,
          puppy_id: puppyId,
          completed: true,
          is_completed: true
        });
      } else {
        // Schedule for the future
        await scheduleVaccination({
          ...data,
          puppy_id: puppyId
        });
      }
      setShowForm(false);
      refresh();
    } catch (error) {
      console.error('Error submitting vaccination:', error);
    }
  };
  
  if (isLoading) {
    return <LoadingState message="Loading vaccination data..." />;
  }
  
  if (error) {
    return (
      <ErrorState 
        title="Error Loading Vaccinations" 
        message="Could not load vaccination data"
        onAction={handleRefresh}
        actionLabel="Retry"
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Vaccination Management</h2>
          <p className="text-muted-foreground">Track and schedule vaccinations</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowForm(true)} disabled={showForm}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vaccination
          </Button>
        </div>
      </div>
      
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Vaccination</CardTitle>
          </CardHeader>
          <CardContent>
            <VaccinationForm 
              puppyId={puppyId}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming
            {upcomingVaccinations.length > 0 && (
              <span className="ml-2 bg-primary/10 text-primary px-2 rounded-full text-xs">
                {upcomingVaccinations.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            {completedVaccinations.length > 0 && (
              <span className="ml-2 bg-green-100 text-green-700 px-2 rounded-full text-xs">
                {completedVaccinations.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="overdue">
            Overdue
            {overdueVaccinations.length > 0 && (
              <span className="ml-2 bg-red-100 text-red-700 px-2 rounded-full text-xs">
                {overdueVaccinations.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="pt-4">
          <VaccinationSchedule 
            vaccinations={upcomingVaccinations} 
            onRefresh={refresh}
            status="upcoming"
          />
        </TabsContent>
        
        <TabsContent value="completed" className="pt-4">
          <VaccinationRecords 
            vaccinations={completedVaccinations}
            onRefresh={refresh}
          />
        </TabsContent>
        
        <TabsContent value="overdue" className="pt-4">
          <VaccinationSchedule 
            vaccinations={overdueVaccinations}
            onRefresh={refresh} 
            status="overdue"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VaccinationDashboard;
