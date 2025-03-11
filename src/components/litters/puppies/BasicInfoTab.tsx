
import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextInput from '@/components/dogs/form/TextInput';
import SelectInput from '@/components/dogs/form/SelectInput';
import DatePicker from '@/components/dogs/form/DatePicker';
import PhotoUpload from '@/components/dogs/form/PhotoUpload';
import { 
  User, 
  Calendar, 
  Palette, 
  Tag, 
  Scan, 
  DollarSign,
  Image
} from 'lucide-react';
import { genderOptions, statusOptions } from './constants';
import { PuppyFormData } from './types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BasicInfoTabProps {
  form: UseFormReturn<PuppyFormData>;
  litterId?: string;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ form, litterId }) => {
  const [colorOptions, setColorOptions] = useState<{value: string, label: string}[]>([]);
  const [isNewfoundland, setIsNewfoundland] = useState(false);

  // Get litter data to determine the breed
  const { data: litterData } = useQuery({
    queryKey: ['litter-breed', litterId],
    queryFn: async () => {
      if (!litterId) return null;
      
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dogs!litters_dam_id_fkey(breed)
        `)
        .eq('id', litterId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!litterId
  });

  // Set up color options based on breed
  useEffect(() => {
    if (litterData?.dam?.breed === 'Newfoundland') {
      setIsNewfoundland(true);
      setColorOptions([
        { value: 'Black 007', label: 'Black 007' },
        { value: 'Brown 061', label: 'Brown 061' },
        { value: 'Gray 100', label: 'Gray 100' },
        { value: 'brown/white 063', label: 'brown/white 063' },
        { value: 'black/white 202', label: 'black/white 202' },
      ]);
    } else {
      setIsNewfoundland(false);
      setColorOptions([]);
    }
  }, [litterData]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <User className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-medium">Identity & Basic Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Puppy Name</span>
          </div>
          <TextInput 
            form={form} 
            name="name" 
            label="Name" 
            placeholder="Puppy name (optional)" 
          />
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Gender</span>
          </div>
          <SelectInput 
            form={form} 
            name="gender" 
            label="Sex" 
            options={genderOptions} 
            placeholder="Select gender" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Date of Birth</span>
          </div>
          <DatePicker
            form={form}
            name="birth_date"
            label="Birth Date"
          />
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Color Markings</span>
          </div>
          {isNewfoundland ? (
            <SelectInput 
              form={form} 
              name="color" 
              label="Color" 
              options={colorOptions}
              placeholder="Select color" 
            />
          ) : (
            <TextInput 
              form={form} 
              name="color" 
              label="Color" 
              placeholder="Puppy's color markings" 
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Puppy Status</span>
          </div>
          <SelectInput 
            form={form} 
            name="status" 
            label="Status" 
            options={statusOptions} 
          />
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scan className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Microchip</span>
          </div>
          <TextInput 
            form={form} 
            name="microchip_number" 
            label="Microchip Number" 
            placeholder="Enter microchip number" 
          />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Pricing</span>
        </div>
        <TextInput 
          form={form} 
          name="sale_price" 
          label="Sale Price" 
          placeholder="Enter sale price" 
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <Image className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Photo</span>
        </div>
        <PhotoUpload
          form={form}
          name="photo_url"
          label="Puppy Photo"
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;
