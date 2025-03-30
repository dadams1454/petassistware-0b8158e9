
import React from 'react';
import { useLitterForm } from './hooks/useLitterForm';
import { useDamInfoUpdater } from './hooks/useDamInfoUpdater';
import { usePuppyCounter } from './hooks/usePuppyCounter';
import LitterFormLayout from './form/LitterFormLayout';
import { Litter } from './puppies/types';

interface LitterFormProps {
  initialData?: Litter;
  onSuccess: () => void;
  onCancel?: () => void;
}

const LitterForm: React.FC<LitterFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const {
    form,
    isSubmitting,
    damDetails,
    previousDamId,
    setPreviousDamId,
    isInitialLoad,
    setIsInitialLoad,
    maleCount,
    femaleCount,
    currentDamId,
    handleSubmit
  } = useLitterForm({ 
    initialData: initialData as any, // Use type assertion to bypass the type check
    onSuccess 
  });

  // Use hooks for side effects
  useDamInfoUpdater({
    form,
    damDetails,
    isInitialLoad,
    setIsInitialLoad,
    initialData: initialData as any, // Use type assertion here too
    currentDamId,
    previousDamId,
    setPreviousDamId
  });

  usePuppyCounter({
    form,
    maleCount,
    femaleCount
  });

  return (
    <LitterFormLayout
      form={form}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isEditMode={!!initialData}
    />
  );
};

export default LitterForm;
