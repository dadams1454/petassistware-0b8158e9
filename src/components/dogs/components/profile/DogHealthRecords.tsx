
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useRefreshData } from '@/hooks/useRefreshData';
import { useToast } from '@/hooks/use-toast';
import { useDogHealthVaccinations } from '../../hooks/useDogHealthVaccinations';
import HealthRecordDialog from './records/HealthRecordDialog';
import VaccinationsTabContent from './records/VaccinationsTabContent';
import ExaminationsTabContent from './records/ExaminationsTabContent';
import MedicationsTabContent from './records/MedicationsTabContent';
import AllRecordsTabContent from './records/AllRecordsTabContent';
import { HealthRecord, HealthRecordType } from '@/types/health';

// Create a type adapter function to convert between health and dog record types if needed
const adaptHealthRecord = (record: any): HealthRecord => {
  return {
    id: record.id,
    dog_id: record.dog_id,
    date: record.date || record.visit_date,
    record_type: record.record_type as HealthRecordType,
    title: record.title,
    description: record.description || record.record_notes || '',
    performed_by: record.performed_by || record.vet_name || '',
    next_due_date: record.next_due_date,
    attachments: record.attachments,
    created_at: record.created_at,
    updated_at: record.updated_at,
    // Copy all the specific fields for different record types
    ...(record.vaccine_name && { vaccine_name: record.vaccine_name }),
    ...(record.manufacturer && { manufacturer: record.manufacturer }),
    ...(record.lot_number && { lot_number: record.lot_number }),
    ...(record.administration_route && { administration_route: record.administration_route }),
    ...(record.expiration_date && { expiration_date: record.expiration_date }),
    ...(record.reminder_sent !== undefined && { reminder_sent: record.reminder_sent }),
    ...(record.medication_name && { medication_name: record.medication_name }),
    ...(record.dosage !== undefined && { dosage: record.dosage }),
    ...(record.dosage_unit && { dosage_unit: record.dosage_unit }),
    ...(record.frequency && { frequency: record.frequency }),
    ...(record.duration !== undefined && { duration: record.duration }),
    ...(record.duration_unit && { duration_unit: record.duration_unit }),
    ...(record.start_date && { start_date: record.start_date }),
    ...(record.end_date && { end_date: record.end_date }),
    ...(record.prescription_number && { prescription_number: record.prescription_number }),
    ...(record.examination_type && { examination_type: record.examination_type }),
    ...(record.findings && { findings: record.findings }),
    ...(record.recommendations && { recommendations: record.recommendations }),
    ...(record.vet_clinic && { vet_clinic: record.vet_clinic }),
    ...(record.procedure_name && { procedure_name: record.procedure_name }),
    ...(record.surgeon && { surgeon: record.surgeon }),
    ...(record.anesthesia_used && { anesthesia_used: record.anesthesia_used }),
    ...(record.recovery_notes && { recovery_notes: record.recovery_notes }),
    ...(record.follow_up_date && { follow_up_date: record.follow_up_date })
  };
};

interface DogHealthRecordsProps {
  dogId: string;
}

const DogHealthRecords: React.FC<DogHealthRecordsProps> = ({ dogId }) => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const { vaccinations, latestVaccinations, isLoading: isLoadingVaccinations } = useDogHealthVaccinations(dogId);
  
  const { 
    data: healthRecords, 
    isLoading,
    refresh 
  } = useRefreshData<HealthRecord[]>({
    key: `dog-health-records-${dogId}`,
    fetchData: async () => {
      if (!dogId) return [];
      
      try {
        const { data, error } = await supabase
          .from('health_records')
          .select('*')
          .eq('dog_id', dogId)
          .order('visit_date', { ascending: false });
        
        if (error) throw error;
        
        // Map and adapt the records to the HealthRecord type
        return (data || []).map(record => adaptHealthRecord(record));
      } catch (error) {
        console.error('Error fetching health records:', error);
        return [];
      }
    },
    dependencies: [dogId]
  });
  
  const handleAddRecord = () => {
    setSelectedRecord(null);
    setDialogOpen(true);
  };
  
  const handleEditRecord = (record: HealthRecord) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleSaveRecord = async () => {
    setDialogOpen(false);
    await refresh(true);
    toast({
      title: selectedRecord ? "Record updated" : "Record added",
      description: "The health record has been successfully saved."
    });
  };
  
  const getRecordsByType = (type: HealthRecordType): HealthRecord[] => {
    return healthRecords?.filter(record => record.record_type === type) || [];
  };

  if (isLoading && isLoadingVaccinations) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Health Records</h2>
        <Button onClick={handleAddRecord}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Health Record
        </Button>
      </div>
      
      <Tabs defaultValue="vaccinations">
        <TabsList>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="examinations">Examinations</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="all-records">All Records</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vaccinations" className="space-y-4 pt-4">
          <VaccinationsTabContent 
            vaccinations={vaccinations}
            latestVaccinations={latestVaccinations}
            isLoading={isLoadingVaccinations}
            onAddRecord={handleAddRecord}
            onEditRecord={handleEditRecord}
          />
        </TabsContent>
        
        <TabsContent value="examinations" className="space-y-4 pt-4">
          <ExaminationsTabContent 
            records={getRecordsByType(HealthRecordType.Examination)}
            onAddRecord={handleAddRecord}
            onEditRecord={handleEditRecord}
          />
        </TabsContent>
        
        <TabsContent value="medications" className="space-y-4 pt-4">
          <MedicationsTabContent 
            records={getRecordsByType(HealthRecordType.Medication)}
            onAddRecord={handleAddRecord}
            onEditRecord={handleEditRecord}
          />
        </TabsContent>
        
        <TabsContent value="all-records" className="space-y-4 pt-4">
          <AllRecordsTabContent 
            records={healthRecords}
            onAddRecord={handleAddRecord}
            onEditRecord={handleEditRecord}
          />
        </TabsContent>
      </Tabs>
      
      <HealthRecordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        dogId={dogId}
        record={selectedRecord}
        onSave={handleSaveRecord}
      />
    </div>
  );
};

export default DogHealthRecords;
