
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { SocializationRecord } from '../types';
import { SocializationCategory } from '@/types/puppyTracking';
import SocializationForm from './SocializationForm';
import SocializationList from './SocializationList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

interface SocializationTrackerProps {
  puppyId: string;
}

const SocializationTracker: React.FC<SocializationTrackerProps> = ({ puppyId }) => {
  const [experiences, setExperiences] = useState<SocializationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    refreshExperiences();
  }, [puppyId]);

  const refreshExperiences = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('socialization_records')
        .select(`
          id,
          puppy_id,
          category,
          experience,
          experience_date,
          reaction,
          notes,
          created_at
        `)
        .eq('puppy_id', puppyId)
        .order('experience_date', { ascending: false });

      if (error) throw error;

      // For each experience, we need to get the category details
      const enhancedExperiences = data.map((experience) => {
        return {
          ...experience,
          category: {
            id: experience.category, 
            name: experience.category
          } as SocializationCategory
        } as SocializationRecord;
      });

      setExperiences(enhancedExperiences);
    } catch (error) {
      console.error('Error fetching socialization records:', error);
      setError('Failed to load socialization experiences');
    } finally {
      setLoading(false);
    }
  };

  const addExperience = async (experience: {
    category: SocializationCategory;
    experience: string;
    experience_date: string;
    reaction?: string;
    notes?: string;
  }) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('socialization_records')
        .insert({
          puppy_id: puppyId,
          category: experience.category.id,
          experience: experience.experience,
          experience_date: experience.experience_date,
          reaction: experience.reaction,
          notes: experience.notes
        });

      if (error) throw error;

      toast({
        title: 'Experience added',
        description: 'The socialization experience has been recorded successfully.'
      });

      await refreshExperiences();
    } catch (error) {
      console.error('Error adding socialization record:', error);
      toast({
        title: 'Error',
        description: 'Failed to add socialization experience.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      const { error } = await supabase
        .from('socialization_records')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Experience deleted',
        description: 'The socialization experience has been removed.'
      });

      await refreshExperiences();
    } catch (error) {
      console.error('Error deleting socialization record:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete socialization experience.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="list">Experiences</TabsTrigger>
            <TabsTrigger value="add">Add New</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <SocializationList 
              experiences={experiences} 
              isLoading={loading} 
              error={error} 
              onDelete={deleteExperience} 
            />
          </TabsContent>

          <TabsContent value="add">
            <SocializationForm 
              onSubmit={addExperience}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SocializationTracker;
