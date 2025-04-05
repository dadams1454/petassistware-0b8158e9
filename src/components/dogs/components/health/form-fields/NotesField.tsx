
import { useFormContext } from 'react-hook-form';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface NotesFieldProps {
  disabled?: boolean;
  label?: string;
  name?: string;
}

const NotesField = ({ 
  disabled = false, 
  label = "Notes",
  name = "record_notes"
}: NotesFieldProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Enter notes"
              disabled={disabled}
              {...field}
              value={field.value || ''}
              rows={4}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default NotesField;
