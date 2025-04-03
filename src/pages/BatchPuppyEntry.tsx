import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageContainer from '@/components/common/PageContainer';
import { standardizeWeightUnit } from '@/types/common';

const puppySchema = z.object({
  name: z.string().min(2, {
    message: "Puppy name must be at least 2 characters.",
  }),
  birth_date: z.string().nonempty({
    message: "Birth date is required.",
  }),
  birth_weight: z.string().optional(),
  weight_unit: z.enum(['lb', 'kg', 'oz', 'g']).optional(),
  gender: z.enum(['Male', 'Female']).optional(),
  color: z.string().optional(),
});

const batchPuppySchema = z.object({
  puppies: z.array(puppySchema).min(1, {
    message: "At least one puppy is required.",
  }),
});

type PuppySchema = z.infer<typeof puppySchema>;
type BatchPuppyFormValues = z.infer<typeof batchPuppySchema>;

const BatchPuppyEntry: React.FC = () => {
  const { id: puppyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BatchPuppyFormValues>({
    resolver: zodResolver(batchPuppySchema),
    defaultValues: {
      puppies: [{ name: '', birth_date: '', birth_weight: '', gender: 'Male', color: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "puppies",
  });

  const handleSubmit = async (data: BatchPuppyFormValues) => {
    setIsSubmitting(true);
    try {
      if (!puppyId) {
        toast({
          title: "Error",
          description: "Litter ID is required.",
          variant: "destructive",
        });
        return;
      }

      // Process each puppy
      for (const puppy of data.puppies) {
        // Insert the puppy into the database
        const { data: newPuppy, error: puppyError } = await supabase
          .from('puppies')
          .insert({
            litter_id: puppyId,
            name: puppy.name,
            birth_date: puppy.birth_date,
            gender: puppy.gender,
            color: puppy.color,
          })
          .select()
          .single();

        if (puppyError) {
          console.error('Error adding puppy:', puppyError);
          toast({
            title: "Error",
            description: `Failed to add puppy ${puppy.name}: ${puppyError.message}`,
            variant: "destructive",
          });
          continue; // Skip to the next puppy
        }

        // If birth weight is provided, create a weight record
        if (puppy.birth_weight && parseFloat(puppy.birth_weight) > 0) {
          const weight = parseFloat(puppy.birth_weight);
          const unit = puppy.weight_unit || 'oz'; // Default to oz if not specified
          
          const weightData = {
            dog_id: puppyId, // Required field for the Supabase schema
            puppy_id: puppyId,
            weight: weight,
            weight_unit: unit,
            unit: unit, // Add unit field for compatibility
            date: puppy.birth_date,
            notes: 'Birth weight'
          };
          
          const { error: weightError } = await supabase
            .from('weight_records')
            .insert(weightData);
          
          if (weightError) {
            console.error('Error adding weight record:', weightError);
          }
        }
      }

      toast({
        title: "Success",
        description: "Puppies added successfully!",
      });
      navigate(`/litters/${puppyId}`);
    } catch (error) {
      console.error('Error adding puppies:', error);
      toast({
        title: "Error",
        description: "Failed to add puppies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Batch Puppy Entry</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {fields.map((item, index) => (
              <div key={item.id} className="border p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-2">Puppy #{index + 1}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`puppies.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Puppy Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`puppies.${index}.birth_date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`puppies.${index}.birth_weight`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Weight</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Birth Weight" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`puppies.${index}.weight_unit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight Unit</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="lb">Pounds (lb)</SelectItem>
                            <SelectItem value="kg">Kilograms (kg)</SelectItem>
                            <SelectItem value="oz">Ounces (oz)</SelectItem>
                            <SelectItem value="g">Grams (g)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`puppies.${index}.gender`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`puppies.${index}.color`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input placeholder="Color" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)} className="mt-2">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={() => append({ name: '', birth_date: '', birth_weight: '', gender: 'Male', color: '' })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Puppy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </PageContainer>
  );
};

export default BatchPuppyEntry;
