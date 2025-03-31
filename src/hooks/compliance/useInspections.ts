
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { customSupabase, InspectionRow } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useInspections = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [inspections, setInspections] = useState<InspectionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInspection, setSelectedInspection] = useState<InspectionRow | null>(null);
  
  const fetchInspections = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await customSupabase
        .from<InspectionRow>('inspections')
        .select('*')
        .order('inspection_date', { ascending: false });

      if (error) throw error;
      setInspections(data || []);
    } catch (error: any) {
      console.error('Error fetching inspections:', error);
      toast({
        title: 'Error',
        description: 'Failed to load inspections data. Please try again later.',
        variant: 'destructive',
      });
      // Set an empty array instead of error data
      setInspections([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveInspection = async (inspectionData: any): Promise<boolean> => {
    try {
      const userId = user?.id;
      if (!userId) {
        toast({
          title: 'Authentication Required',
          description: 'You must be logged in to save inspection data.',
          variant: 'destructive',
        });
        return false;
      }

      if (selectedInspection) {
        // Update existing inspection
        const { error } = await customSupabase
          .from<InspectionRow>('inspections')
          .update({
            ...inspectionData,
            breeder_id: userId,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedInspection.id);

        if (error) throw error;
        
        toast({
          title: 'Inspection Updated',
          description: 'The inspection has been successfully updated.',
        });
      } else {
        // Create new inspection
        const { error } = await customSupabase
          .from<InspectionRow>('inspections')
          .insert({
            ...inspectionData,
            breeder_id: userId
          });

        if (error) throw error;
        
        toast({
          title: 'Inspection Added',
          description: 'The new inspection has been successfully added.',
        });
      }
      
      fetchInspections();
      return true;
    } catch (error: any) {
      console.error('Error saving inspection:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save inspection',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchInspections();
    }
  }, [user]);

  return {
    inspections,
    isLoading,
    selectedInspection,
    setSelectedInspection,
    fetchInspections,
    saveInspection
  };
};
