
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
import { Loader2 } from "lucide-react";
import PuppyStatusBadge from "@/components/litters/puppies/PuppyStatusBadge";

type Puppy = Tables<'puppies'>;

const InterestedPuppyField = () => {
  const form = useFormContext();
  const [puppies, setPuppies] = useState<Puppy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchPuppies = async () => {
      setIsLoading(true);
      try {
        // Only fetch puppies with 'Available' status now
        const { data, error } = await supabase
          .from('puppies')
          .select('*')
          .eq('status', 'Available')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // If we have a currently selected puppy that's not in the fetched list,
        // we need to fetch it separately to include it in the options
        const currentPuppyId = form.getValues('interested_puppy_id');
        if (currentPuppyId && currentPuppyId !== 'none' && !data?.find(p => p.id === currentPuppyId)) {
          const { data: currentPuppy, error: puppyError } = await supabase
            .from('puppies')
            .select('*')
            .eq('id', currentPuppyId)
            .single();
          
          if (!puppyError && currentPuppy) {
            // Add the currently selected puppy to the options
            setPuppies([...data, currentPuppy]);
            return;
          }
        }
        
        setPuppies(data || []);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast({
          title: "Error fetching puppies",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPuppies();
  }, [form]);

  return (
    <FormField
      control={form.control}
      name="interested_puppy_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Interested Puppy</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value || "none"}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading puppies...</span>
                  </div>
                ) : (
                  <SelectValue placeholder="Select a puppy (if applicable)" />
                )}
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">No puppy selected</SelectItem>
              {puppies.length === 0 && !isLoading ? (
                <SelectItem value="none" disabled>No available puppies found</SelectItem>
              ) : (
                puppies.map((puppy) => (
                  <SelectItem key={puppy.id} value={puppy.id}>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 font-medium">
                        {puppy.name || `Puppy #${puppy.id.substring(0, 8)}`}
                        <PuppyStatusBadge status={puppy.status} />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {[
                          puppy.color && `Color: ${puppy.color}`,
                          puppy.gender && `Gender: ${puppy.gender}`,
                          puppy.birth_date && `Born: ${new Date(puppy.birth_date).toLocaleDateString()}`
                        ].filter(Boolean).join(' • ')}
                      </span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InterestedPuppyField;
