
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
import { HealthRecordType, HealthRecordTypeEnum } from '@/types/health-enums';

interface RecordTypeFieldProps {
  disabled?: boolean;
}

const RecordTypeField = ({ disabled = false }: RecordTypeFieldProps) => {
  const form = useFormContext();

  const recordTypes = [
    { label: 'Examination', value: HealthRecordTypeEnum.EXAMINATION },
    { label: 'Vaccination', value: HealthRecordTypeEnum.VACCINATION },
    { label: 'Medication', value: HealthRecordTypeEnum.MEDICATION },
    { label: 'Surgery', value: HealthRecordTypeEnum.SURGERY },
    { label: 'Laboratory', value: HealthRecordTypeEnum.LABORATORY },
    { label: 'Preventative', value: HealthRecordTypeEnum.PREVENTIVE },
    { label: 'Test', value: HealthRecordTypeEnum.TEST },
    { label: 'Imaging', value: HealthRecordTypeEnum.IMAGING },
    { label: 'Deworming', value: HealthRecordTypeEnum.DEWORMING },
    { label: 'Other', value: HealthRecordTypeEnum.OTHER }
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
