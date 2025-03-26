
import { useState } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import { CareLogFormValues } from './useCareLogFormState';
import { DogFlag } from '@/types/dailyCare';

interface UseFormSubmissionProps {
  dogId: string;
  onSuccess?: () => void;
}

export const useFormSubmission = ({ dogId, onSuccess }: UseFormSubmissionProps) => {
  const { addCareLog, loading } = useDailyCare();
  const [submissionLoading, setSubmissionLoading] = useState(false);

  const submitCareLog = async (values: CareLogFormValues, flags: DogFlag[]) => {
    setSubmissionLoading(true);
    try {
      // Create a properly typed CareLogFormData object
      const careLogData = {
        dog_id: dogId,
        category: values.category,
        task_name: values.task_name,
        timestamp: values.timestamp,
        notes: values.notes,
        flags: flags.length > 0 ? flags : undefined
      };
      
      console.log('Submitting care log:', careLogData);
      const result = await addCareLog(careLogData);
      
      if (result && onSuccess) {
        onSuccess();
      }
      
      return !!result;
    } catch (error) {
      console.error('Error in submitCareLog:', error);
      return false;
    } finally {
      setSubmissionLoading(true);
    }
  };

  return {
    loading: loading || submissionLoading,
    submitCareLog
  };
};
