
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KennelCleaning, KennelUnit, CleaningType } from '@/types/kennel';
import { cn } from '@/lib/utils';

interface KennelCleaningFormProps {
  onSubmit: (data: Omit<KennelCleaning, 'id' | 'created_at'>) => Promise<void>;
  kennelUnits: KennelUnit[];
  defaultValues?: KennelCleaning;
}

const cleaningTypes: CleaningType[] = [
  'daily',
  'deep',
  'sanitize'
];

const KennelCleaningForm: React.FC<KennelCleaningFormProps> = ({ 
  onSubmit, 
  kennelUnits,
  defaultValues 
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<Omit<KennelCleaning, 'id' | 'created_at'>>({
    defaultValues: defaultValues ? {
      kennel_unit_id: defaultValues.kennel_unit_id,
      cleaned_by: defaultValues.cleaned_by,
      cleaning_date: defaultValues.cleaning_date,
      cleaning_type: defaultValues.cleaning_type,
      products_used: defaultValues.products_used || [],
      notes: defaultValues.notes || ''
    } : {
      kennel_unit_id: '',
      cleaned_by: '',
      cleaning_date: new Date().toISOString(),
      cleaning_type: 'daily',
      products_used: [],
      notes: ''
    }
  });

  const productsString = watch('products_used')?.join(', ') || '';

  const handleProductsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const productsArray = e.target.value
      .split(',')
      .map(product => product.trim())
      .filter(product => product !== '');
    
    setValue('products_used', productsArray);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {kennelUnits.map(unit => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.name} ({unit.unit_type}{unit.location ? `, ${unit.location}` : ''})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.kennel_unit_id && (
          <p className="text-red-500 text-sm">{errors.kennel_unit_id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cleaned_by">Cleaned By <span className="text-red-500">*</span></Label>
        <Input
          id="cleaned_by"
          {...register('cleaned_by', { required: 'Cleaner name is required' })}
          placeholder="Name of person who cleaned"
          className={cn(errors.cleaned_by && 'border-red-500')}
        />
        {errors.cleaned_by && (
          <p className="text-red-500 text-sm">{errors.cleaned_by.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cleaning_type">Cleaning Type <span className="text-red-500">*</span></Label>
        <Select
          defaultValue={defaultValues?.cleaning_type || 'daily'}
          onValueChange={value => setValue('cleaning_type', value as CleaningType)}
        >
          <SelectTrigger id="cleaning_type">
            <SelectValue placeholder="Select cleaning type" />
          </SelectTrigger>
          <SelectContent>
            {cleaningTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="products_used">Products Used (comma-separated)</Label>
        <Input
          id="products_used"
          value={productsString}
          onChange={handleProductsChange}
          placeholder="Disinfectant, cleaner, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Additional notes about the cleaning"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Add Cleaning Record'}
        </Button>
      </div>
    </form>
  );
};

export default KennelCleaningForm;
