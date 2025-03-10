
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { toast } from '@/components/ui/use-toast';

type Puppy = Tables<'puppies'>;

const InterestedPuppyField = () => {
  const form = useFormContext();
  const [puppies, setPuppies] = useState<Puppy[]>([]);
  
  useEffect(() => {
    const fetchPuppies = async () => {
      const { data, error } = await supabase
        .from('puppies')
        .select('*')
        .is('status', null)
        .order('name');
      
      if (!error && data) {
        setPuppies(data);
      } else if (error) {
        toast({
          title: "Error fetching puppies",
          description: error.message,
          variant: "destructive",
        });
      }
    };
    
    fetchPuppies();
  }, []);

  return (
    <FormField
      control={form.control}
      name="interested_puppy_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Interested Puppy</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value || ''}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a puppy (if applicable)" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="">No puppy selected</SelectItem>
              {puppies.map((puppy) => (
                <SelectItem key={puppy.id} value={puppy.id}>
                  {puppy.name || `Puppy ID: ${puppy.id.substring(0, 8)}`} 
                  {puppy.color ? ` (${puppy.color})` : ''}
                  {puppy.gender ? ` - ${puppy.gender}` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InterestedPuppyField;
