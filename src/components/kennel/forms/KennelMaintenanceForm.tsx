
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KennelMaintenance, KennelUnit, MaintenanceType } from '@/types/kennel';
import { cn } from '@/lib/utils';

interface KennelMaintenanceFormProps {
  onSubmit: (data: Omit<KennelMaintenance, 'id' | 'created_at'>) => Promise<void>;
  kennelUnits: KennelUnit[];
  defaultValues?: KennelMaintenance;
}

const maintenanceTypes: MaintenanceType[] = [
  'repair',
  'inspection',
  'upgrade'
];

const maintenanceStatuses: KennelMaintenance['status'][] = [
  'scheduled',
  'in-progress',
  'completed',
  'deferred'
];

const KennelMaintenanceForm: React.FC<KennelMaintenanceFormProps> = ({ 
  onSubmit, 
  kennelUnits,
  defaultValues 
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<Omit<KennelMaintenance, 'id' | 'created_at'>>({
    defaultValues: defaultValues ? {
      kennel_unit_id: defaultValues.kennel_unit_id,
      maintenance_type: defaultValues.maintenance_type,
      description: defaultValues.description,
      performed_by: defaultValues.performed_by,
      maintenance_date: defaultValues.maintenance_date,
      status: defaultValues.status,
      cost: defaultValues.cost,
      notes: defaultValues.notes || ''
    } : {
      kennel_unit_id: '',
      maintenance_type: 'repair',
      description: '',
      performed_by: '',
      maintenance_date: new Date().toISOString(),
      status: 'scheduled',
      cost: null,
      notes: ''
    }
  });

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
        <Label htmlFor="maintenance_type">Maintenance Type <span className="text-red-500">*</span></Label>
        <Select
          defaultValue={defaultValues?.maintenance_type || 'repair'}
          onValueChange={value => setValue('maintenance_type', value as MaintenanceType)}
        >
          <SelectTrigger id="maintenance_type">
            <SelectValue placeholder="Select maintenance type" />
          </SelectTrigger>
          <SelectContent>
            {maintenanceTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
        <Textarea
          id="description"
          {...register('description', { required: 'Description is required' })}
          placeholder="Describe the maintenance needed"
          rows={2}
          className={cn(errors.description && 'border-red-500')}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="performed_by">Performed By <span className="text-red-500">*</span></Label>
        <Input
          id="performed_by"
          {...register('performed_by', { required: 'Name is required' })}
          placeholder="Name of person performing maintenance"
          className={cn(errors.performed_by && 'border-red-500')}
        />
        {errors.performed_by && (
          <p className="text-red-500 text-sm">{errors.performed_by.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
        <Select
          defaultValue={defaultValues?.status || 'scheduled'}
          onValueChange={value => setValue('status', value as KennelMaintenance['status'])}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {maintenanceStatuses.map(status => (
              <SelectItem key={status} value={status}>
                {status.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cost">Cost ($)</Label>
        <Input
          id="cost"
          type="number"
          step="0.01"
          min="0"
          {...register('cost', { 
            valueAsNumber: true,
            setValueAs: v => v === '' ? null : parseFloat(v)
          })}
          placeholder="Cost of maintenance (optional)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Additional notes about the maintenance"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Add Maintenance Record'}
        </Button>
      </div>
    </form>
  );
};

export default KennelMaintenanceForm;
