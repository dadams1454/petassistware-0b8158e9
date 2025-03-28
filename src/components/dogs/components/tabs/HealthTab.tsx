
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, AlertTriangle, Calendar, Activity } from 'lucide-react';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import { useWeightTracking } from '../../hooks/useWeightTracking';
import { HealthRecordType } from '@/types/health';
import HealthRecordsList from '../health/HealthRecordsList';
import VaccinationSection from '../health/VaccinationSection';
import WeightTrackingSection from '../health/WeightTrackingSection';
import HealthSummaryCard from '../health/HealthSummaryCard';
import WeightEntryDialog from '../health/WeightEntryDialog';
import HealthRecordDialog from '../profile/records/HealthRecordDialog';

// Import standardized components
import {
  SectionHeader,
  LoadingState,
  ErrorState,
  EmptyState,
  ActionButton
} from '@/components/ui/standardized';

interface HealthTabProps {
  dogId: string;
}

const HealthTab: React.FC<HealthTabProps> = ({ dogId }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [selectedRecordType, setSelectedRecordType] = useState<HealthRecordType>(HealthRecordType.Examination);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  
  const { 
    healthRecords, 
    isLoading: recordsLoading,
    error: recordsError,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    getRecordsByType,
    getUpcomingVaccinations,
    getOverdueVaccinations,
    refetch
  } = useHealthRecords(dogId);
  
  const { 
    weightHistory, 
    isLoading: weightLoading,
    error: weightError,
    addWeightRecord,
    growthStats 
  } = useWeightTracking(dogId);
  
  const handleAddRecord = (type: HealthRecordType) => {
    setSelectedRecordType(type);
    setSelectedRecord(null);
    setRecordDialogOpen(true);
  };
  
  const handleEditRecord = (recordId: string) => {
    setSelectedRecord(recordId);
    setRecordDialogOpen(true);
  };

  const handleSaveRecord = async () => {
    setRecordDialogOpen(false);
    await refetch();
  };
  
  // Handler for saving weight records
  const handleSaveWeight = (weightData: any) => {
    // Convert Date object to ISO string for compatibility with the API
    const formattedData = {
      ...weightData,
      dog_id: dogId,
      date: typeof weightData.date === 'string' ? weightData.date : weightData.date.toISOString().split('T')[0]
    };
    
    addWeightRecord(formattedData);
  };

  if (recordsLoading || weightLoading) {
    return <LoadingState message="Loading health data..." />;
  }

  if (recordsError || weightError) {
    return (
      <ErrorState 
        title="Could not load health records"
        message="There was a problem loading the health records. Please try again."
        onRetry={() => refetch()}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Health Records"
        description="Track vaccinations, examinations, medications, and weight over time"
        action={{
          label: "Add Record",
          onClick: () => handleAddRecord(HealthRecordType.Examination),
          icon: <Plus className="h-4 w-4" />
        }}
      />
      
      <div className="flex gap-2">
        <ActionButton 
          variant="outline" 
          onClick={() => setWeightDialogOpen(true)}
        >
          <Activity className="h-4 w-4 mr-2" />
          Add Weight
        </ActionButton>
        
        <ActionButton onClick={() => handleAddRecord(HealthRecordType.Examination)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </ActionButton>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="examinations">Examinations</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4 pt-4">
          {!healthRecords || healthRecords.length === 0 ? (
            <EmptyState
              title="No health records yet"
              description="Start tracking this dog's health by adding records for vaccinations, examinations, or medications."
              action={{
                label: "Add First Record",
                onClick: () => handleAddRecord(HealthRecordType.Examination)
              }}
            />
          ) : (
            <>
              <HealthSummaryCard 
                dogId={dogId}
                upcomingVaccinations={getUpcomingVaccinations()}
                overdueVaccinations={getOverdueVaccinations()}
                recentExaminations={getRecordsByType(HealthRecordType.Examination).slice(0, 3)}
                currentMedications={getRecordsByType(HealthRecordType.Medication)}
                latestWeight={weightHistory?.[0]}
                growthStats={growthStats}
                isLoading={recordsLoading || weightLoading}
              />
              
              {getOverdueVaccinations().length > 0 && (
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-red-600 flex items-center text-lg">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Overdue Vaccinations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HealthRecordsList 
                      records={getOverdueVaccinations()}
                      onEdit={handleEditRecord}
                      onDelete={deleteHealthRecord}
                      emptyMessage="No overdue vaccinations"
                    />
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Calendar className="h-5 w-5 mr-2" />
                    Upcoming Health Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HealthRecordsList 
                    records={getUpcomingVaccinations()}
                    onEdit={handleEditRecord}
                    onDelete={deleteHealthRecord}
                    emptyMessage="No upcoming health events"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Activity className="h-5 w-5 mr-2" />
                    Recent Health Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HealthRecordsList 
                    records={healthRecords?.slice(0, 5) || []}
                    onEdit={handleEditRecord}
                    onDelete={deleteHealthRecord}
                    emptyMessage="No recent health activities"
                  />
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="vaccinations" className="pt-4">
          {getRecordsByType(HealthRecordType.Vaccination).length === 0 ? (
            <EmptyState
              title="No vaccination records"
              description="Start tracking this dog's vaccinations to ensure they stay up-to-date on important shots."
              action={{
                label: "Add Vaccination",
                onClick: () => handleAddRecord(HealthRecordType.Vaccination)
              }}
            />
          ) : (
            <VaccinationSection 
              vaccinations={getRecordsByType(HealthRecordType.Vaccination)}
              upcomingVaccinations={getUpcomingVaccinations()}
              overdueVaccinations={getOverdueVaccinations()}
              onAdd={() => handleAddRecord(HealthRecordType.Vaccination)}
              onEdit={handleEditRecord}
              onDelete={deleteHealthRecord}
              isLoading={recordsLoading}
            />
          )}
        </TabsContent>
        
        <TabsContent value="examinations" className="pt-4">
          {getRecordsByType(HealthRecordType.Examination).length === 0 ? (
            <EmptyState
              title="No examination records"
              description="Keep track of vet visits and health check-ups by adding examination records."
              action={{
                label: "Add Examination",
                onClick: () => handleAddRecord(HealthRecordType.Examination)
              }}
            />
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Examination Records</CardTitle>
                <ActionButton
                  size="sm"
                  onClick={() => handleAddRecord(HealthRecordType.Examination)}
                  icon={<Plus className="h-4 w-4" />}
                >
                  Add Examination
                </ActionButton>
              </CardHeader>
              <CardContent>
                <HealthRecordsList 
                  records={getRecordsByType(HealthRecordType.Examination)}
                  onEdit={handleEditRecord}
                  onDelete={deleteHealthRecord}
                  emptyMessage="No examination records found"
                  isLoading={recordsLoading}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="medications" className="pt-4">
          {getRecordsByType(HealthRecordType.Medication).length === 0 ? (
            <EmptyState
              title="No medication records"
              description="Track medications, supplements, and treatments by adding medication records."
              action={{
                label: "Add Medication",
                onClick: () => handleAddRecord(HealthRecordType.Medication)
              }}
            />
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Medication Records</CardTitle>
                <ActionButton
                  size="sm"
                  onClick={() => handleAddRecord(HealthRecordType.Medication)}
                  icon={<Plus className="h-4 w-4" />}
                >
                  Add Medication
                </ActionButton>
              </CardHeader>
              <CardContent>
                <HealthRecordsList 
                  records={getRecordsByType(HealthRecordType.Medication)}
                  onEdit={handleEditRecord}
                  onDelete={deleteHealthRecord}
                  emptyMessage="No medication records found"
                  isLoading={recordsLoading}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="weight" className="pt-4">
          {!weightHistory || weightHistory.length === 0 ? (
            <EmptyState
              title="No weight history"
              description="Start tracking this dog's weight to monitor growth and health over time."
              action={{
                label: "Add Weight Record",
                onClick: () => setWeightDialogOpen(true)
              }}
            />
          ) : (
            <WeightTrackingSection 
              weightHistory={weightHistory || []}
              growthStats={growthStats}
              onAddWeight={() => setWeightDialogOpen(true)}
              isLoading={weightLoading}
            />
          )}
        </TabsContent>
      </Tabs>
      
      {recordDialogOpen && (
        <HealthRecordDialog
          open={recordDialogOpen}
          onOpenChange={setRecordDialogOpen}
          dogId={dogId}
          record={selectedRecord ? healthRecords?.find(r => r.id === selectedRecord) || null : null}
          onSave={handleSaveRecord}
        />
      )}
      
      {weightDialogOpen && (
        <WeightEntryDialog
          dogId={dogId}
          onClose={() => setWeightDialogOpen(false)}
          onSave={handleSaveWeight}
        />
      )}
    </div>
  );
};

export default HealthTab;
