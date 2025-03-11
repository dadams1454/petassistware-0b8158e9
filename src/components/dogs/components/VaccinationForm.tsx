
import React from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import SelectInput from '../form/SelectInput';
import DatePicker from '../form/DatePicker';
import TextareaInput from '../form/TextareaInput';
import { Vaccination } from '../types/vaccination';

interface VaccinationFormProps {
  dogId: string;
  onSubmit: (data: Vaccination) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const VaccinationForm: React.FC<VaccinationFormProps> = ({
  dogId,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const form = useForm<Vaccination>({
    defaultValues: {
      dog_id: dogId,
      vaccination_type: '',
      vaccination_date: new Date(),
      vaccination_dateStr: new Date().toLocaleDateString('en-US'), // Add this default value
      notes: '',
    }
  });

  const handleSubmit = (data: Vaccination) => {
    onSubmit({
      ...data,
      dog_id: dogId,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-4 border rounded-md bg-muted/20">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Add New Vaccination</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <SelectInput
            form={form}
            name="vaccination_type"
            label="Vaccination Type"
            options={[
              { value: 'rabies', label: 'Rabies' },
              { value: 'distemper', label: 'Distemper' },
              { value: 'parvovirus', label: 'Parvovirus' },
              { value: 'adenovirus', label: 'Adenovirus' },
              { value: 'leptospirosis', label: 'Leptospirosis' },
              { value: 'bordetella', label: 'Bordetella' },
              { value: 'lyme', label: 'Lyme Disease' },
              { value: 'combo', label: 'Combo (DHPP)' }
            ]}
            placeholder="Select vaccination type"
            required
          />
          
          <DatePicker
            form={form}
            name="vaccination_date"
            label="Vaccination Date"
          />
          
          <TextareaInput
            form={form}
            name="notes"
            label="Notes"
            placeholder="Enter any additional information about this vaccination"
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Vaccination'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VaccinationForm;
