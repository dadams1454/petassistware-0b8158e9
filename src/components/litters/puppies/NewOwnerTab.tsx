
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextInput from '@/components/dogs/form/TextInput';
import DatePicker from '@/components/dogs/form/DatePicker';
import TextareaInput from '@/components/dogs/form/TextareaInput';
import PhotoUpload from '@/components/dogs/form/PhotoUpload';
import { User, Calendar, FileSpreadsheet } from 'lucide-react';
import { PuppyFormData } from './types';

interface NewOwnerTabProps {
  form: UseFormReturn<PuppyFormData>;
}

const NewOwnerTab: React.FC<NewOwnerTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-md p-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-5 w-5 text-blue-700" />
          <h3 className="text-blue-800 font-medium">New Owner Information</h3>
        </div>
        <p className="text-sm text-blue-700">
          Record new owner details for AKC compliance when transferring ownership of this puppy.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput 
          form={form} 
          name="new_owner_name" 
          label="New Owner Name" 
          placeholder="Enter full name of new owner"
        />
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Transfer Date</span>
          </div>
          <DatePicker
            form={form}
            name="transfer_date"
            label="Date of Transfer/Sale"
          />
        </div>
      </div>
      
      <TextareaInput 
        form={form} 
        name="new_owner_address" 
        label="New Owner Address" 
        placeholder="Enter full address of new owner"
      />
      
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Contract Documentation</span>
        </div>
        <PhotoUpload 
          form={form} 
          name="contract_url" 
          label="Upload Contract/Bill of Sale" 
        />
      </div>
    </div>
  );
};

export default NewOwnerTab;
