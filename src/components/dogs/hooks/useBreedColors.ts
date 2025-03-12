
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { newfoundlandColors } from '../constants/formOptions';

/**
 * Hook to manage breed-specific color options
 * @param form The form instance from react-hook-form
 * @param watchBreed The current breed value from the form
 * @returns An object containing color options for the selected breed
 */
export const useBreedColors = (
  form: UseFormReturn<any>,
  watchBreed: string
): { colorOptions: { value: string; label: string }[] } => {
  const [colorOptions, setColorOptions] = useState<{ value: string; label: string }[]>([]);

  // Update color options when breed changes
  useEffect(() => {
    if (watchBreed === 'Newfoundland') {
      setColorOptions(newfoundlandColors);

      // Reset color if current selection is not in the Newfoundland colors
      const currentColor = form.getValues('color');
      const validNewfoundlandColors = newfoundlandColors.map(color => color.value);
      
      if (currentColor && !validNewfoundlandColors.includes(currentColor)) {
        form.setValue('color', '');
      }
    } else {
      setColorOptions([]);
    }
  }, [watchBreed, form]);

  return { colorOptions };
};
