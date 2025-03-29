
import { supabase } from '@/integrations/supabase/client';
import { PuppyColorPrediction } from '@/types/colorGenetics';

export const getBreedColors = async (breed: string) => {
  const { data, error } = await supabase
    .from('breed_colors')
    .select('*')
    .eq('breed', breed);
  
  if (error) {
    console.error('Error fetching breed colors:', error);
    throw error;
  }
  
  return data;
};

export const getPredictedColors = async (
  breed: string,
  damColor: string,
  sireColor: string
): Promise<PuppyColorPrediction[]> => {
  // Execute the database call with the correct function signature
  const { data, error } = await supabase.functions.invoke('predict-puppy-colors', {
    body: {
      breed_name: breed,
      dam_color: damColor,
      sire_color: sireColor
    }
  });
  
  if (error) {
    console.error('Error predicting puppy colors:', error);
    throw error;
  }
  
  // Handle the response correctly
  return Array.isArray(data) ? data : [];
};
