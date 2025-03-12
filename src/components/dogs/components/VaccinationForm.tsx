
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { X, HelpCircle } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import SelectInput from '../form/SelectInput';
import DatePicker from '../form/DatePicker';
import TextareaInput from '../form/TextareaInput';
import { Vaccination } from '../types/vaccination';
import { vaccinationFormSchema } from '../schemas/vaccinationFormSchema';
import { vaccinationInfo } from '../utils/vaccinationUtils';

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
      vaccination_dateStr: new Date().toLocaleDateString('en-US'),
      notes: '',
    },
    resolver: zodResolver(vaccinationFormSchema),
  });

  const handleSubmit = (data: Vaccination) => {
    onSubmit({
      ...data,
      dog_id: dogId,
    });
  };

  // Create vaccination options with tooltips
  const vaccinationOptions = Object.entries(vaccinationInfo).map(([key, info]) => ({
    value: key,
    label: info.name,
    description: (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center ml-1">
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-3">
            <div className="space-y-2">
              <p className="font-medium">{info.name}</p>
              <p className="text-xs">{info.description}</p>
              <p className="text-xs font-medium mt-1">Recommended schedule:</p>
              <p className="text-xs">{info.schedule}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }));

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
            options={vaccinationOptions}
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
            disabled={isSubmitting || !form.formState.isValid}
          >
            {isSubmitting ? 'Saving...' : 'Save Vaccination'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VaccinationForm;
