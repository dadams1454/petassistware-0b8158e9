
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KennelCleaningSchedule, KennelUnit, CleaningFrequency } from '@/types/kennel';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface KennelCleaningScheduleFormProps {
  onSubmit: (data: Omit<KennelCleaningSchedule, 'id' | 'created_at'>) => Promise<void>;
  kennelUnits: KennelUnit[];
  defaultValues?: KennelCleaningSchedule;
  isEditing?: boolean;
}

const frequencies: CleaningFrequency[] = [
  'daily',
  'weekly',
  'biweekly',
  'monthly'
];

const daysOfWeek = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 }
];

const KennelCleaningScheduleForm: React.FC<KennelCleaningScheduleFormProps> = ({ 
  onSubmit, 
  kennelUnits,
  defaultValues,
  isEditing 
}) => {
  const [selectedDays, setSelectedDays] = React.useState<number[]>(
    defaultValues?.day_of_week || []
  );
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<Omit<KennelCleaningSchedule, 'id' | 'created_at'>>({
    defaultValues: defaultValues ? {
      kennel_unit_id: defaultValues.kennel_unit_id,
      frequency: defaultValues.frequency,
      day_of_week: defaultValues.day_of_week,
      time_of_day: defaultValues.time_of_day || '',
      assigned_to: defaultValues.assigned_to || ''
    } : {
      kennel_unit_id: '',
      frequency: 'daily',
      day_of_week: [],
      time_of_day: '',
      assigned_to: ''
    }
  });

  const frequency = watch('frequency');
  const showDays = frequency === 'weekly' || frequency === 'biweekly';

  // Handle day selection
  const toggleDay = (day: number) => {
    setSelectedDays(prev => {
      const isSelected = prev.includes(day);
      const newSelection = isSelected
        ? prev.filter(d => d !== day)
        : [...prev, day];
      
      setValue('day_of_week', newSelection);
      return newSelection;
    });
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
        <Label htmlFor="frequency">Frequency <span className="text-red-500">*</span></Label>
        <Select
          defaultValue={defaultValues?.frequency || 'daily'}
          onValueChange={value => setValue('frequency', value as CleaningFrequency)}
        >
          <SelectTrigger id="frequency">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            {frequencies.map(freq => (
              <SelectItem key={freq} value={freq}>
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showDays && (
        <div className="space-y-2">
          <Label>Days <span className="text-red-500">*</span></Label>
          <div className="grid grid-cols-2 gap-2">
            {daysOfWeek.map(day => (
              <div key={day.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${day.value}`}
                  checked={selectedDays.includes(day.value)}
                  onCheckedChange={() => toggleDay(day.value)}
                />
                <Label htmlFor={`day-${day.value}`} className="font-normal">
                  {day.label}
                </Label>
              </div>
            ))}
          </div>
          {selectedDays.length === 0 && showDays && (
            <p className="text-red-500 text-sm">Please select at least one day</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="time_of_day">Time of Day</Label>
        <Input
          id="time_of_day"
          type="time"
          {...register('time_of_day')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assigned_to">Assigned To</Label>
        <Input
          id="assigned_to"
          {...register('assigned_to')}
          placeholder="Name of person assigned to cleaning"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="submit" 
          disabled={isSubmitting || (showDays && selectedDays.length === 0)}
        >
          {isSubmitting 
            ? 'Saving...' 
            : isEditing 
              ? 'Update Schedule' 
              : 'Add Schedule'
          }
        </Button>
      </div>
    </form>
  );
};

export default KennelCleaningScheduleForm;
