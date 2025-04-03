
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import HealthRecordsList from '@/components/dogs/components/profile/records/HealthRecordsList';
import HealthRecordForm from '@/components/dogs/components/profile/records/HealthRecordForm';
import { HealthRecordTypeEnum } from '@/types/health';

interface VaccinationsTabContentProps {
  dogId: string;
}

const VaccinationsTabContent: React.FC<VaccinationsTabContentProps> = ({ dogId }) => {
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();

  // Fetch vaccination records
  const { data: vaccinations, isLoading } = useQuery({
    queryKey: ['vaccinations', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('dog_id', dogId)
        .eq('record_type', HealthRecordTypeEnum.Vaccination)
        .order('visit_date', { ascending: false });
        
      if (error) throw error;
      return data;
    }
  });

  // Add vaccination record mutation
  const { mutateAsync: addVaccination, isPending: isAddingVaccination } = useMutation({
    mutationFn: async (vaccinationData: any) => {
      const { data, error } = await supabase
        .from('health_records')
        .insert([{
          ...vaccinationData,
          record_type: HealthRecordTypeEnum.Vaccination
        }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccinations', dogId] });
      toast({
        title: "Vaccination added",
        description: "The vaccination record has been saved successfully."
      });
      setIsAdding(false);
    },
    onError: (error) => {
      console.error("Error adding vaccination:", error);
      toast({
        title: "Error",
        description: "Failed to add vaccination record.",
        variant: "destructive"
      });
    }
  });

  // Delete vaccination record mutation
  const { mutateAsync: deleteVaccination } = useMutation({
    mutationFn: async (recordId: string) => {
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', recordId);
        
      if (error) throw error;
      return recordId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccinations', dogId] });
      toast({
        title: "Vaccination deleted",
        description: "The vaccination record has been removed."
      });
    },
    onError: (error) => {
      console.error("Error deleting vaccination:", error);
      toast({
        title: "Error",
        description: "Failed to delete vaccination record.",
        variant: "destructive"
      });
    }
  });

  const handleAddVaccination = async (data: any) => {
    await addVaccination({
      ...data,
      dog_id: dogId
    });
  };

  const handleDeleteVaccination = async (recordId: string) => {
    if (window.confirm("Are you sure you want to delete this vaccination record?")) {
      await deleteVaccination(recordId);
    }
  };

  return (
    <div className="space-y-4">
      {!isAdding && (
        <div className="flex justify-end">
          <Button onClick={() => setIsAdding(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Vaccination
          </Button>
        </div>
      )}

      {isAdding && (
        <HealthRecordForm
          dogId={dogId}
          recordType={HealthRecordTypeEnum.Vaccination}
          onSubmit={handleAddVaccination}
          onCancel={() => setIsAdding(false)}
          isSubmitting={isAddingVaccination}
        />
      )}

      <HealthRecordsList
        records={vaccinations || []}
        isLoading={isLoading}
        onDelete={handleDeleteVaccination}
        emptyMessage="No vaccination records found. Click 'Add Vaccination' to create one."
      />
    </div>
  );
};

export default VaccinationsTabContent;
