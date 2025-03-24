
import React, { useState } from 'react';
import { Plus, Syringe, Stethoscope, Pill, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import HealthRecordDialog from '../health/HealthRecordDialog';
import HealthRecordList from '../health/HealthRecordList';
import { HealthRecord } from '../../types/healthRecord';

interface HealthTabProps {
  dogId: string;
}

const HealthTab: React.FC<HealthTabProps> = ({ dogId }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const {
    healthRecords,
    isLoading,
    error,
    selectedRecord,
    setSelectedRecord,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    getRecordsByType
  } = useHealthRecords(dogId);

  const handleAddRecord = () => {
    setSelectedRecord(null);
    setIsDialogOpen(true);
  };

  const handleEditRecord = (record: HealthRecord) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const handleDeleteRecord = (recordId: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteHealthRecord(recordId);
    }
  };

  const handleSaveRecord = (record: any) => {
    if (selectedRecord) {
      updateHealthRecord({ ...selectedRecord, ...record });
    } else {
      addHealthRecord({ 
        ...record, 
        dog_id: dogId 
      });
    }
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading health records. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  // Get typed records from our local type definition
  const vaccinationRecordsFromLocalType: HealthRecord[] = getRecordsByType('vaccination');
  const examinationRecordsFromLocalType: HealthRecord[] = getRecordsByType('examination');
  const medicationRecordsFromLocalType: HealthRecord[] = getRecordsByType('medication');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Health Records</h2>
        <Button onClick={handleAddRecord}>
          <Plus className="h-4 w-4 mr-2" />
          Add Health Record
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="vaccinations">
            <Syringe className="h-4 w-4 mr-2" />
            Vaccinations
            {vaccinationRecordsFromLocalType.length > 0 && (
              <Badge variant="secondary" className="ml-2">{vaccinationRecordsFromLocalType.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="examinations">
            <Stethoscope className="h-4 w-4 mr-2" />
            Examinations
            {examinationRecordsFromLocalType.length > 0 && (
              <Badge variant="secondary" className="ml-2">{examinationRecordsFromLocalType.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="medications">
            <Pill className="h-4 w-4 mr-2" />
            Medications
            {medicationRecordsFromLocalType.length > 0 && (
              <Badge variant="secondary" className="ml-2">{medicationRecordsFromLocalType.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4 mt-4">
          {healthRecords && healthRecords.length > 0 ? (
            <HealthRecordList 
              records={healthRecords}
              onEdit={handleEditRecord}
              onDelete={handleDeleteRecord}
            />
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No health records found. Use the "Add Health Record" button to add your first record.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="vaccinations" className="space-y-4 mt-4">
          {vaccinationRecordsFromLocalType.length > 0 ? (
            <HealthRecordList 
              records={vaccinationRecordsFromLocalType}
              onEdit={handleEditRecord}
              onDelete={handleDeleteRecord}
            />
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Syringe className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No vaccination records found. Add a vaccination record to track your dog's vaccines.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="examinations" className="space-y-4 mt-4">
          {examinationRecordsFromLocalType.length > 0 ? (
            <HealthRecordList 
              records={examinationRecordsFromLocalType}
              onEdit={handleEditRecord}
              onDelete={handleDeleteRecord}
            />
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Stethoscope className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No examination records found. Add an examination record to track your dog's check-ups.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="medications" className="space-y-4 mt-4">
          {medicationRecordsFromLocalType.length > 0 ? (
            <HealthRecordList 
              records={medicationRecordsFromLocalType}
              onEdit={handleEditRecord}
              onDelete={handleDeleteRecord}
            />
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Pill className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No medication records found. Add a medication record to track your dog's treatments.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      <HealthRecordDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        record={selectedRecord}
        onSave={handleSaveRecord}
      />
    </div>
  );
};

export default HealthTab;
