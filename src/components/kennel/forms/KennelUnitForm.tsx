
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KennelUnit, KennelUnitStatus } from '@/types/kennel';
import { cn } from '@/lib/utils';

interface KennelUnitFormProps {
  onSubmit: (data: Omit<KennelUnit, 'id' | 'created_at'>) => Promise<void>;
  defaultValues?: KennelUnit;
  isEditing?: boolean;
}

const unitTypes = [
  'run',
  'cage',
  'pen',
  'crate',
  'kennel',
  'outdoor',
  'indoor',
  'other'
];

const unitSizes = [
  'small',
  'medium',
  'large',
  'extra large'
];

const unitStatuses: KennelUnitStatus[] = [
  'available',
  'occupied',
  'maintenance',
  'cleaning'
];

const KennelUnitForm: React.FC<KennelUnitFormProps> = ({ 
  onSubmit, 
  defaultValues,
  isEditing 
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<Omit<KennelUnit, 'id' | 'created_at'>>({
    defaultValues: defaultValues ? {
      name: defaultValues.name,
      unit_type: defaultValues.unit_type,
      location: defaultValues.location || '',
      capacity: defaultValues.capacity,
      size: defaultValues.size || '',
      features: defaultValues.features || [],
      notes: defaultValues.notes || '',
      status: defaultValues.status
    } : {
      name: '',
      unit_type: 'run',
      location: '',
      capacity: 1,
      size: '',
      features: [],
      notes: '',
      status: 'available'
    }
  });

  const featuresString = watch('features')?.join(', ') || '';

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const featuresArray = e.target.value
      .split(',')
      .map(feature => feature.trim())
      .filter(feature => feature !== '');
    
    setValue('features', featuresArray);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          {...register('name', { required: 'Name is required' })}
          placeholder="Enter kennel unit name"
          className={cn(errors.name && 'border-red-500')}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit_type">Unit Type <span className="text-red-500">*</span></Label>
        <Select
          defaultValue={defaultValues?.unit_type || 'run'}
          onValueChange={value => setValue('unit_type', value)}
        >
          <SelectTrigger id="unit_type">
            <SelectValue placeholder="Select unit type" />
          </SelectTrigger>
          <SelectContent>
            {unitTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          {...register('location')}
          placeholder="Building A, Room 1, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="capacity">Capacity <span className="text-red-500">*</span></Label>
        <Input
          id="capacity"
          type="number"
          min={1}
          {...register('capacity', { 
            required: 'Capacity is required',
            min: { value: 1, message: 'Capacity must be at least 1' },
            valueAsNumber: true
          })}
          className={cn(errors.capacity && 'border-red-500')}
        />
        {errors.capacity && (
          <p className="text-red-500 text-sm">{errors.capacity.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="size">Size</Label>
        <Select
          defaultValue={defaultValues?.size || ''}
          onValueChange={value => setValue('size', value)}
        >
          <SelectTrigger id="size">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Not specified</SelectItem>
            {unitSizes.map(size => (
              <SelectItem key={size} value={size}>
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Features (comma-separated)</Label>
        <Input
          id="features"
          value={featuresString}
          onChange={handleFeaturesChange}
          placeholder="heated, covered, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
        <Select
          defaultValue={defaultValues?.status || 'available'}
          onValueChange={value => setValue('status', value as KennelUnitStatus)}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {unitStatuses.map(status => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Additional notes about this kennel unit"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting 
            ? 'Saving...' 
            : isEditing 
              ? 'Update Kennel Unit' 
              : 'Add Kennel Unit'
          }
        </Button>
      </div>
    </form>
  );
};

export default KennelUnitForm;
