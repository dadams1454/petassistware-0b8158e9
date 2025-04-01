
import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WelpingPreparationGuide: React.FC = () => {
  const steps = [
    { 
      text: "Prepare whelping box and area", 
      description: "Set up clean, warm space with proper bedding"
    },
    { 
      text: "Assemble whelping kit", 
      description: "Gather towels, heating pad, bulb syringe, etc."
    },
    { 
      text: "Monitor dam's temperature", 
      description: "Check 2-3 times daily; drop indicates labor within 24hrs"
    },
    { 
      text: "Record all birth details", 
      description: "Log time, weight, gender, markings for each puppy"
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
          Whelping Checklist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 text-green-500">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">{step.text}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WelpingPreparationGuide;
