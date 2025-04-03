
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import HealthRecordsList from '@/components/dogs/components/profile/records/HealthRecordsList';
import HealthRecordForm from '@/components/dogs/components/profile/records/HealthRecordForm';
import { HealthRecordTypeEnum } from '@/types/health';

interface ExaminationsTabContentProps {
  dogId: string;
}

const ExaminationsTabContent: React.FC<ExaminationsTabContentProps> = ({ dogId }) => {
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();

  // Fetch examination records
  const { data: examinations, isLoading } = useQuery({
    queryKey: ['examinations', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('dog_id', dogId)
        .eq('record_type', HealthRecordTypeEnum.Examination)
        .order('visit_date', { ascending: false });
        
      if (error) throw error;
      return data;
    }
  });

  // Add examination record mutation
  const { mutateAsync: addExamination, isPending: isAddingExamination } = useMutation({
    mutationFn: async (examinationData: any) => {
      const { data, error } = await supabase
        .from('health_records')
        .insert([{
          ...examinationData,
          record_type: HealthRecordTypeEnum.Examination
        }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examinations', dogId] });
      toast({
        title: "Examination added",
        description: "The examination record has been saved successfully."
      });
      setIsAdding(false);
    },
    onError: (error) => {
      console.error("Error adding examination:", error);
      toast({
        title: "Error",
        description: "Failed to add examination record.",
        variant: "destructive"
      });
    }
  });

  // Delete examination record mutation
  const { mutateAsync: deleteExamination } = useMutation({
    mutationFn: async (recordId: string) => {
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', recordId);
        
      if (error) throw error;
      return recordId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examinations', dogId] });
      toast({
        title: "Examination deleted",
        description: "The examination record has been removed."
      });
    },
    onError: (error) => {
      console.error("Error deleting examination:", error);
      toast({
        title: "Error",
        description: "Failed to delete examination record.",
        variant: "destructive"
      });
    }
  });

  const handleAddExamination = async (data: any) => {
    await addExamination({
      ...data,
      dog_id: dogId
    });
  };

  const handleDeleteExamination = async (recordId: string) => {
    if (window.confirm("Are you sure you want to delete this examination record?")) {
      await deleteExamination(recordId);
    }
  };

  return (
    <div className="space-y-4">
      {!isAdding && (
        <div className="flex justify-end">
          <Button onClick={() => setIsAdding(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Examination
          </Button>
        </div>
      )}

      {isAdding && (
        <HealthRecordForm
          dogId={dogId}
          recordType={HealthRecordTypeEnum.Examination}
          onSubmit={handleAddExamination}
          onCancel={() => setIsAdding(false)}
          isSubmitting={isAddingExamination}
        />
      )}

      <HealthRecordsList
        records={examinations || []}
        isLoading={isLoading}
        onDelete={handleDeleteExamination}
        emptyMessage="No examination records found. Click 'Add Examination' to create one."
      />
    </div>
  );
};

export default ExaminationsTabContent;
