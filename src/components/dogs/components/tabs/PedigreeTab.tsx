
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDogRelationships } from '../../hooks/useDogRelationships';
import DogSelector from '@/components/litters/form/DogSelector';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const relationshipSchema = z.object({
  relatedDogId: z.string().min(1, "Please select a dog"),
  type: z.enum(['parent', 'offspring'])
});

interface PedigreeTabProps {
  dogId: string;
  currentDog: any;
}

const PedigreeTab = ({ dogId, currentDog }: PedigreeTabProps) => {
  const { relationships, isLoading, addRelationship, removeRelationship } = useDogRelationships(dogId);
  const [isAdding, setIsAdding] = useState(false);

  const form = useForm<z.infer<typeof relationshipSchema>>({
    resolver: zodResolver(relationshipSchema),
    defaultValues: {
      relatedDogId: '',
      type: 'parent'
    }
  });

  const onSubmit = async (values: z.infer<typeof relationshipSchema>) => {
    await addRelationship.mutateAsync({
      relatedDogId: values.relatedDogId,
      type: values.type
    });
    setIsAdding(false);
    form.reset();
  };

  if (isLoading) {
    return <div>Loading pedigree information...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Family Tree</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Display Parents */}
            <div>
              <h3 className="text-lg font-medium mb-2">Parents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relationships?.filter(r => 
                  r.dog_id === dogId && r.relationship_type === 'parent'
                ).map(r => (
                  <div key={r.id} className="flex items-center justify-between p-2 border rounded">
                    <span>{r.related_dog_id}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeRelationship.mutate(r.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Display Offspring */}
            <div>
              <h3 className="text-lg font-medium mb-2">Offspring</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relationships?.filter(r => 
                  r.dog_id === dogId && r.relationship_type === 'offspring'
                ).map(r => (
                  <div key={r.id} className="flex items-center justify-between p-2 border rounded">
                    <span>{r.related_dog_id}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeRelationship.mutate(r.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Relationship Form */}
            {isAdding ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="offspring">Offspring</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="relatedDogId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Related Dog</FormLabel>
                        <DogSelector
                          form={form}
                          name="relatedDogId"
                          label="Select Dog"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button type="submit">Add Relationship</Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsAdding(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <Button onClick={() => setIsAdding(true)}>
                Add Relationship
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PedigreeTab;
