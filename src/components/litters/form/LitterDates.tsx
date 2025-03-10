
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import LitterDatePicker from './LitterDatePicker';

interface LitterDatesProps {
  form: UseFormReturn<any>;
}

const LitterDates = ({ form }: LitterDatesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <LitterDatePicker 
        form={form}
        name="birth_date"
        label="Birth Date" 
      />
      
      <LitterDatePicker 
        form={form}
        name="expected_go_home_date"
        label="Expected Go-Home Date" 
      />
    </div>
  );
};

export default LitterDates;
