
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X, ChevronRight, TreeDeciduous } from 'lucide-react';
import { useDogRelationships } from '../../hooks/useDogRelationships';
import DogSelector from '@/components/litters/form/DogSelector';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

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

  // Fetch dog details for each related dog
  const { data: allDogs } = useQuery({
    queryKey: ['allDogs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('dogs')
        .select('id, name, breed, gender, color, photo_url');
      return data || [];
    }
  });

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

  // Get dog details from ID
  const getDogDetails = (dogId: string) => {
    return allDogs?.find(dog => dog.id === dogId) || null;
  };

  // Filter relationships by type
  const parentRelationships = relationships?.filter(r => 
    (r.dog_id === dogId && r.relationship_type === 'parent') ||
    (r.related_dog_id === dogId && r.relationship_type === 'offspring')
  ) || [];

  const childRelationships = relationships?.filter(r => 
    (r.dog_id === dogId && r.relationship_type === 'offspring') ||
    (r.related_dog_id === dogId && r.relationship_type === 'parent')
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-gray-400">Loading pedigree information...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TreeDeciduous className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Family Tree</h2>
        </div>
        
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)}
            size="sm"
            className="gap-1"
          >
            <Plus className="h-4 w-4" /> 
            Add Relationship
          </Button>
        )}
      </div>

      {isAdding && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Add New Relationship</CardTitle>
            <CardDescription>
              Connect {currentDog.name} with other dogs in your kennel
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select relationship type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="parent">Parent of {currentDog.name}</SelectItem>
                          <SelectItem value="offspring">Offspring of {currentDog.name}</SelectItem>
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

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="gap-1">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
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
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parents Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Parents</CardTitle>
            <CardDescription>
              {parentRelationships.length > 0 
                ? `${currentDog.name}'s parents` 
                : `No parents recorded for ${currentDog.name}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {parentRelationships.length > 0 ? (
              <div className="space-y-3">
                {parentRelationships.map((relationship) => {
                  const relatedDogId = relationship.dog_id === dogId 
                    ? relationship.related_dog_id 
                    : relationship.dog_id;
                  const relatedDog = getDogDetails(relatedDogId);
                  
                  return (
                    <div key={relationship.id} className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg hover:bg-accent/40 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                        {relatedDog?.photo_url ? (
                          <div 
                            className="h-full w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${relatedDog.photo_url})` }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            🐾
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{relatedDog?.name || 'Unknown Dog'}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{relatedDog?.breed || 'Unknown Breed'}</span>
                          {relatedDog?.gender && (
                            <>
                              <span>•</span>
                              <span>{relatedDog.gender}</span>
                            </>
                          )}
                          {relatedDog?.color && (
                            <>
                              <span>•</span>
                              <span>{relatedDog.color}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeRelationship.mutate(relationship.id)}
                        title="Remove relationship"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center text-muted-foreground">
                <div className="mb-2 rounded-full bg-muted/50 p-3">
                  <TreeDeciduous className="h-6 w-6 text-muted-foreground" />
                </div>
                <p>No parents have been added yet</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setIsAdding(true);
                    form.setValue('type', 'parent');
                  }}
                  className="mt-2"
                >
                  Add a parent
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Offspring Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Offspring</CardTitle>
            <CardDescription>
              {childRelationships.length > 0 
                ? `${currentDog.name}'s offspring` 
                : `No offspring recorded for ${currentDog.name}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {childRelationships.length > 0 ? (
              <div className="space-y-3">
                {childRelationships.map((relationship) => {
                  const relatedDogId = relationship.dog_id === dogId 
                    ? relationship.related_dog_id 
                    : relationship.dog_id;
                  const relatedDog = getDogDetails(relatedDogId);
                  
                  return (
                    <div key={relationship.id} className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg hover:bg-accent/40 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                        {relatedDog?.photo_url ? (
                          <div 
                            className="h-full w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${relatedDog.photo_url})` }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            🐾
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{relatedDog?.name || 'Unknown Dog'}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{relatedDog?.breed || 'Unknown Breed'}</span>
                          {relatedDog?.gender && (
                            <>
                              <span>•</span>
                              <span>{relatedDog.gender}</span>
                            </>
                          )}
                          {relatedDog?.color && (
                            <>
                              <span>•</span>
                              <span>{relatedDog.color}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeRelationship.mutate(relationship.id)}
                        title="Remove relationship"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center text-muted-foreground">
                <div className="mb-2 rounded-full bg-muted/50 p-3">
                  <TreeDeciduous className="h-6 w-6 text-muted-foreground" />
                </div>
                <p>No offspring have been added yet</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setIsAdding(true);
                    form.setValue('type', 'offspring');
                  }}
                  className="mt-2"
                >
                  Add offspring
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PedigreeTab;
