
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KennelAssignment, KennelUnit } from '@/types/kennel';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface KennelAssignmentFormProps {
  onSubmit: (data: Omit<KennelAssignment, 'id' | 'created_at'>) => Promise<void>;
  availableDogs: any[]; // Using any since we don't have a Dog interface defined
  availableKennelUnits: KennelUnit[];
  loadingDogs: boolean;
  defaultValues?: KennelAssignment;
}

const KennelAssignmentForm: React.FC<KennelAssignmentFormProps> = ({ 
  onSubmit, 
  availableDogs,
  availableKennelUnits,
  loadingDogs,
  defaultValues 
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<Omit<KennelAssignment, 'id' | 'created_at'>>({
    defaultValues: defaultValues ? {
      dog_id: defaultValues.dog_id,
      kennel_unit_id: defaultValues.kennel_unit_id,
      start_date: defaultValues.start_date,
      end_date: defaultValues.end_date,
      notes: defaultValues.notes || ''
    } : {
      dog_id: '',
      kennel_unit_id: '',
      start_date: new Date().toISOString(),
      end_date: null,
      notes: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="dog_id">Dog <span className="text-red-500">*</span></Label>
        {loadingDogs ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            defaultValue={defaultValues?.dog_id || ''}
            onValueChange={value => setValue('dog_id', value)}
          >
            <SelectTrigger id="dog_id" className={cn(errors.dog_id && 'border-red-500')}>
              <SelectValue placeholder="Select dog" />
            </SelectTrigger>
            <SelectContent>
              {availableDogs.length === 0 ? (
                <SelectItem value="" disabled>
                  No available dogs
                </SelectItem>
              ) : (
                availableDogs.map(dog => (
                  <SelectItem key={dog.id} value={dog.id}>
                    {dog.name} ({dog.breed}, {dog.gender})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}
        {errors.dog_id && (
          <p className="text-red-500 text-sm">{errors.dog_id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="kennel_unit_id">Kennel Unit <span className="text-red-500">*</span></Label>
        <Select
          defaultValue={defaultValues?.kennel_unit_id || ''}
          onValueChange={value => setValue('kennel_unit_id', value)}
        >
          <SelectTrigger id="kennel_unit_id" className={cn(errors.kennel_unit_id && 'border-red-500')}>
            <SelectValue placeholder="Select kennel unit" />
          </SelectTrigger>
          <SelectContent>
            {availableKennelUnits.length === 0 ? (
              <SelectItem value="" disabled>
                No available kennel units
              </SelectItem>
            ) : (
              availableKennelUnits.map(unit => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.name} ({unit.unit_type}{unit.location ? `, ${unit.location}` : ''})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.kennel_unit_id && (
          <p className="text-red-500 text-sm">{errors.kennel_unit_id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Special instructions or notes about this assignment"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isSubmitting || availableDogs.length === 0 || availableKennelUnits.length === 0}>
          {isSubmitting ? 'Saving...' : 'Assign to Kennel'}
        </Button>
      </div>
    </form>
  );
};

export default KennelAssignmentForm;
