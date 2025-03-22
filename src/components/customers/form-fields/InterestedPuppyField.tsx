
import React, { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
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
  
  // Watch the selected litter to filter puppies
  const selectedLitterId = useWatch({
    control: form.control,
    name: "interested_litter_id",
    defaultValue: "none",
  });
  
  const waitlistType = useWatch({
    control: form.control,
    name: "waitlist_type",
    defaultValue: "specific",
  });
  
  useEffect(() => {
    const fetchPuppies = async () => {
      if (waitlistType === "open") {
        setPuppies([]);
        return;
      }
      
      setIsLoading(true);
      try {
        console.log("Fetching puppies for interest selection");
        
        // Base query for puppies
        let query = supabase
          .from('puppies')
          .select('*, litters(*)')
          .in('status', ['Available', 'Reserved']);
        
        // Filter by litter if one is selected
        if (selectedLitterId && selectedLitterId !== 'none') {
          query = query.eq('litter_id', selectedLitterId);
        }
        
        // Add ordering
        query = query.order('created_at', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // If we have a currently selected puppy that's not in the fetched list,
        // we need to fetch it separately to include it in the options
        const currentPuppyId = form.getValues('interested_puppy_id');
        console.log("Current selected puppy ID:", currentPuppyId);
        
        if (currentPuppyId && currentPuppyId !== 'none' && !data?.find(p => p.id === currentPuppyId)) {
          console.log("Current puppy not in list, fetching separately");
          const { data: currentPuppy, error: puppyError } = await supabase
            .from('puppies')
            .select('*, litters(*)')
            .eq('id', currentPuppyId)
            .single();
          
          if (!puppyError && currentPuppy) {
            console.log("Found current puppy:", currentPuppy);
            // Add the currently selected puppy to the options
            setPuppies([...data, currentPuppy]);
            setIsLoading(false);
            return;
          }
        }
        
        console.log("Fetched puppies:", data?.length || 0);
        setPuppies(data || []);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast({
          title: "Error fetching puppies",
          description: errorMessage,
          variant: "destructive",
        });
        console.error("Error fetching puppies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPuppies();
  }, [form, selectedLitterId, waitlistType]);

  // Don't show puppy selection for open waitlist
  if (waitlistType === "open") {
    return null;
  }

  return (
    <FormField
      control={form.control}
      name="interested_puppy_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Interested Puppy</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || "none"}
            disabled={isLoading || selectedLitterId === "none"}
          >
            <FormControl>
              <SelectTrigger>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading puppies...</span>
                  </div>
                ) : (
                  <SelectValue placeholder={selectedLitterId === "none" ? "Select a litter first" : "Select a puppy (if applicable)"} />
                )}
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">No puppy selected</SelectItem>
              {puppies.length === 0 && !isLoading ? (
                <SelectItem value="no-puppies" disabled>
                  {selectedLitterId === "none" 
                    ? "Select a litter first" 
                    : "No available puppies found"}
                </SelectItem>
              ) : (
                puppies.map((puppy) => (
                  <SelectItem 
                    key={puppy.id} 
                    value={puppy.id} 
                    disabled={puppy.status === 'Reserved' && puppy.id !== field.value}
                  >
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
