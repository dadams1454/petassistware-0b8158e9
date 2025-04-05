
import { useFormContext } from 'react-hook-form';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface TitleFieldProps {
  disabled?: boolean;
  form?: any; // Added for compatibility with different form implementations
}

const TitleField = ({ disabled = false, form: externalForm }: TitleFieldProps) => {
  const internalForm = useFormContext();
  const form = externalForm || internalForm;

  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter a title for this record"
              disabled={disabled}
              {...field}
              value={field.value || ''}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default TitleField;
