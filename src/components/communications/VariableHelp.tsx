
import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

const VariableHelp: React.FC = () => {
  const variables = [
    { name: '{{customer_name}}', description: 'Full name of the customer' },
    { name: '{{customer_first_name}}', description: 'First name of the customer' },
    { name: '{{customer_email}}', description: 'Email address of the customer' },
    { name: '{{customer_phone}}', description: 'Phone number of the customer' },
    { name: '{{puppy_name}}', description: 'Name of the puppy' },
    { name: '{{puppy_gender}}', description: 'Gender of the puppy' },
    { name: '{{puppy_color}}', description: 'Color of the puppy' },
    { name: '{{puppy_weight}}', description: 'Current weight of the puppy' },
    { name: '{{puppy_age}}', description: 'Age of the puppy in weeks' },
    { name: '{{pickup_date}}', description: 'Scheduled pickup date' },
    { name: '{{vaccinations}}', description: 'List of vaccinations' },
    { name: '{{custom_message}}', description: 'Custom message you can fill in when sending' },
  ];

  return (
    <div className="text-right">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" size="sm" className="text-muted-foreground">
            <HelpCircle className="h-4 w-4 mr-1" />
            Template Variables
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium">Available Variables</h4>
            <p className="text-sm text-muted-foreground">
              Use these placeholders in your template. They will be replaced with actual data when sending.
            </p>
            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full text-sm">
                <tbody>
                  {variables.map((variable) => (
                    <tr key={variable.name} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 font-mono text-xs">{variable.name}</td>
                      <td className="py-2 text-muted-foreground">{variable.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default VariableHelp;
