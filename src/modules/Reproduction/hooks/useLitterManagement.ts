
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Litter, LitterWithDogs, Dog } from '@/types/litter';
import { format, parseISO, addDays } from 'date-fns';

export const useLitterManagement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Query to fetch all litters
  const {
    data: litters = [],
    isLoading: isLoadingLitters,
    refetch: refetchLitters
  } = useQuery({
    queryKey: ['litters'],
    queryFn: async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('litters')
          .select(`
            *,
            dam:dam_id(*),
            sire:sire_id(*),
            puppies:puppies(count)
          `)
          .order('birth_date', { ascending: false });
          
        if (error) throw error;
        
        return data as LitterWithDogs[];
      } catch (error) {
        console.error('Error loading litters:', error);
        toast({
          title: 'Error',
          description: 'Failed to load litters. Please try again.',
          variant: 'destructive',
        });
        return [];
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Query to fetch dogs for selection
  const {
    data: dogs = [],
    isLoading: isLoadingDogs
  } = useQuery({
    queryKey: ['dogs-selection'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('id, name, breed, gender, color, photo_url')
        .order('name');
        
      if (error) throw error;
      return data as Dog[];
    }
  });

  // Mutation to create a new litter
  const createLitter = useMutation({
    mutationFn: async (litterData: Partial<Litter>) => {
      const { data, error } = await supabase
        .from('litters')
        .insert(litterData)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Litter created',
        description: 'New litter has been successfully created',
      });
      queryClient.invalidateQueries({ queryKey: ['litters'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to create litter: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Mutation to update a litter
  const updateLitter = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Litter> }) => {
      const { error } = await supabase
        .from('litters')
        .update(data)
        .eq('id', id);
        
      if (error) throw error;
      return { id, ...data };
    },
    onSuccess: () => {
      toast({
        title: 'Litter updated',
        description: 'Litter has been successfully updated',
      });
      queryClient.invalidateQueries({ queryKey: ['litters'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to update litter: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Mutation to delete a litter
  const deleteLitter = useMutation({
    mutationFn: async (litterId: string) => {
      const { error } = await supabase
        .from('litters')
        .delete()
        .eq('id', litterId);
        
      if (error) throw error;
      return litterId;
    },
    onSuccess: () => {
      toast({
        title: 'Litter deleted',
        description: 'Litter has been successfully deleted',
      });
      queryClient.invalidateQueries({ queryKey: ['litters'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to delete litter: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Function to archive a litter
  const archiveLitter = useMutation({
    mutationFn: async (litter: Litter) => {
      const { error } = await supabase
        .from('litters')
        .update({ status: 'archived' })
        .eq('id', litter.id);
        
      if (error) throw error;
      return litter.id;
    },
    onSuccess: () => {
      toast({
        title: 'Litter archived',
        description: 'Litter has been archived successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['litters'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to archive litter: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Function to unarchive a litter
  const unarchiveLitter = useMutation({
    mutationFn: async (litter: Litter) => {
      const { error } = await supabase
        .from('litters')
        .update({ status: 'active' })
        .eq('id', litter.id);
        
      if (error) throw error;
      return litter.id;
    },
    onSuccess: () => {
      toast({
        title: 'Litter unarchived',
        description: 'Litter has been unarchived successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['litters'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to unarchive litter: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Function to get litter details by ID
  const fetchLitterById = async (litterId: string): Promise<LitterWithDogs | null> => {
    try {
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dam_id(*),
          sire:sire_id(*),
          puppies:puppies(*)
        `)
        .eq('id', litterId)
        .single();
        
      if (error) throw error;
      return data as LitterWithDogs;
    } catch (error) {
      console.error('Error fetching litter details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load litter details',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Return organized data and functions
  return {
    litters,
    dogs,
    isLoading: isLoading || isLoadingLitters || isLoadingDogs,
    createLitter: createLitter.mutateAsync,
    updateLitter: updateLitter.mutateAsync,
    deleteLitter: deleteLitter.mutateAsync,
    archiveLitter: archiveLitter.mutateAsync,
    unarchiveLitter: unarchiveLitter.mutateAsync,
    fetchLitterById,
    refetchLitters,
    // Operation status
    isCreating: createLitter.isPending,
    isUpdating: updateLitter.isPending,
    isDeleting: deleteLitter.isPending,
    isArchiving: archiveLitter.isPending,
    isUnarchiving: unarchiveLitter.isPending
  };
};
