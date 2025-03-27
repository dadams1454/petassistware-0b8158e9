
import React, { useState, useEffect } from 'react';
import { Pill, RefreshCw, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { SkeletonLoader } from '@/components/ui/standardized';
import { Badge } from '@/components/ui/badge';

import { useMedication } from '@/contexts/medication/MedicationContext';
import { MedicationsList } from '@/components/dogs/components/care/medication';
import { MedicationType, MedicationRecord, MedicationFrequency } from '@/types/medication';
import { format, isPast } from 'date-fns';

// Props interface
interface MedicationsTabProps {
  dogStatuses: {
    dog_id: string;
    dog_name: string;
    photo_url?: string | null;
  }[] | null;
  onRefreshDogs: () => void;
}

const MedicationSummaryCard = ({ 
  title, 
  icon, 
  value, 
  description,
  bgColor = 'bg-primary-50'
}: { 
  title: string; 
  icon: React.ReactNode; 
  value: number | string; 
  description: string;
  bgColor?: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex space-x-4 items-center">
        <div className={`${bgColor} p-3 rounded-full`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">{title}</div>
          <div className="text-xs text-muted-foreground mt-1">{description}</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const UpcomingMedicationItem = ({ 
  medication, 
  dogName,
  onAdminister
}: { 
  medication: MedicationRecord; 
  dogName: string;
  onAdminister: () => void;
}) => {
  const dueDate = medication.next_due_date ? new Date(medication.next_due_date) : null;
  const isOverdue = dueDate && isPast(dueDate);
  
  return (
    <div className="flex items-center justify-between p-3 bg-background rounded-md border mb-2">
      <div>
        <div className="font-medium flex items-center">
          {medication.medication_name}
          {isOverdue && (
            <Badge variant="destructive" className="ml-2 text-xs">Overdue</Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {dogName} • {dueDate ? format(dueDate, 'MMM d, yyyy') : 'No due date'}
        </div>
      </div>
      <Button size="sm" variant="outline" onClick={onAdminister}>
        <CheckCircle className="h-4 w-4 mr-1" />
        Log
      </Button>
    </div>
  );
};

const MedicationsTab: React.FC<MedicationsTabProps> = ({ dogStatuses, onRefreshDogs }) => {
  const { 
    medications,
    stats,
    loading,
    error,
    fetchMedications,
    fetchStats
  } = useMedication();
  
  const [selectedDog, setSelectedDog] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get selected dog details
  const dogDetails = selectedDog 
    ? dogStatuses?.find(dog => dog.dog_id === selectedDog) 
    : null;
  
  // Fetch data when tab is viewed or dog selection changes
  useEffect(() => {
    if (selectedDog) {
      fetchMedications(selectedDog);
      fetchStats(selectedDog);
    }
  }, [selectedDog]);
  
  // Set first dog as selected when dogStatuses changes
  useEffect(() => {
    if (dogStatuses?.length && !selectedDog) {
      setSelectedDog(dogStatuses[0].dog_id);
    }
  }, [dogStatuses]);
  
  // Handle dog selection change
  const handleDogChange = (dogId: string) => {
    setSelectedDog(dogId);
  };
  
  // Filter medications by type
  const preventativeMeds = medications?.filter(
    med => med.medication_type === MedicationType.PREVENTATIVE
  ) || [];
  
  const upcomingMeds = medications?.filter(med => {
    if (!med.next_due_date) return false;
    const dueDate = new Date(med.next_due_date);
    const today = new Date();
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(today.getDate() + 14);
    return dueDate <= twoWeeksLater;
  }) || [];
  
  // Handle medication administration
  const handleAdminister = (medication: MedicationRecord) => {
    // TODO: Implement medication administration logic
    console.log('Administer medication:', medication);
  };
  
  // Check if we have any dogs
  const hasDogs = Array.isArray(dogStatuses) && dogStatuses.length > 0;
  
  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Medication Management</h2>
          <p className="text-muted-foreground">
            Track and manage all medications for your dogs
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={onRefreshDogs} 
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {!hasDogs ? (
        <Card className="p-8 text-center">
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-purple-100 dark:bg-purple-900/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Pill className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Dogs Found</h3>
              <p className="text-muted-foreground mb-4">Add dogs to start tracking medications</p>
              <Button onClick={onRefreshDogs} variant="outline">Refresh Dogs</Button>
            </div>
          </CardContent>
        </Card>
      ) : loading ? (
        <SkeletonLoader variant="card" count={3} />
      ) : (
        <>
          {/* Dog Selection */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {dogStatuses?.map(dog => (
              <Button
                key={dog.dog_id}
                variant={selectedDog === dog.dog_id ? "default" : "outline"}
                onClick={() => handleDogChange(dog.dog_id)}
                className="whitespace-nowrap"
              >
                {dog.dog_name}
              </Button>
            ))}
          </div>
          
          {/* Selected Dog Content */}
          {selectedDog && dogDetails && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="preventative">Preventative</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="all">All Medications</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview">
                {stats ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <MedicationSummaryCard
                        title="Active Medications"
                        icon={<Pill className="h-6 w-6 text-primary" />}
                        value={stats.activeCount}
                        description={`${stats.total} total medications`}
                        bgColor="bg-primary/10"
                      />
                      
                      <MedicationSummaryCard
                        title="Preventative Meds"
                        icon={<Calendar className="h-6 w-6 text-green-600" />}
                        value={stats.preventative}
                        description="Regular preventative treatments"
                        bgColor="bg-green-100"
                      />
                      
                      <MedicationSummaryCard
                        title="Overdue"
                        icon={<AlertCircle className="h-6 w-6 text-red-600" />}
                        value={stats.overdueCount}
                        description="Medications past their due date"
                        bgColor="bg-red-100"
                      />
                    </div>
                    
                    {upcomingMeds.length > 0 && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle>Upcoming Medications</CardTitle>
                          <CardDescription>
                            Medications due in the next 14 days
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {upcomingMeds.slice(0, 5).map(med => (
                            <UpcomingMedicationItem
                              key={med.id}
                              medication={med}
                              dogName={dogDetails.dog_name}
                              onAdminister={() => handleAdminister(med)}
                            />
                          ))}
                          
                          {upcomingMeds.length > 5 && (
                            <Button 
                              variant="link" 
                              className="mt-2 p-0"
                              onClick={() => setActiveTab('upcoming')}
                            >
                              View all {upcomingMeds.length} upcoming medications
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <SkeletonLoader variant="card" count={3} />
                )}
              </TabsContent>
              
              {/* Preventative Tab */}
              <TabsContent value="preventative">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preventative Medications</CardTitle>
                      <CardDescription>
                        Ongoing preventative treatments for {dogDetails.dog_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MedicationsList
                        medications={preventativeMeds}
                        dogId={selectedDog}
                        onRefresh={() => {
                          fetchMedications(selectedDog);
                          fetchStats(selectedDog);
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Upcoming Tab */}
              <TabsContent value="upcoming">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Medications</CardTitle>
                      <CardDescription>
                        Medications due in the next 14 days for {dogDetails.dog_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MedicationsList
                        medications={upcomingMeds}
                        dogId={selectedDog}
                        onRefresh={() => {
                          fetchMedications(selectedDog);
                          fetchStats(selectedDog);
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* All Medications Tab */}
              <TabsContent value="all">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Medications</CardTitle>
                      <CardDescription>
                        Complete medication history for {dogDetails.dog_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MedicationsList
                        medications={medications || []}
                        dogId={selectedDog}
                        onRefresh={() => {
                          fetchMedications(selectedDog);
                          fetchStats(selectedDog);
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </div>
  );
};

export default MedicationsTab;
