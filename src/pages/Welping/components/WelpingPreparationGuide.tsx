
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const WelpingPreparationGuide = () => {
  const preparationSteps = [
    "Prepare a clean, quiet whelping area",
    "Gather towels, heating pads, and nesting materials",
    "Keep veterinarian contact information handy",
    "Have a weight scale ready for puppy weights",
    "Stock emergency supplies (forceps, dental floss, etc.)",
    "Prepare formula in case supplementation is needed"
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Whelping Preparation Guide</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {preparationSteps.map((step, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm">{step}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WelpingPreparationGuide;
