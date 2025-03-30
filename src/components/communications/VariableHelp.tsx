
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const VariableHelp: React.FC = () => {
  return (
    <div className="bg-muted/30 p-3 rounded-md border">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="variables">
          <AccordionTrigger className="text-sm flex items-center">
            <HelpCircle className="h-4 w-4 mr-2" />
            Available Variables
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-xs space-y-1 pt-2">
              <p className="font-medium">Customer Variables:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><code>{'{{customer_name}}'}</code> - Full name of the customer</li>
                <li><code>{'{{customer_first_name}}'}</code> - First name only</li>
                <li><code>{'{{customer_email}}'}</code> - Email address</li>
                <li><code>{'{{customer_phone}}'}</code> - Phone number</li>
              </ul>
              
              <p className="font-medium mt-3">Puppy Variables:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><code>{'{{puppy_name}}'}</code> - Puppy's name</li>
                <li><code>{'{{puppy_gender}}'}</code> - Gender (Male/Female)</li>
                <li><code>{'{{puppy_color}}'}</code> - Color/markings</li>
                <li><code>{'{{puppy_weight}}'}</code> - Current weight</li>
                <li><code>{'{{puppy_age}}'}</code> - Age in weeks</li>
              </ul>
              
              <p className="font-medium mt-3">Other Variables:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><code>{'{{custom_message}}'}</code> - Your custom message</li>
                <li><code>{'{{pickup_date}}'}</code> - Scheduled pickup date</li>
                <li><code>{'{{vaccinations}}'}</code> - Vaccination details</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default VariableHelp;
