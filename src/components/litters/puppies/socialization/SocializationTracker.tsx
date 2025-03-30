import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Puppy } from '@/components/litters/puppies/types';
import { SocializationCategory } from '@/components/litters/puppies/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';
import SocializationForm from './SocializationForm';
import SocializationList from './SocializationList';

interface SocializationTrackerProps {
  puppyId: string;
}

interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: SocializationCategory;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

const useSocializationTracker = (puppyId: string) => {
  const [experiences, setExperiences] = useState<SocializationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const refreshExperiences = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('socialization_records')
        .select('*, category:socialization_categories(*)')
        .eq('puppy_id', puppyId)
        .order('experience_date', { ascending: false });
      
      if (error) throw error;
      setExperiences(data as SocializationRecord[]);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching socialization experiences:', err);
      toast({
        title: "Error",
        description: "Failed to load socialization experiences.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [puppyId]);

  useEffect(() => {
    refreshExperiences();
  }, [puppyId, refreshExperiences]);

  const addExperience = async (experience: {
    category: SocializationCategory;
    experience: string;
    experience_date: string;
    reaction?: string;
    notes?: string;
  }) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('socialization_records')
        .insert({
          puppy_id: puppyId,
          category_id: experience.category.id,
          experience: experience.experience,
          experience_date: experience.experience_date,
          reaction: experience.reaction,
          notes: experience.notes
        })
        .select();
      
      if (error) throw error;
      await refreshExperiences();
      toast({
        title: "Experience added",
        description: "New socialization experience has been recorded."
      });
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding socialization experience:', err);
      toast({
        title: "Error",
        description: "There was a problem adding the experience.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return { experiences, loading, error, addExperience, refreshExperiences };
};

const SocializationTracker: React.FC<SocializationTrackerProps> = ({ puppyId }) => {
  const { loading, error, experiences, addExperience, refreshExperiences } = useSocializationTracker(puppyId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deleteExperience = async (id: string) => {
    try {
      const { error } = await supabase
        .from('socialization_records')
        .delete()
        .eq('id', id);
    
    if (error) throw error;
    await refreshExperiences();
    toast({
      title: "Experience deleted",
      description: "The socialization experience has been removed."
    });
  } catch (err) {
    console.error('Error deleting experience:', err);
    toast({
      title: "Error",
      description: "There was a problem deleting the experience.",
      variant: "destructive"
    });
  }
};

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Socialization Tracker</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshExperiences()}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      <SocializationForm puppyId={puppyId} onSubmit={addExperience} isSubmitting={isSubmitting} />
      
      <SocializationList
        experiences={experiences}
        loading={loading}
        error={error}
        onDelete={deleteExperience}
      />
    </div>
  );
};

export default SocializationTracker;
