
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord } from '@/types/dog';
import { useRefreshData } from '@/hooks/useRefreshData';
import { useToast } from '@/hooks/use-toast';
import { useDogHealthVaccinations } from '../../hooks/useDogHealthVaccinations';
import HealthRecordDialog from './records/HealthRecordDialog';
import VaccinationsTabContent from './records/VaccinationsTabContent';
import ExaminationsTabContent from './records/ExaminationsTabContent';
import MedicationsTabContent from './records/MedicationsTabContent';
import AllRecordsTabContent from './records/AllRecordsTabContent';

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
        
        // Map to the HealthRecord type
        return (data || []).map(record => ({
          id: record.id,
          dog_id: record.dog_id,
          date: record.visit_date,
          record_type: determineRecordType(record),
          title: `${record.vet_name} Visit`,
          description: record.record_notes || '',
          performed_by: record.vet_name,
          created_at: record.created_at
        }));
      } catch (error) {
        console.error('Error fetching health records:', error);
        return [];
      }
    },
    dependencies: [dogId]
  });
  
  // Helper function to determine record type
  const determineRecordType = (record: any): HealthRecord['record_type'] => {
    // This is a placeholder logic - in a real app you'd have a field to determine this
    if (record.record_notes?.toLowerCase().includes('vaccination')) {
      return 'vaccination';
    } else if (record.record_notes?.toLowerCase().includes('medication')) {
      return 'medication';
    } else if (record.record_notes?.toLowerCase().includes('surgery')) {
      return 'surgery';
    } else {
      return 'examination';
    }
  };
  
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
  
  const getRecordsByType = (type: HealthRecord['record_type']) => {
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
            records={getRecordsByType('examination')}
            onAddRecord={handleAddRecord}
            onEditRecord={handleEditRecord}
          />
        </TabsContent>
        
        <TabsContent value="medications" className="space-y-4 pt-4">
          <MedicationsTabContent 
            records={getRecordsByType('medication')}
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
