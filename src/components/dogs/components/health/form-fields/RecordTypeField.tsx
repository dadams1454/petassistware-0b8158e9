
import { useFormContext } from 'react-hook-form';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { HealthRecordType } from '@/types/health';

interface RecordTypeFieldProps {
  disabled?: boolean;
}

const RecordTypeField = ({ disabled = false }: RecordTypeFieldProps) => {
  const form = useFormContext();

  const recordTypes = [
    { label: 'Examination', value: HealthRecordType.EXAMINATION },
    { label: 'Vaccination', value: HealthRecordType.VACCINATION },
    { label: 'Medication', value: HealthRecordType.MEDICATION },
    { label: 'Surgery', value: HealthRecordType.SURGERY },
    { label: 'Laboratory', value: HealthRecordType.LABORATORY },
    { label: 'Preventative', value: HealthRecordType.PREVENTIVE },
    { label: 'Test', value: HealthRecordType.TEST },
    { label: 'Imaging', value: HealthRecordType.IMAGING },
    { label: 'Deworming', value: HealthRecordType.DEWORMING },
    { label: 'Other', value: HealthRecordType.OTHER }
  ];

  return (
    <FormField
      control={form.control}
      name="record_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Record Type</FormLabel>
          <FormControl>
            <Select
              disabled={disabled}
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select record type" />
              </SelectTrigger>
              <SelectContent>
                {recordTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default RecordTypeField;
