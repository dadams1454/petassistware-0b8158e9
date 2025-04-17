
import { useState } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import { CareLogFormValues } from './useCareLogFormState';
import { DogFlag, CareLogFormData } from '@/types/dailyCare';

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
      // Format timestamp to string if it's a Date object
      const timestamp = values.timestamp instanceof Date 
        ? values.timestamp.toISOString() 
        : values.timestamp;
      
      // Create a properly typed CareLogFormData object
      const careLogData: CareLogFormData = {
        dog_id: dogId,
        category: values.category,
        task_name: values.task_name,
        task: values.task_name, // Added to match the CareLogFormData interface requirement
        timestamp: timestamp,
        notes: values.notes,
        flags: flags.length > 0 ? flags.map(f => f.id) : undefined, // Send flag IDs for compatibility
        metadata: flags.length > 0 ? { flags } : undefined // Store full flag objects for rich data
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
      setSubmissionLoading(false);
    }
  };

  return {
    loading: loading || submissionLoading,
    submitCareLog
  };
};
