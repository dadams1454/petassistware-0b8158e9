
import React from 'react';
import { useLitterForm } from './hooks/useLitterForm';
import { useDamInfoUpdater } from './hooks/useDamInfoUpdater';
import { usePuppyCounter } from './hooks/usePuppyCounter';
import LitterFormLayout from './form/LitterFormLayout';

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
  } = useLitterForm({ initialData, onSuccess });

  // Use hooks for side effects
  useDamInfoUpdater({
    form,
    damDetails,
    isInitialLoad,
    setIsInitialLoad,
    initialData,
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
