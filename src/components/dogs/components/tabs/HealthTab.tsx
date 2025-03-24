
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle, Calendar, Activity } from 'lucide-react';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import { useWeightTracking } from '../../hooks/useWeightTracking';
import { HealthRecordType } from '@/types/health';
import HealthRecordsList from '../health/HealthRecordsList';
import VaccinationSection from '../health/VaccinationSection';
import WeightTrackingSection from '../health/WeightTrackingSection';
import HealthSummaryCard from '../health/HealthSummaryCard';
import WeightEntryDialog from '../health/WeightEntryDialog';
import HealthRecordDialog from '../../components/profile/records/HealthRecordDialog';

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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Health Records</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setWeightDialogOpen(true)}
          >
            <Activity className="h-4 w-4 mr-2" />
            Add Weight
          </Button>
          <Button onClick={() => handleAddRecord(HealthRecordType.Examination)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </Button>
        </div>
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
          <HealthSummaryCard 
            dogId={dogId}
            upcomingVaccinations={getUpcomingVaccinations()}
            overdueVaccinations={getOverdueVaccinations()}
            recentExaminations={getRecordsByType(HealthRecordType.Examination).slice(0, 3)}
            currentMedications={getRecordsByType(HealthRecordType.Medication)}
            latestWeight={weightHistory ? weightHistory[0] : undefined}
            growthStats={growthStats}
            isLoading={recordsLoading || weightLoading}
          />
          
          {getOverdueVaccinations().length > 0 && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-600 flex items-center">
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
              <CardTitle className="flex items-center">
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
              <CardTitle className="flex items-center">
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
        </TabsContent>
        
        <TabsContent value="vaccinations" className="pt-4">
          <VaccinationSection 
            vaccinations={getRecordsByType(HealthRecordType.Vaccination)}
            upcomingVaccinations={getUpcomingVaccinations()}
            overdueVaccinations={getOverdueVaccinations()}
            onAdd={() => handleAddRecord(HealthRecordType.Vaccination)}
            onEdit={handleEditRecord}
            onDelete={deleteHealthRecord}
            isLoading={recordsLoading}
          />
        </TabsContent>
        
        <TabsContent value="examinations" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Examination Records</CardTitle>
              <Button
                size="sm"
                onClick={() => handleAddRecord(HealthRecordType.Examination)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Examination
              </Button>
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
        </TabsContent>
        
        <TabsContent value="medications" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Medication Records</CardTitle>
              <Button
                size="sm"
                onClick={() => handleAddRecord(HealthRecordType.Medication)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
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
        </TabsContent>
        
        <TabsContent value="weight" className="pt-4">
          <WeightTrackingSection 
            weightHistory={weightHistory || []}
            growthStats={growthStats}
            onAddWeight={() => setWeightDialogOpen(true)}
            isLoading={weightLoading}
          />
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
          onSave={(weightRecord) => addWeightRecord({ ...weightRecord, dog_id: dogId })}
        />
      )}
    </div>
  );
};

export default HealthTab;
