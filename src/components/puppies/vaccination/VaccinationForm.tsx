
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { VaccinationScheduleItem } from '@/types/puppyTracking';

export interface VaccinationFormProps {
  onSubmit: (data: Partial<VaccinationScheduleItem>) => Promise<boolean>;
  onCancel: () => void;
  defaultValues?: Partial<VaccinationScheduleItem>;
  isEdit?: boolean;
  puppyId?: string;
}

const VaccinationForm: React.FC<VaccinationFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  isEdit = false,
  puppyId
}) => {
  const [dueDate, setDueDate] = React.useState<Date | undefined>(
    defaultValues?.due_date ? new Date(defaultValues.due_date) : undefined
  );
  
  const [vaccinationDate, setVaccinationDate] = React.useState<Date | undefined>(
    defaultValues?.vaccination_date ? new Date(defaultValues.vaccination_date) : undefined
  );
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      vaccination_type: defaultValues?.vaccination_type || '',
      notes: defaultValues?.notes || '',
    }
  });

  const onFormSubmit = async (data: any) => {
    try {
      const formData = {
        ...data,
        due_date: dueDate?.toISOString().split('T')[0],
        vaccination_date: vaccinationDate?.toISOString().split('T')[0],
        puppy_id: puppyId
      };
      
      const success = await onSubmit(formData);
      if (success) {
        onCancel();
      }
    } catch (error) {
      console.error('Error submitting vaccination form:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Vaccination' : 'Add Vaccination'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vaccination_type">Vaccination Type</Label>
            <Input
              id="vaccination_type"
              {...register('vaccination_type', { required: 'Vaccination type is required' })}
              placeholder="e.g., DHPP, Rabies, Bordetella"
            />
            {errors.vaccination_type && (
              <p className="text-sm text-red-500">{errors.vaccination_type.message as string}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Due Date</Label>
            <DatePicker
              date={dueDate}
              onSelect={setDueDate}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Vaccination Date</Label>
            <DatePicker
              date={vaccinationDate}
              onSelect={setVaccinationDate}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Leave blank if not administered yet
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional information about this vaccination"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add Vaccination'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default VaccinationForm;
