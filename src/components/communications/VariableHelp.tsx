
import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, FileText, User, Dog } from 'lucide-react';

const VariableHelp: React.FC = () => {
  const customerVariables = [
    { name: '{{customer_name}}', description: 'Full name of the customer', example: 'John Smith' },
    { name: '{{customer_first_name}}', description: 'First name of the customer', example: 'John' },
    { name: '{{customer_email}}', description: 'Email address of the customer', example: 'john@example.com' },
    { name: '{{customer_phone}}', description: 'Phone number of the customer', example: '(555) 123-4567' },
  ];

  const puppyVariables = [
    { name: '{{puppy_name}}', description: 'Name of the puppy', example: 'Max' },
    { name: '{{puppy_gender}}', description: 'Gender of the puppy', example: 'Male' },
    { name: '{{puppy_color}}', description: 'Color of the puppy', example: 'Black and White' },
    { name: '{{puppy_weight}}', description: 'Current weight of the puppy', example: '5.2 lbs' },
    { name: '{{puppy_age}}', description: 'Age of the puppy in weeks', example: '8' },
  ];

  const otherVariables = [
    { name: '{{pickup_date}}', description: 'Scheduled pickup date', example: 'June 15, 2023' },
    { name: '{{vaccinations}}', description: 'List of vaccinations', example: 'DHPP, Rabies, Bordetella' },
    { name: '{{custom_message}}', description: 'Custom message you can fill in when sending', example: 'Just wanted to let you know your puppy is doing great!' },
  ];

  const emailExample = `Dear {{customer_first_name}},

I hope this email finds you well. I wanted to share an update about {{puppy_name}}. 

{{custom_message}}

Your puppy is currently {{puppy_age}} weeks old and weighs {{puppy_weight}}. We've completed the following vaccinations: {{vaccinations}}.

Please let me know if you have any questions or would like to schedule a visit before the pickup date on {{pickup_date}}.

Best regards,
Bear Paw Newfoundlands`;

  const smsExample = `Bear Paw Kennels: {{puppy_name}} update - {{custom_message}} Your puppy is now {{puppy_age}} weeks old. Call us for more info.`;

  return (
    <div className="text-right">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" size="sm" className="text-muted-foreground">
            <HelpCircle className="h-4 w-4 mr-1" />
            Template Variables
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-96 p-0">
          <Tabs defaultValue="variables" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="variables">
                <User className="h-3.5 w-3.5 mr-1" />
                Variables
              </TabsTrigger>
              <TabsTrigger value="examples">
                <FileText className="h-3.5 w-3.5 mr-1" />
                Examples
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="variables" className="p-4 max-h-[350px] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium flex items-center mb-1">
                    <User className="h-4 w-4 mr-1.5" />
                    Customer Variables
                  </h4>
                  <table className="w-full text-sm">
                    <tbody>
                      {customerVariables.map((variable) => (
                        <tr key={variable.name} className="border-b border-gray-100 last:border-0">
                          <td className="py-1.5 font-mono text-xs">{variable.name}</td>
                          <td className="py-1.5 text-muted-foreground text-xs">{variable.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center mb-1">
                    <Dog className="h-4 w-4 mr-1.5" />
                    Puppy Variables
                  </h4>
                  <table className="w-full text-sm">
                    <tbody>
                      {puppyVariables.map((variable) => (
                        <tr key={variable.name} className="border-b border-gray-100 last:border-0">
                          <td className="py-1.5 font-mono text-xs">{variable.name}</td>
                          <td className="py-1.5 text-muted-foreground text-xs">{variable.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Other Variables</h4>
                  <table className="w-full text-sm">
                    <tbody>
                      {otherVariables.map((variable) => (
                        <tr key={variable.name} className="border-b border-gray-100 last:border-0">
                          <td className="py-1.5 font-mono text-xs">{variable.name}</td>
                          <td className="py-1.5 text-muted-foreground text-xs">{variable.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="examples" className="space-y-4 p-4">
              <div>
                <h4 className="font-medium flex items-center mb-2">
                  <Mail className="h-4 w-4 mr-1.5" />
                  Email Template Example
                </h4>
                <div className="text-xs font-mono bg-muted p-2 rounded whitespace-pre-wrap">
                  {emailExample}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium flex items-center mb-2">
                  <MessageSquare className="h-4 w-4 mr-1.5" />
                  SMS Template Example
                </h4>
                <div className="text-xs font-mono bg-muted p-2 rounded whitespace-pre-wrap">
                  {smsExample}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default VariableHelp;
