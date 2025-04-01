
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Check, AlertTriangle, CalendarCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { usePuppyDetail } from '@/hooks/usePuppyDetail';
import { usePuppyVaccinations } from '@/hooks/usePuppyVaccinations';
import { LoadingState, ErrorState } from '@/components/ui/standardized';
import AddVaccinationForm from './AddVaccinationForm';
import VaccinationSchedule from './VaccinationSchedule';
import VaccinationCalendar from './VaccinationCalendar';

interface VaccinationDashboardProps {
  puppyId: string;
}

const VaccinationDashboard: React.FC<VaccinationDashboardProps> = ({ puppyId }) => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const { puppy, isLoading: isPuppyLoading, error: puppyError } = usePuppyDetail(puppyId);
  
  const { 
    vaccinations, 
    upcomingVaccinations,
    completedVaccinations,
    overdueVaccinations,
    isLoading: isVaxLoading,
    error: vaxError,
    addVaccination
  } = usePuppyVaccinations(puppyId);
  
  const isLoading = isPuppyLoading || isVaxLoading;
  const error = puppyError || vaxError;

  const handleAddVaccination = async (data: any) => {
    await addVaccination(data);
    setIsDialogOpen(false);
  };
  
  if (isLoading) {
    return <LoadingState message="Loading vaccination data..." />;
  }
  
  if (error || !puppy) {
    return <ErrorState title="Error" message="Failed to load puppy information." />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{puppy.name || 'Puppy'} Vaccination Tracking</h2>
          <p className="text-muted-foreground">
            Manage vaccination schedule and health records
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vaccination
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate(`/litters/${puppy.litter_id}`)}
          >
            Back to Litter
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-green-500" />
              Vaccination Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Age:</span>
                <span className="font-medium">{puppy.ageInDays || 0} days</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Vaccinations Due:</span>
                <Badge variant={overdueVaccinations.length > 0 ? "destructive" : "outline"}>
                  {overdueVaccinations.length}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Upcoming Vaccinations:</span>
                <Badge variant="outline">
                  {upcomingVaccinations.length}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Completed Vaccinations:</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {completedVaccinations.length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Vaccination Summary</CardTitle>
            <CardDescription>Recent and upcoming vaccinations</CardDescription>
          </CardHeader>
          <CardContent>
            {vaccinations.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No vaccination records yet</p>
                <Button onClick={() => setIsDialogOpen(true)}>Add First Vaccination</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {overdueVaccinations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      Overdue
                    </h3>
                    {overdueVaccinations.slice(0, 2).map((vax) => (
                      <div key={vax.id} className="mb-2 p-2 border border-destructive/20 bg-destructive/5 rounded-md">
                        <div className="flex justify-between">
                          <span className="font-medium">{vax.vaccination_type}</span>
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                            {new Date(vax.due_date).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{vax.notes || 'No notes'}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {upcomingVaccinations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      Upcoming
                    </h3>
                    {upcomingVaccinations.slice(0, 2).map((vax) => (
                      <div key={vax.id} className="mb-2 p-2 border rounded-md">
                        <div className="flex justify-between">
                          <span className="font-medium">{vax.vaccination_type}</span>
                          <Badge variant="outline">
                            {new Date(vax.due_date).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{vax.notes || 'No notes'}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {completedVaccinations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Completed
                    </h3>
                    {completedVaccinations.slice(0, 2).map((vax) => (
                      <div key={vax.id} className="mb-2 p-2 border border-green-100 bg-green-50 rounded-md">
                        <div className="flex justify-between">
                          <span className="font-medium">{vax.vaccination_type}</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {new Date(vax.vaccination_date).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{vax.notes || 'No notes'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="pt-4">
          <VaccinationSchedule 
            puppyId={puppyId} 
            onAddVaccination={() => setIsDialogOpen(true)}
          />
        </TabsContent>
        
        <TabsContent value="calendar" className="pt-4">
          <VaccinationCalendar 
            puppyId={puppyId}
            onAddVaccination={() => setIsDialogOpen(true)}
          />
        </TabsContent>
      </Tabs>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add Vaccination Record</DialogTitle>
            <DialogDescription>
              Record a new vaccination for {puppy.name || 'this puppy'}.
            </DialogDescription>
          </DialogHeader>
          
          <AddVaccinationForm 
            puppyId={puppyId}
            onSubmit={handleAddVaccination}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VaccinationDashboard;
