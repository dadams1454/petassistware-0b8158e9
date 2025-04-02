
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useInspections = () => {
  const [inspections, setInspections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInspection, setSelectedInspection] = useState<any | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('compliance_inspections')
        .select('*')
        .order('inspection_date', { ascending: false });

      if (error) throw error;
      setInspections(data || []);
    } catch (error: any) {
      setInspections([]);
      console.error("Error fetching inspections:", error);
      toast({
        title: 'Error',
        description: 'Failed to load inspections. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveInspection = async (inspectionData: any) => {
    try {
      if (inspectionData.id) {
        // Update existing inspection
        const { error } = await supabase
          .from('compliance_inspections')
          .update(inspectionData)
          .eq('id', inspectionData.id);

        if (error) throw error;

        toast({
          title: 'Inspection Updated',
          description: 'The inspection has been updated successfully.',
        });
      } else {
        // Insert new inspection
        const { error } = await supabase
          .from('compliance_inspections')
          .insert(inspectionData);

        if (error) throw error;

        toast({
          title: 'Inspection Added',
          description: 'The new inspection has been added successfully.',
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

  return {
    inspections,
    isLoading,
    selectedInspection,
    setSelectedInspection,
    saveInspection
  };
};
