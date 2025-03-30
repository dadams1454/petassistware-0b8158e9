import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, AlertTriangle, Calendar, Activity } from 'lucide-react';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import { useWeightTracking } from '../../hooks/useWeightTracking';
import { HealthRecord, HealthRecordTypeEnum, WeightRecord, adaptHealthRecord, adaptWeightRecord } from '@/types/health';
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
  const [selectedRecordType, setSelectedRecordType] = useState(HealthRecordTypeEnum.Examination);
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
  
  const handleAddRecord = (type: HealthRecordTypeEnum) => {
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
  
  // Ensure all records have proper type casting and fields
  const safeHealthRecords = healthRecords?.map(record => {
    // Make sure each record has required fields from the HealthRecord interface
    return adaptHealthRecord(record);
  }) || [];
  
  const safeWeightHistory = weightHistory?.map(record => {
    // Make sure each weight record has required fields from the WeightRecord interface
    return adaptWeightRecord(record);
  }) || [];
  
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Health Records"
        description="Track vaccinations, examinations, medications, and weight over time"
        action={{
          label: "Add Record",
          onClick: () => handleAddRecord(HealthRecordTypeEnum.Examination),
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
        
        <ActionButton onClick={() => handleAddRecord(HealthRecordTypeEnum.Examination)}>
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
          {!safeHealthRecords || safeHealthRecords.length === 0 ? (
            <EmptyState
              title="No health records yet"
              description="Start tracking this dog's health by adding records for vaccinations, examinations, or medications."
              action={{
                label: "Add First Record",
                onClick: () => handleAddRecord(HealthRecordTypeEnum.Examination)
              }}
            />
          ) : (
            <>
              <HealthSummaryCard 
                dogId={dogId}
                upcomingVaccinations={getUpcomingVaccinations().map(r => adaptHealthRecord(r))}
                overdueVaccinations={getOverdueVaccinations().map(r => adaptHealthRecord(r))}
                recentExaminations={getRecordsByType(HealthRecordTypeEnum.Examination).map(r => adaptHealthRecord(r))}
                currentMedications={getRecordsByType(HealthRecordTypeEnum.Medication).map(r => adaptHealthRecord(r))}
                latestWeight={safeWeightHistory[0]}
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
                      records={getOverdueVaccinations().map(r => adaptHealthRecord(r))}
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
                    records={getUpcomingVaccinations().map(r => adaptHealthRecord(r))}
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
                    records={safeHealthRecords.slice(0, 5)}
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
          {getRecordsByType(HealthRecordTypeEnum.Vaccination).length === 0 ? (
            <EmptyState
              title="No vaccination records"
              description="Start tracking this dog's vaccinations to ensure they stay up-to-date on important shots."
              action={{
                label: "Add Vaccination",
                onClick: () => handleAddRecord(HealthRecordTypeEnum.Vaccination)
              }}
            />
          ) : (
            <VaccinationSection 
              vaccinations={getRecordsByType(HealthRecordTypeEnum.Vaccination).map(r => adaptHealthRecord(r))}
              upcomingVaccinations={getUpcomingVaccinations().map(r => adaptHealthRecord(r))}
              overdueVaccinations={getOverdueVaccinations().map(r => adaptHealthRecord(r))}
              onAdd={() => handleAddRecord(HealthRecordTypeEnum.Vaccination)}
              onEdit={handleEditRecord}
              onDelete={deleteHealthRecord}
              isLoading={recordsLoading}
            />
          )}
        </TabsContent>
        
        <TabsContent value="examinations" className="pt-4">
          {getRecordsByType(HealthRecordTypeEnum.Examination).length === 0 ? (
            <EmptyState
              title="No examination records"
              description="Keep track of vet visits and health check-ups by adding examination records."
              action={{
                label: "Add Examination",
                onClick: () => handleAddRecord(HealthRecordTypeEnum.Examination)
              }}
            />
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Examination Records</CardTitle>
                <ActionButton
                  size="sm"
                  onClick={() => handleAddRecord(HealthRecordTypeEnum.Examination)}
                  icon={<Plus className="h-4 w-4" />}
                >
                  Add Examination
                </ActionButton>
              </CardHeader>
              <CardContent>
                <HealthRecordsList 
                  records={getRecordsByType(HealthRecordTypeEnum.Examination).map(r => adaptHealthRecord(r))}
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
          {getRecordsByType(HealthRecordTypeEnum.Medication).length === 0 ? (
            <EmptyState
              title="No medication records"
              description="Track medications, supplements, and treatments by adding medication records."
              action={{
                label: "Add Medication",
                onClick: () => handleAddRecord(HealthRecordTypeEnum.Medication)
              }}
            />
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Medication Records</CardTitle>
                <ActionButton
                  size="sm"
                  onClick={() => handleAddRecord(HealthRecordTypeEnum.Medication)}
                  icon={<Plus className="h-4 w-4" />}
                >
                  Add Medication
                </ActionButton>
              </CardHeader>
              <CardContent>
                <HealthRecordsList 
                  records={getRecordsByType(HealthRecordTypeEnum.Medication).map(r => adaptHealthRecord(r))}
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
          {!safeWeightHistory || safeWeightHistory.length === 0 ? (
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
              dogId={dogId}
              weightHistory={safeWeightHistory}
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
          record={selectedRecord ? safeHealthRecords.find(r => r.id === selectedRecord) || null : null}
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
