
import { useState } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import { CareLogFormValues } from './useCareLogFormState';

interface UseFormSubmissionProps {
  dogId: string;
  onSuccess?: () => void;
}

export const useFormSubmission = ({ dogId, onSuccess }: UseFormSubmissionProps) => {
  const { addCareLog, loading } = useDailyCare();

  const submitCareLog = async (values: CareLogFormValues, flags: any[]) => {
    // Create a properly typed CareLogFormData object
    const careLogData = {
      dog_id: dogId,
      category: values.category,
      task_name: values.task_name,
      timestamp: values.timestamp,
      notes: values.notes,
      flags: flags.length > 0 ? flags : undefined
    };
    
    const success = await addCareLog(careLogData);
    
    return success;
  };

  return {
    loading,
    submitCareLog
  };
};
