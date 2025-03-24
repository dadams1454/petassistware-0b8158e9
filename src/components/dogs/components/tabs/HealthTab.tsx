
import React, { useState } from 'react';
import { Syringe, Stethoscope, Pill } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import HealthRecordDialog from '../health/HealthRecordDialog';
import HealthTabHeader from '../health/HealthTabHeader';
import AllRecordsTabContent from '../health/AllRecordsTabContent';
import VaccinationsTabContent from '../health/VaccinationsTabContent';
import ExaminationsTabContent from '../health/ExaminationsTabContent';
import MedicationsTabContent from '../health/MedicationsTabContent';
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
    getRecordsByType,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord
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

  // Get typed records
  const vaccinationRecords = getRecordsByType('vaccination');
  const examinationRecords = getRecordsByType('examination');
  const medicationRecords = getRecordsByType('medication');

  return (
    <div className="space-y-6">
      <HealthTabHeader onAdd={handleAddRecord} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="vaccinations">
            <Syringe className="h-4 w-4 mr-2" />
            Vaccinations
            {vaccinationRecords.length > 0 && (
              <Badge variant="secondary" className="ml-2">{vaccinationRecords.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="examinations">
            <Stethoscope className="h-4 w-4 mr-2" />
            Examinations
            {examinationRecords.length > 0 && (
              <Badge variant="secondary" className="ml-2">{examinationRecords.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="medications">
            <Pill className="h-4 w-4 mr-2" />
            Medications
            {medicationRecords.length > 0 && (
              <Badge variant="secondary" className="ml-2">{medicationRecords.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4 mt-4">
          <AllRecordsTabContent 
            records={healthRecords}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRecord}
          />
        </TabsContent>
        
        <TabsContent value="vaccinations" className="space-y-4 mt-4">
          <VaccinationsTabContent 
            records={vaccinationRecords}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRecord}
          />
        </TabsContent>
        
        <TabsContent value="examinations" className="space-y-4 mt-4">
          <ExaminationsTabContent 
            records={examinationRecords}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRecord}
          />
        </TabsContent>
        
        <TabsContent value="medications" className="space-y-4 mt-4">
          <MedicationsTabContent 
            records={medicationRecords}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRecord}
          />
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
