
import React from 'react';
import { Form } from '@/components/ui/form';
import { useWeightEntryForm } from '../hooks/useWeightEntryForm';
import WeightDatePicker from './WeightDatePicker';
import WeightValueInput from './WeightValueInput';
import WeightUnitSelect from './WeightUnitSelect';
import DialogFooterButtons from '@/components/dogs/components/profile/records/form-fields/DialogFooterButtons';

interface WeightEntryFormProps {
  dogId: string;
  onSave: (data: any) => Promise<any>;
  onCancel: () => void;
  initialData?: any;
}

const WeightEntryForm: React.FC<WeightEntryFormProps> = ({
  dogId,
  onSave,
  onCancel,
  initialData
}) => {
  const { form, handleSubmit, isSubmitting } = useWeightEntryForm({
    dogId,
    onSave,
    initialData
  });

  // Function to normalize weight data before submission
  const handleFormSubmit = form.handleSubmit(async (values) => {
    // Ensure both weight_unit and unit are set to the same value
    const normalizedValues = {
      ...values,
      unit: values.unit,
      weight_unit: values.unit
    };
    
    return handleSubmit(normalizedValues);
  });
  
  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <WeightDatePicker form={form} />
        <div className="flex gap-4">
          <WeightValueInput form={form} />
          <WeightUnitSelect form={form} />
        </div>
        
        <DialogFooterButtons
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          submitLabel="Save Weight"
        />
      </form>
    </Form>
  );
};

export default WeightEntryForm;
