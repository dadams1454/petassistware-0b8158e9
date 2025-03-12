
import React, { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

type Litter = Tables<'litters'> & {
  dam: Tables<'dogs'> | null;
  sire: Tables<'dogs'> | null;
};

const LitterSelectionFields = () => {
  const form = useFormContext();
  const [litters, setLitters] = useState<Litter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const waitlistType = useWatch({
    control: form.control,
    name: "waitlist_type",
    defaultValue: "specific",
  });
  
  // Reset litter selection when switching to open waitlist
  useEffect(() => {
    if (waitlistType === "open") {
      form.setValue("interested_litter_id", "none");
      form.setValue("interested_puppy_id", "none");
    }
  }, [waitlistType, form]);
  
  useEffect(() => {
    const fetchLitters = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('litters')
          .select(`
            *,
            dam:dogs!litters_dam_id_fkey(id, name, breed),
            sire:dogs!litters_sire_id_fkey(id, name, breed)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const activeLitters = data.filter(litter => litter.status === 'active' || !litter.status);
        setLitters(activeLitters as Litter[]);
      } catch (error) {
        console.error("Error fetching litters:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLitters();
  }, []);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="waitlist_type"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Waitlist Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="specific" id="specific" />
                  <Label htmlFor="specific">Specific Litter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="open" id="open" />
                  <Label htmlFor="open">Open Waitlist (Any Future Litter)</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormDescription>
              Select whether the customer is interested in a specific litter or wants to be on an open waitlist for any future litter.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {waitlistType === "specific" && (
        <FormField
          control={form.control}
          name="interested_litter_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interested Litter</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reset puppy selection when litter changes
                  form.setValue("interested_puppy_id", "none");
                }}
                value={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading litters...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Select a litter (if applicable)" />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No litter selected</SelectItem>
                  {litters.length === 0 && !isLoading ? (
                    <SelectItem value="none" disabled>No active litters found</SelectItem>
                  ) : (
                    litters.map((litter) => (
                      <SelectItem key={litter.id} value={litter.id}>
                        <div className="flex flex-col">
                          <div className="font-medium">
                            {litter.litter_name || "Unnamed Litter"}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {[
                              litter.dam && `Dam: ${litter.dam.name}`,
                              litter.birth_date && `Born: ${new Date(litter.birth_date).toLocaleDateString()}`
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
      )}
    </div>
  );
};

export default LitterSelectionFields;
