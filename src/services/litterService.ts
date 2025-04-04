
import { supabase } from '@/integrations/supabase/client';
import { formatDateToYYYYMMDD } from '@/utils/dateUtils';
import { Litter } from '@/types/litter';

export interface CreateLitterParams {
  damId: string;
  sireId?: string;
  birthDate: Date;
  litterName?: string;
  userId?: string;
}

export interface LitterResult {
  success: boolean;
  data?: Litter;
  error?: string;
  litterId?: string;
}

/**
 * Create a new litter with proper error handling and tenant ID
 */
export const createLitter = async ({
  damId,
  sireId,
  birthDate,
  litterName,
  userId,
}: CreateLitterParams): Promise<LitterResult> => {
  try {
    if (!damId) {
      return { success: false, error: "Dam selection is required" };
    }
    
    if (!birthDate) {
      return { success: false, error: "Birth date is required" };
    }
    
    // Get the dam and sire names for a potential fallback litter name
    const { data: damData } = await supabase
      .from('dogs')
      .select('name')
      .eq('id', damId)
      .single();
      
    const { data: sireData } = sireId ? await supabase
      .from('dogs')
      .select('name')
      .eq('id', sireId)
      .single() : { data: null };
    
    // Format date for database
    const formattedDate = formatDateToYYYYMMDD(birthDate) || new Date().toISOString().split('T')[0];
    
    // Generate default litter name if not provided
    const damName = damData?.name || 'Unknown Dam';
    const sireName = sireData?.name || 'Unknown Sire';
    const defaultLitterName = `${damName} x ${sireName} - ${formattedDate}`;
    const finalLitterName = litterName && litterName.trim() !== '' ? litterName : defaultLitterName;
    
    // Prepare the litter data
    const litterData = {
      dam_id: damId,
      sire_id: sireId || null,
      birth_date: formattedDate,
      litter_name: finalLitterName,
      status: 'active',
      // The breeder_id maps to the user ID for the current user
      breeder_id: userId || null,
    };
    
    console.log('Creating litter with data:', litterData);
    
    const { data, error } = await supabase
      .from('litters')
      .insert(litterData)
      .select();
    
    if (error) {
      console.error('Error creating litter:', error);
      return { success: false, error: error.message };
    }
    
    if (!data || data.length === 0) {
      return { success: false, error: "No data returned after inserting litter" };
    }
    
    // Update the dam's status to reflect the whelping
    await supabase
      .from('dogs')
      .update({ 
        is_pregnant: false 
      })
      .eq('id', damId);
    
    return { success: true, data: data[0], litterId: data[0].id };
  } catch (error: any) {
    console.error("Unexpected error creating litter:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

/**
 * Get litter details by ID
 */
export const getLitterById = async (litterId: string): Promise<LitterResult> => {
  try {
    const { data, error } = await supabase
      .from('litters')
      .select(`
        *,
        dam:dam_id(*),
        sire:sire_id(*),
        puppies!puppies_litter_id_fkey(*)
      `)
      .eq('id', litterId)
      .single();
      
    if (error) {
      console.error('Error fetching litter:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data: data as unknown as Litter, litterId: data.id };
  } catch (error: any) {
    console.error("Error fetching litter by ID:", error);
    return { success: false, error: error.message || "Failed to fetch litter details" };
  }
};
